<template>
  <div class="viewer-container navbar-offset" v-if="!currentObject.loading && !currentExif.loading">
    <div class="image-container full navbar-offset">
      <NuxtImg class="main-image" placeholder placeholder-class="loading" loading="lazy" draggable="false"
               :src="finalURL"/>
      <circle-spinner stroke="white" class="image-loading-spinner"/>
      <div class="left-bar">
        <image-copyright/>
      </div>
      <div class="center-bar">
        <popup class="p8 top inline trigger-hover autowidth">
          <div @click="scrollToDetails" class="icon-btn">
            <icon :path="mdiInformationOutline"/>
          </div>
          <template #content>
            View details
          </template>
        </popup>
        <popup class="p8 top inline trigger-hover autowidth">
          <div class="icon-btn" @click="originalLoaded = !originalLoaded" :class="{active: originalLoaded}">
            <icon class="active-hidden" :path="mdiImageOutline"/>
            <icon class="active-only" :path="mdiImage"/>
          </div>
          <template #content>
            Load original
          </template>
        </popup>

        <popup class="p8 top inline trigger-hover autowidth">
          <div @click="downloadPhoto" class="icon-btn">
            <icon :path="mdiDownload"/>
          </div>
          <template #content>
            Download (Unavailable)
          </template>
        </popup>
      </div>
    </div>
    <div class="exif-message-container" v-if="resolveExif !== null">
      <div class="exifs">
        <div class="exif">
          <label>Shot at</label>
          <span>{{ resolvedExif.date }}</span>
        </div>
        <div class="exif">
          <label>Shot on</label>
          <div class="apple" v-if="resolvedExif.model.includes('iPhone')">
            <div class="device">Apple {{ resolvedExif.model }}</div>
          </div>
        </div>
        <div class="exif">
          <label>Resolution</label>
          <span>{{ resolvedExif.x }}px*{{ resolvedExif.y }}px</span>
        </div>
        <div class="exif">
          <label>Size (compressed)</label>
          <span>{{ (resolvedExif.filesize / 1000000).toFixed(1) }}<small>MB</small></span>
        </div>
        <div class="exif">
          <label>Time Offset</label>
          <span>{{ resolvedExif.timeOffset }} {{ getTimeOffsetName(resolvedExif.timeOffset) }}</span>
        </div>
        <div class="exif">
          <label>Focal Length</label>
          <span>{{ resolvedExif.focalLength }}<small>mm</small></span>
        </div>
        <div class="exif">
          <label>Aperature</label>
          <span><em>f</em>/{{ resolvedExif.aperature }}</span>
        </div>
        <div class="exif">
          <label>Exposure Time</label>
          <span>{{ resolvedExif.exposureTime }}<small>s</small></span>
        </div>
      </div>
      <hr/>
      <div class="map-information-container" v-if="resolvedExif.latitudeN && resolvedExif.longitudeE">
        <div class="map-container">
          <client-only>
            <exif-map v-model="imageCoord"/>
          </client-only>
        </div>
        <div class="right">
          <div class="location-container">
            <label>Location</label>
            <div v-if="currentGeo.loading" class="loading-location">
              <circle-spinner size="15"/>
              Loading location...
            </div>
            <div v-else class="location-contents">
              <div class="location-primary" :style="{'align-items': isRoad() ? 'center' : 'baseline'}">
                <span v-if="getSpotName() && !isRoad()">
                  {{ getSpotName() }}
                </span>
                <span class="center" v-else-if="getSpotName() && isRoad()">
                  <img alt="svg" style="margin: 8px 0" height="50px"
                       :src="`/road-svg/${getSpotName().toLowerCase()}.svg`" draggable="false"/>
                </span>
                <span :style="{'font-size': getSpotName() ? '85%' : ''}">
                  {{ currentGeo.data.name }}
                </span>
                <popup class="trigger-hover top p8 autowidth">
                  <badge class="light-blue" v-if="isInFlight()">
                    <icon :path="mdiAirplane"/>
                    IN FLIGHT
                  </badge>
                  <template #content>
                    <em>This photo is taken on the plane.</em>
                  </template>
                </popup>
              </div>
              <div class="location-secondary">{{ getGeoPrefix(currentGeo.data.name, currentGeo.data.ext_path) }}</div>
            </div>
          </div>
          <div class="lagi-longi-information-container">
            <div>
              <label>Latitude</label>
              <span>{{ resolvedExif.latitudeN[0] }}°{{ resolvedExif.latitudeN[1] }}'{{
                  resolvedExif.latitudeN[2]
                }}" <small>N</small></span>
            </div>
            <div>
              <label>Longitude</label>
              <span>{{ resolvedExif.longitudeE[0] }}°{{ resolvedExif.longitudeE[1] }}'{{
                  resolvedExif.longitudeE[2]
                }}" <small>E</small></span>
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
          <client-only>
            <div class="note">
              <icon :path="mdiInformationOutline"/>
              <p>
                <popup class="inline top trigger-hover">
                  <u clickable>Move your cursor here</u>
                  <template #content>
                    <h2>About GPS Information</h2>
                    <p>The GPS data displayed here is extracted from the photo and embedded in its <em>EXIF</em>
                      (Exchangeable Image File Format) metadata.</p>
                    <p>Typically, this information is captured by the camera's host through the GPS and automatically
                      written into the photo's EXIF metadata.</p>

                    <h3>Accuracy</h3>
                    <p>While generally reliable, the GPS data, especially the <em>GPS Speed</em> field, may not always
                      be 100% accurate.</p>
                    <p>On this site, the location data is manually verified to ensure accuracy. Errors on location are
                      rare, though.</p>

                    <h3>Wow, there are photos taken on the plane with GPS data.</h3>
                    <p>Yes, GPS signals can sometimes be received even on a plane. As long as your phone isn't in
                      Airplane Mode, GPS data may still be logged.</p>
                    <p>However, please note that using electronic devices that transmit signals during a flight can be
                      prohibited for safety reasons. Always follow the crew's instructions and turn off your device if
                      asked!</p>
                  </template>
                </popup>
                to learn more about these information.
              </p>
            </div>
          </client-only>
        </div>
      </div>
      <div class="center full" v-else>
        <em>This photo has no GPS information attached.</em>
      </div>
      <hr/>
      <div class="external-caption-container">
        <label>Captions</label>
        <div class="caption-content">
          <p>这张照片是在 2 月 11 日归程的飞机上拍摄的，因此海拔和速度都比较高，GPS
            定位到的地点大概在兰州的东北部（白银），下面亮着灯的地方应该就是兰州或者白银了。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Delayed, Exif, FrameResp, Geo, SpecialSpot} from "@/types";
