<template>
  <div class="viewer-container navbar-offset" v-if="!currentObject.loading && !currentExif.loading">
    <div class="image-container full navbar-offset">
      <NuxtImg class="main-image" placeholder placeholder-class="loading" loading="lazy" draggable="false"
               :src="toThumbnail1080p(currentObject.data.url)"/>
      <circle-spinner stroke="white" class="image-loading-spinner"/>
    </div>
    <div class="exif-message-container" v-if="resolveExif !== null">
      <div class="exifs">
        <div class="exif">
          <label>Shot at</label>
          <span>{{ formatDate(resolvedExif.date) }}</span>
          <small>UTC{{ resolvedExif.timeOffset }} {{ getTimeOffsetName(resolvedExif.timeOffset) }}</small>
        </div>
        <div class="exif">
          <label>Shot on</label>
          <div class="apple" v-if="resolvedExif.model.includes('iPhone')">
            <div class="device">Apple {{ resolvedExif.model }}</div>
          </div>
          <small v-if="resolvedExif.model.includes('iPhone')">{{ resolvedExif.lensModel }}</small>
        </div>
        <div class="exif">
          <label>Resolution</label>
          <span>{{ resolvedExif.x }}px*{{ resolvedExif.y }}px</span>
          <small>{{ (resolvedExif.filesize / 1000000).toFixed(1) }}MB (compressed) · {{ resolvedExif.format }}</small>
        </div>
      </div>
      <div class="map-information-container">
        <div class="map-container">
          <client-only>
            <exif-map v-model="imageCoord"/>
          </client-only>
        </div>
        <div class="lagi-longi-information-container">
          <div>
            <label>Lagitude</label>
            <span>{{ resolvedExif.latitudeN[0] }}° {{ resolvedExif.latitudeN[1] }}' {{
                resolvedExif.latitudeN[2]
              }}'' <small>N</small></span>
          </div>
          <div>
            <label>Longitude</label>
            <span>{{ resolvedExif.longitudeE[0] }}° {{ resolvedExif.longitudeE[1] }}' {{ resolvedExif.longitudeE[2] }}'' <small>E</small></span>
          </div>
          <div>
            <label>Altitude</label>
            <span>{{ resolvedExif.altitude.toFixed(2) }} <small>m</small></span>
          </div>
          <div>
            <label>Speed (GPS)</label>
            <span>{{ resolvedExif.gpsspeed.toFixed(2) }} <small>km/h</small></span>
          </div>
        </div>
      </div>
      <div class="external-caption-container">
        <label>Captions</label>
        <div class="caption-content">
          <p>这张照片是在 2 月 11 日归程的飞机上拍摄的，因此海拔和速度都比较高，GPS 定位到的地点大概在兰州的东北部（白银），下面亮着灯的地方应该就是兰州或者白银了。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Delayed, Exif, FrameResp} from "@/types";
import type {CollectionFile} from "@/server/utils/getCollection";
import formatDate from "../../utils/formatDate";

const route = useRoute();
const remotePath = route.params.remotePath as string;
const currentObject = reactive<Delayed<CollectionFile>>({
  loading: true,
  data: {}
});
const currentExif = reactive<Delayed<Exif>>({
  loading: true,
  data: {}
});
const resolvedExif = computed(() => resolveExif(currentExif.data as Exif));
const imageCoord = ref([0, 0]);

function toThumbnail1080p(url: string) {
  return url + '?x-oss-process=image/resize,h_1080';
}

interface ResolvedExif {
  date: Date,
  timeOffset: string,
  model: string,
  altitude: number,
  latitudeN: number[],
  longitudeE: number[],
  x: number,
  y: number,
  filesize: number,
  format: string,
  lensModel: string,
  focalLength: number,
  aperature: number,
  gpsspeed: number,
  gpsspeedref: string
}

function getTimeOffsetName(offset: string) {
  switch (offset) {
    case '+08:00':
      return 'China Standard Time';
  }
}

function toWGS84(latitudeArray: number[], longitudeArray: number[]) {
  let lat = latitudeArray[0];
  let lng = longitudeArray[0];

  lat += latitudeArray[1] * (1 / 60);
  lng += longitudeArray[1] * (1 / 60);

  const latSec = Number(`${latitudeArray[2]}.${latitudeArray[3]}`);
  const lonSec = Number(`${longitudeArray[2]}.${longitudeArray[3]}`);

  lat += latSec * (1 / 3600);
  lng += lonSec * (1 / 3600);

  return [lng, lat];
}