import type {CollectionFile} from "@/server/utils/getCollection";
import {
  mdiAirplane,
  mdiDownload,
  mdiImage,
  mdiImageOutline,
  mdiImagePlus,
  mdiImageRefresh,
  mdiInformationOutline
} from "@mdi/js";
import Popup from "@/components/popup.vue";
import translateExifDate from "@/utils/translateExifDate";
import ImageCopyright from "~/components/image-copyright.vue";

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
const currentGeo = reactive<Delayed<Geo>>({
  loading: true,
  data: {}
})
const specialSpotLoading = ref(true);
const currentSpecialSpot = ref<SpecialSpot[]>([]);

const resolvedExif = computed(() => resolveExif(currentExif.data as Exif));
const imageCoord = ref([0, 0]);

const originalLoaded = ref(false);

const finalURL = computed(() => originalLoaded.value ? currentObject.data.url : toThumbnail1080p(currentObject.data.url));

function toThumbnail1080p(url: string) {
  return url + '?x-oss-process=image/resize,h_1080';
}

interface ResolvedExif {
  date: string,
  timeOffset: string,
  model: string,
  altitude: number,
  latitudeN: number[] | null,
  longitudeE: number[] | null,
  x: number,
  y: number,
  filesize: number,
  format: string,
  lensModel: string,
  focalLength: number,
  aperature: number,
  gpsspeed: number,
  gpsspeedref: string,
  exposureTime: string
}

function getTimeOffsetName(offset: string) {
  switch (offset) {
    case '+08:00':
      return 'China Standard Time';
  }
}

function scrollToDetails() {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  })
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


  const date = translateExifDate(exif.DateTime.value);

  if (date === null) throw new Error();

  const longiLatiRegex = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;
  let longiExecuted: RegExpExecArray | null = null;
  let latiExecuted: RegExpExecArray | null = null;
  if (exif.GPSLongitude) longiExecuted = longiLatiRegex.exec(exif.GPSLongitude.value);
  if (exif.GPSLatitude) latiExecuted = longiLatiRegex.exec(exif.GPSLatitude.value);

  const lensModelRegex = /(\d+)\.(\d+)mm f\/(\d+)\.(\d+)/;
  const lensModelExecuted = lensModelRegex.exec(exif.LensModel.value);

  if (!lensModelExecuted) throw new Error();

  const result = {
    date: date.format("YYYY/MM/DD HH:mm:ss"),
    timeOffset: exif.OffsetTime.value,
    model: exif.Model.value,
    altitude: exif.GPSAltitude ? eval(exif.GPSAltitude.value) : -1,
    latitudeN: latiExecuted ? [1, 2, 3, 4].map(x => Number(latiExecuted[x])) : null,
    longitudeE: longiExecuted ? [1, 2, 3, 4].map(x => Number(longiExecuted[x])) : null,
    x: Number(exif.PixelXDimension.value),
    y: Number(exif.PixelYDimension.value),
    filesize: Number(exif.FileSize.value),
    format: exif.Format.value,
    lensModel: exif.LensModel.value,
    focalLength: Number(`${lensModelExecuted[1]}.${lensModelExecuted[2]}`),
    aperature: Number(`${lensModelExecuted[3]}.${lensModelExecuted[4]}`),
    gpsspeed: exif.GPSSpeed ? eval(exif.GPSSpeed.value) : -1,
    gpsspeedref: exif.GPSSpeedRef ? exif.GPSSpeedRef.value : '',
    exposureTime: exif.ExposureTime.value
  }

  if (result.latitudeN && result.longitudeE) imageCoord.value = toWGS84(result.latitudeN, result.longitudeE);

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

async function retrieveGeo(coord: number[]) {
  const res = await $fetch<FrameResp<Geo>>(`/api/get-geo?x=${coord[0]}&y=${coord[1]}&depth=2`);

  if (res.code === 'ng') {
    console.error(res);
    return;
  }

  Object.assign(currentGeo.data, res);
  currentGeo.loading = false;
}

async function retrieveSpecialSpotInfo(name: string) {
  const res = await $fetch<FrameResp<SpecialSpot[]>>(`/api/get-special-spot?name=${btoa(name)}`);

  specialSpotLoading.value = false;

  if (res.code === 'ng') {
    console.error(res);
    return;
  }

  currentSpecialSpot.value.push(...res.data);
}

function getGeoPrefix(name: string, ext_path: string) {
  return ext_path.replace(` ${name}`, '');
}

function downloadPhoto() {
  alert('Download is not available at present.');
}

function isInFlight() {
  return currentSpecialSpot.value.some(x => x.type === 'flight');
}

function isRoad() {
  return currentSpecialSpot.value.some(x => x.type === 'road');
}

function getSpotName() {
  if (currentSpecialSpot.value.length > 0) if (currentSpecialSpot.value[0].type !== 'flight') return currentSpecialSpot.value[0].name as string;
  return '';
}

await retrieveCurrentObject();
await retrieveCurrentExif();
await retrieveSpecialSpotInfo(currentObject.data.name);

watch(imageCoord, async x => {
  if (x[0] !== 0 && x[1] !== 0) {
    await retrieveGeo(imageCoord.value);
  }
})
</script>

<style lang="scss">
.center-bar {
  .popup-container .popup {
    border: none;
    background: rgba(0, 0, 0, .4);
    backdrop-filter: blur(2px);
    color: white;
    margin-bottom: 8px;
  }
}
</style>

<style lang="scss" scoped>
@use "assets/global";

.active-only {
  display: none;
}

.active .active-only {
  display: block;
}

.active .active-hidden {
  display: none;
}

.note {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;

  svg {
    height: 18px;
  }
}

.location-container, .external-caption-container {
  label {
    font-size: 22.4px;
    font-weight: bold;
    font-style: italic;
  }
}

.location-container {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .loading-location {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    margin-top: 16px;
  }

  .location-contents {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .location-primary {
      font-size: 30px;
      display: inline-flex;
      gap: 10px;
    }

    .location-secondary {
      font-size: 18px;
    }
  }
}

.external-caption-container {
  .caption-content {
    font-size: 20px;
    line-height: 1.5;
  }
}

.map-information-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 32px;

  .right {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .lagi-longi-information-container {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    grid-gap: 32px;

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

  .left-bar, .center-bar {
    position: absolute;
    bottom: 0;
  }

  .left-bar {
    left: 0;
  }

  .center-bar {
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    gap: 16px;

    .p8 {
      line-height: 0.7;
    }

    .icon-btn {
      border-radius: 100%;
      opacity: .5;
      cursor: pointer;
      padding: 8px;
      transition: all .2s ease;
      height: 32px;
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: rgba(0, 0, 0, .9);

      &.active {
        background: rgba(0, 0, 0, .8) !important;
        backdrop-filter: blur(3px);
        opacity: 1;
      }

      &:hover {
        background: rgba(0, 0, 0, .6);
        opacity: 1;
      }

      svg {
        color: white;
      }
    }
  }

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
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 32px;

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

      > small {
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