function resolveExif(exif: Exif): ResolvedExif {
  // @ts-ignore
  if (!exif.ApertureValue.value) return null;

  const datetimeExecuted = /(\d+):(\d+):(\d+) (\d+):(\d+):(\d+)/.exec(exif.DateTime.value);
  if (!datetimeExecuted) throw new Error();
  const date = new Date(`${datetimeExecuted[1]}-${datetimeExecuted[2]}-${datetimeExecuted[3]}T${datetimeExecuted[4]}:${datetimeExecuted[5]}:${datetimeExecuted[6]}`)

  const longiLatiRegex = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;
  const longiExecuted = longiLatiRegex.exec(exif.GPSLongitude.value);
  const latiExecuted = longiLatiRegex.exec(exif.GPSLatitude.value);

  if (!longiExecuted || !latiExecuted) throw new Error();

  const lensModelRegex = /(\d+)\.(\d+)mm f\/(\d+)\.(\d+)/;
  const lensModelExecuted = lensModelRegex.exec(exif.LensModel.value);

  if (!lensModelExecuted) throw new Error();

  const result = {
    date: date,
    timeOffset: exif.OffsetTime.value,
    model: exif.Model.value,
    altitude: eval(exif.GPSAltitude.value),
    latitudeN: [1, 2, 3, 4].map(x => Number(latiExecuted[x])),
    longitudeE: [1, 2, 3, 4].map(x => Number(longiExecuted[x])),
    x: Number(exif.PixelXDimension.value),
    y: Number(exif.PixelYDimension.value),
    filesize: Number(exif.FileSize.value),
    format: exif.Format.value,
    lensModel: exif.LensModel.value,
    focalLength: Number(`${lensModelExecuted[1]}.${lensModelExecuted[2]}`),
    aperature: Number(`${lensModelExecuted[3]}.${lensModelExecuted[4]}`),
    gpsspeed: eval(exif.GPSSpeed.value),
    gpsspeedref: exif.GPSSpeedRef.value
  }

  imageCoord.value = toWGS84(result.latitudeN, result.longitudeE);

  return result;
}

async function retrieveCurrentExif() {
  const res = await $fetch<FrameResp<Exif>>(`/api/get-exif?name=${btoa(remotePath)}`)

  if (res.code === 'ng') {
    console.error(res);
    return;
  }

  Object.assign(currentExif.data, res);
  currentExif.loading = false;
}

async function retrieveCurrentObject() {
  const res = await $fetch<FrameResp<CollectionFile>>(`/api/get-object?remotePath=${btoa(remotePath)}`);

  if (res.code === 'ng') {
    console.error(res);
    return;
  }

  Object.assign(currentObject.data, res);
  currentObject.loading = false;
}

await retrieveCurrentObject();
await retrieveCurrentExif();
</script>

<style lang="scss" scoped>
@use "assets/global";

.external-caption-container {
  margin-top: 32px;

  label {
    font-size: 22.4px;
    font-weight: bold;
    font-style: italic;
  }

  .caption-content {
    font-size: 20px;
    line-height: 1.5;
  }
}

.map-information-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 32px;
  margin-top: 32px;

  .lagi-longi-information-container {
    display: flex;
    flex-direction: column;
    gap: 16px;

    div {
      flex: 1;
      font-size: 28px;
      display: flex;
      flex-direction: column;

      label {
        font-size: 80%;
        font-weight: bold;
        font-style: italic;
      }

      span {
        margin-top: 8px;
      }
    }
  }
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, .8);
  overflow: hidden;

  img {
    height: 100%;
    box-shadow: 0 0 15px rgba(0, 0, 0, .2);
  }

  .image-loading-spinner {
    opacity: 0;
  }

  .loading + .image-loading-spinner {
    opacity: 1;
  }
}

.exif-message-container {
  padding: 32px;

  .exifs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    .exif {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 28px;

      label {
        font-weight: bold;
        font-size: 80%;
        font-style: italic;
      }

      small {
        font-size: 14px;
        color: #aaa;
      }

      .apple {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .device {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
          font-family: 'SF Pro Display', global.$fontFamilySet;

          svg {
            height: 30px;
          }
        }

        .camera {
          display: flex;
          align-items: center;
          font-size: 14px;
        }
      }
    }
  }
}
</style>