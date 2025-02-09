<template>
  <div :lang="lang" class="viewer-container navbar-offset" v-if="!currentImage.loading && !currentExif.loading">
    <div class="image-container full navbar-offset">
      <NuxtImg ref="mainImage" class="main-image" placeholder placeholder-class="loading" draggable="false"
        :src="finalURL" />
      <circle-spinner stroke="white" class="image-loading-spinner" />
      <div class="copyright-bar">
        <image-copyright :year="translateExifDate(currentExif.data.DateTime.value)?.format('YYYY')" />
      </div>
      <div class="center-bar">
        <popup class="p8 top inline trigger-hover autowidth">
          <div @click="scrollToDetails" class="icon-btn">
            <icon :path="mdiInformationOutline" />
          </div>
          <template #content>
            {{ t('view.viewDetails') }}
          </template>
        </popup>
        <popup class="p8 top inline trigger-hover autowidth">
          <div class="icon-btn" @click="originalLoaded = !originalLoaded" :class="{ active: originalLoaded }">
            <icon class="active-hidden" :path="mdiImageOutline" />
            <icon class="active-only" :path="mdiImage" />
          </div>
          <template #content>
            {{ t('view.loadOriginal') }}
          </template>
        </popup>

        <popup class="p8 top inline trigger-hover autowidth">
          <div @click="downloadPhoto" class="icon-btn">
            <icon :path="mdiDownload" />
          </div>
          <template #content>
            {{ t('view.download') }}
          </template>
        </popup>

        <popup class="p8 top inline trigger-hover autowidth">
          <div @click="toggle" class="icon-btn">
            <icon :path="mdiFullscreen" />
          </div>
          <template #content>
            {{ t('view.enterFullscreen') }}
          </template>
        </popup>
      </div>
    </div>
    <div class="exif-message-container" v-if="resolveExif !== null">
      <div class="external-caption-container" v-if="captions.length > 0">
        <label>{{ t('view.details.captions') }}</label>
        <div class="caption-content" v-html="captions" />
      </div>
      <hr v-if="captions.length > 0">
      <div class="exifs">
        <div class="exif">
          <label>{{ t('view.details.shotAt') }}</label>
          <span>{{ resolvedExif.date }}</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.shotOn') }}</label>
          <div class="apple" v-if="resolvedExif.make === 'Apple'">
            <div class="device">Apple {{ resolvedExif.model }}</div>
          </div>
        </div>
        <div class="exif">
          <label>{{ t('view.details.resolution') }}</label>
          <span>{{ resolvedExif.x }}px*{{ resolvedExif.y }}px</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.size') }}</label>
          <span>{{ (resolvedExif.filesize / 1000000).toFixed(1) }}<small>MB</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.timezone') }}</label>
          <span>UTC{{ resolvedExif.timeOffset }} <small>{{ getTimeOffsetName(resolvedExif.timeOffset) }}</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.focalLength') }}</label>
          <span>{{ resolvedExif.focalLength }}<small>mm</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.aperature') }}</label>
          <span><em>f</em>/{{ resolvedExif.aperature }}</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.exposureTime') }}</label>
          <span>{{ resolvedExif.exposureTime }}<small>s</small></span>
        </div>
      </div>
      <hr />
      <div class="map-information-container" v-if="resolvedExif.latitudeN && resolvedExif.longitudeE">
        <div class="map-container">
          <client-only>
            <exif-map v-model="imageCoord" />
          </client-only>
        </div>
        <div class="right">
          <div class="location-container">
            <label>{{ t('view.details.location') }}</label>
            <div v-if="currentGeo.loading" class="loading-location">
              <circle-spinner size="15" />
              {{ t('view.details.loadingLocation') }}
            </div>
            <div v-else class="location-contents">
              <div class="location-primary">
                <span class="center" v-if="isRoad()">
                  <img alt="svg" height="50px" :src="`/road-svg/${getSpecialSpotName('road').toLowerCase()}.svg`"
                    draggable="false" />
                </span>
                <span class="center" v-if="isSubwayStation()">
                  <img alt="svg" height="40px" :src="`/subway-svg/${getSubwayStationInfo()?.line}.svg`"
                    draggable="false" />
                </span>
                <span v-if="isSpot() && !isSubwayStation()">
                  {{ getSpecialSpotName('spot') }}
                </span>
                <span v-else-if="isSubwayStation()">
                  {{ getSubwayStationInfo()?.station }}
                </span>
                <span :style="{ 'font-size': isRoad() || isSpot() || isSubwayStation() ? '85%' : '' }">
                  {{ geoName }}
                </span>
                <popup class="trigger-hover top p8 autowidth">
                  <badge class="light-blue" v-if="isInFlight()">
                    <icon :path="mdiAirplane" />
                    {{ t('view.details.inflight') }}
                  </badge>
                  <template #content>
                    <span>{{ t('view.details.inflightNote') }}</span>
                  </template>
                </popup>
              </div>
              <div class="location-secondary">{{ geoExtPathPrefix }}</div>
            </div>
          </div>
          <div class="lagi-longi-information-container">
            <div>
              <label>{{ t('view.details.latitude') }}</label>
              <span>{{ resolvedExif.latitudeN[0] }}°{{ resolvedExif.latitudeN[1] }}'{{
                resolvedExif.latitudeN[2]
                }}" <small>N</small></span>
            </div>
            <div>
              <label>{{ t('view.details.longitude') }}</label>
              <span>{{ resolvedExif.longitudeE[0] }}°{{ resolvedExif.longitudeE[1] }}'{{
                resolvedExif.longitudeE[2]
                }}" <small>E</small></span>
            </div>
            <div>
              <label>{{ t('view.details.altitude') }}</label>
              <span>{{ resolvedExif.altitude.toFixed(2) }} <small>m</small></span>
            </div>
            <div>
              <label>{{ t('view.details.speed') }}</label>
              <span>{{ resolvedExif.gpsspeed > 0 ? resolvedExif.gpsspeed.toFixed(2) : t('view.gpsSpeedZero') }} <small
                  v-if="resolvedExif.gpsspeed > 0.1">km/h</small></span>
            </div>
          </div>
          <client-only>
            <div class="note">
              <div class="note-item" v-if="hasHWA()">
                <icon :path="mdiAlertOutline" />
                <span>{{ t('view.hwaWarning') }}</span>
              </div>
              <div class="note-item">
                <icon :path="mdiInformationOutline" />
                <span>
                  <popup class="inline top trigger-hover">
                    <u clickable>{{ t('view.aboutGPSInformation') }}</u>
                    <template #content>
                      <template v-if="lang === 'en'">
                        <h2>About GPS Information</h2>
                        <p>The GPS information displayed here is extracted from the <em>EXIF</em>
                          (Exchangeable Image File Format) metadata embedded in the photo.</p>
                        <p>Usually, it's captured by the <em>camera host</em> through the GPS and
                          automatically written into the photo.</p>
                        <p>While generally reliable, the GPS data, especially the <em>GPS Speed</em> field, may not
                          always be accurate.</p>
                      </template>
                      <template v-if="lang === 'zh'">
                        <h2>关于 GPS 信息</h2>
                        <p>此页面展示的 GPS 信息是从照片中自带的 <em>EXIF</em> (Exchangeable Image File Format) 元数据中提取的。</p>
                        <p>一般情况下，这些定位的信息都是由拍摄设备与全球卫星定位系统（GPS）通讯后，自动写入到图片的 EXIF 中。</p>
                        <p>关于准确性，通常不会有太大的偏差，但这些数据并非 100% 准确，尤其是 <em>GPS 速度</em> 这一部分的数据。</p>
                      </template>
                    </template>
                  </popup>
                </span>
              </div>
            </div>
          </client-only>
        </div>
      </div>
      <div class="center full" v-else>
        {{ t('view.noGPS') }}
      </div>
    </div>
  </div>

  <div class="navigation-toggle" @click="navigationPanelEnabled = true">
    <icon :path="mdiPlus" />
  </div>

  <navigation-panel v-model="navigationPanelEnabled" :prev-name="prevImageName" :next-name="nextImageName"
    :current-collection-name="currentCollectionName" :prev-image-viewer-path="prevImageViewerPath"
    :next-image-viewer-path="nextImageViewerPath" />
</template>

<script setup lang="ts">
  import type { CollectionDataBody, Delayed, Exif, FrameResp, Geo, NullableString, SpecialSpot } from "@/types";
  import {
    mdiAirplane, mdiAlertOutline,
    mdiArrowLeft,
    mdiArrowRight,
    mdiDownload, mdiFullscreen,
    mdiImage,
    mdiImageOutline,
    mdiInformationOutline,
    mdiPlus
  } from "@mdi/js";
  import Popup from "@/components/popup.vue";
  import translateExifDate from "@/utils/translateExifDate";
  import ImageCopyright from "@/components/image-copyright.vue";
  import { useFullscreen } from "@vueuse/core";

  const lang = useLanguage();

  const navigationPanelEnabled = ref(false);

  const geoName = computed(() => withFallback(lang.value, currentGeo.data.en_name, currentGeo.data.name));
  const geoExtPath = computed(() => withFallback(lang.value, currentGeo.data.en_ext_path, currentGeo.data.ext_path));
  const geoExtPathPrefix = computed(() => geoExtPath.value.replace(`${geoName.value}`, '').replace(', ', ''));

  const route = useRoute();
  const remotePath = route.params.remotePath as string;

  const currentImage = reactive<Delayed<CollectionDataBody>>({
    loading: true,
    data: {
      name: "",
      url: "",
      lastModified: "",
      etag: "",
      type: "",
      size: 0,
      storageClass: "",
      owner: null
    }
  });

  const prevImageName = ref('');
  const nextImageName = ref('');

  const currentCollectionName = computed(() => getCollectionNameByRemotePath(remotePath));
  const nextImageViewerPath = computed(() => buildViewerPath(currentCollectionName.value, getImageNameByRemotePath(nextImageName.value)));
  const prevImageViewerPath = computed(() => buildViewerPath(currentCollectionName.value, getImageNameByRemotePath(prevImageName.value)));

  const currentExif = reactive<Delayed<Exif>>({
    loading: true,
    data: {
      ApertureValue: {
        value: ""
      },
      BrightnessValue: {
        value: ""
      },
      ColorSpace: {
        value: ""
      },
      CompositeImage: {
        value: ""
      },
      DateTime: {
        value: ""
      },
      DateTimeDigitized: {
        value: ""
      },
      DateTimeOriginal: {
        value: ""
      },
      DigitalZoomRatio: {
        value: ""
      },
      ExifTag: {
        value: ""
      },
      ExifVersion: {
        value: ""
      },
      ExposureBiasValue: {
        value: ""
      },
      ExposureMode: {
        value: ""
      },
      ExposureProgram: {
        value: ""
      },
      ExposureTime: {
        value: ""
      },
      FNumber: {
        value: ""
      },
      FileSize: {
        value: ""
      },
      Flash: {
        value: ""
      },
      FocalLength: {
        value: ""
      },
      FocalLengthIn35mmFilm: {
        value: ""
      },
      Format: {
        value: ""
      },
      FrameCount: {
        value: ""
      },
      GPSAltitude: {
        value: ""
      },
      GPSAltitudeRef: {
        value: ""
      },
      GPSDateStamp: {
        value: ""
      },
      GPSDestBearing: {
        value: ""
      },
      GPSDestBearingRef: {
        value: ""
      },
      GPSHPositioningError: {
        value: ""
      },
      GPSImgDirection: {
        value: ""
      },
      GPSImgDirectionRef: {
        value: ""
      },
      GPSLatitude: {
        value: ""
      },
      GPSLatitudeRef: {
        value: ""
      },
      GPSLongitude: {
        value: ""
      },
      GPSLongitudeRef: {
        value: ""
      },
      GPSSpeed: {
        value: ""
      },
      GPSSpeedRef: {
        value: ""
      },
      GPSTag: {
        value: ""
      },
      GPSTimeStamp: {
        value: ""
      },
      HostComputer: {
        value: ""
      },
      ISOSpeedRatings: {
        value: ""
      },
      ImageHeight: {
        value: ""
      },
      ImageWidth: {
        value: ""
      },
      LensMake: {
        value: ""
      },
      LensModel: {
        value: ""
      },
      LensSpecification: {
        value: ""
      },
      Make: {
        value: ""
      },
      MakerNote: {
        value: ""
      },
      MeteringMode: {
        value: ""
      },
      Model: {
        value: ""
      },
      OffsetTime: {
        value: ""
      },
      OffsetTimeDigitized: {
        value: ""
      },
      OffsetTimeOriginal: {
        value: ""
      },
      Orientation: {
        value: ""
      },
      PixelXDimension: {
        value: ""
      },
      PixelYDimension: {
        value: ""
      },
      ResolutionUnit: {
        value: ""
      },
      SceneType: {
        value: ""
      },
      SensingMethod: {
        value: ""
      },
      ShutterSpeedValue: {
        value: ""
      },
      Software: {
        value: ""
      },
      SourceExposureTimesOfCompositeImage: {
        value: ""
      },
      SourceImageNumberOfCompositeImage: {
        value: ""
      },
      SubSecTimeDigitized: {
        value: ""
      },
      SubSecTimeOriginal: {
        value: ""
      },
      SubjectArea: {
        value: ""
      },
      WhiteBalance: {
        value: ""
      },
      XResolution: {
        value: ""
      },
      YResolution: {
        value: ""
      }
    }
  });
  const currentGeo = reactive<Delayed<Geo>>({
    loading: true,
    data: {
      id: 0,
      pid: 0,
      deep: 0,
      name: "",
      ext_path: "",
      geo: "",
      polygon: []
    }
  })
  const specialSpotLoading = ref(true);
  const currentSpecialSpot = ref<SpecialSpot[]>([]);

  const captions = ref('');

  const resolvedExif = computed(() => resolveExif(currentExif.data as Exif));
  const imageCoord = ref([0, 0]);

  const originalLoaded = ref(false);

  const finalURL = computed(() => originalLoaded.value ? currentImage.data.url : toThumbnail1080p(currentImage.data.url));

  const mainImage = ref<HTMLElement | null>(null);
  const { isFullscreen, enter, exit, toggle } = useFullscreen(mainImage);

  function toThumbnail1080p(url: string) {
    return url + '?x-oss-process=image/resize,h_1080';
  }

  interface ResolvedExif {
    date: string,
    timeOffset: string,
    model: string,
    make: string,
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
        return 'Asia/Shanghai';
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

    if (date === null) throw new Error('cannot translate date');

    const longiLatiRegex = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;
    let longiExecuted: RegExpExecArray | null = null;
    let latiExecuted: RegExpExecArray | null = null;
    if (exif.GPSLongitude) longiExecuted = longiLatiRegex.exec(exif.GPSLongitude.value);
    if (exif.GPSLatitude) latiExecuted = longiLatiRegex.exec(exif.GPSLatitude.value);

    const lensModelRegex = /([\d.]+)mm f\/([\d.]+)/;
    const lensModelExecuted = lensModelRegex.exec(exif.LensModel.value);

    if (!lensModelExecuted) throw new Error('cannot translate lens model');

    let timeOffset = "+08:00";
    // prevent empty
    if (exif.OffsetTime) if (exif.OffsetTime.value) if (exif.OffsetTime.value.trim().length > 0) timeOffset = exif.OffsetTime.value;

    const result = {
      make: exif.Make.value,
      date: date.format("YYYY/MM/DD HH:mm:ss"),
      timeOffset,
      model: exif.Model.value,
      altitude: exif.GPSAltitude ? eval(exif.GPSAltitude.value) : -1,
      latitudeN: latiExecuted ? [1, 2, 3, 4].map(x => Number(latiExecuted?.[x])) : null,
      longitudeE: longiExecuted ? [1, 2, 3, 4].map(x => Number(longiExecuted?.[x])) : null,
      x: Number(exif.PixelXDimension.value),
      y: Number(exif.PixelYDimension.value),
      filesize: Number(exif.FileSize.value),
      format: exif.Format.value,
      lensModel: exif.LensModel.value,
      focalLength: Number(`${lensModelExecuted[1]}`),
      aperature: Number(`${lensModelExecuted[2]}`),
      gpsspeed: exif.GPSSpeed ? eval(exif.GPSSpeed.value) : -1,
      gpsspeedref: exif.GPSSpeedRef ? exif.GPSSpeedRef.value : '',
      exposureTime: exif.ExposureTime.value
    }

    if (result.latitudeN && result.longitudeE) imageCoord.value = toWGS84(result.latitudeN, result.longitudeE);

    return result;
  }

  async function retrieveCurrentExif() {
    const res = await $fetch<FrameResp<Exif>>(`/api/get-exif?remotePath=${btoa(remotePath)}`)

    if (res.code === 'ng') {
      console.error(res);
      return;
    }

    Object.assign(currentExif.data, res);
    currentExif.loading = false;
  }

  async function retrieveCurrentObject() {
    const res = await $fetch<FrameResp<CollectionDataBody>>(`/api/get-object?remotePath=${btoa(remotePath)}`);

    if (res.code === 'ng') {
      console.error(res);
      return;
    }

    Object.assign(currentImage.data, res);
    currentImage.loading = false;
  }

  async function retrieveGeo(name: string, coord: number[]) {
    const res = await $fetch<FrameResp<Geo>>(`/api/get-geo?name=${btoa(name)}&x=${coord[0]}&y=${coord[1]}&depth=2`);

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

  async function retrieveCaptions(name: string) {
    const res = await $fetch<FrameResp<string>>(`/api/get-captions?name=${btoa(name)}`);

    if (res.code === 'ng') {
      console.error(res);
      return;
    }

    captions.value = res.data;
  }

  async function retrievePrevNext(name: string) {
    const res = await $fetch<FrameResp<{ prev: NullableString, next: NullableString }>>(`/api/get-prev-next?remotePath=${btoa(name)}`);

    if (res.code === 'ng') {
      console.error(res);
      return;
    }

    if (res.data.prev !== null) prevImageName.value = res.data.prev;
    if (res.data.next !== null) nextImageName.value = res.data.next;
  }

  function downloadPhoto() {
    alert('Download is not available at present.');
  }

  function isInFlight() {
    return currentSpecialSpot.value.some(x => x.type === 'flight');
  }

  function isSubwayStation() {
    return currentSpecialSpot.value.some(x => x.type === 'subway-station');
  }

  function isRoad() {
    return currentSpecialSpot.value.some(x => x.type === 'road');
  }

  function isSpot() {
    return currentSpecialSpot.value.some(x => x.type === 'spot');
  }

  function getSpecialSpotName(type: 'spot' | 'road') {
    const spotInfo = currentSpecialSpot.value.filter(x => x.type === type);
    if (spotInfo.length === 0) return '';
    // @ts-ignore
    return spotInfo[0].name;
  }

  function getSubwayStationInfo() {
    const spotInfo = currentSpecialSpot.value.filter(x => x.type === 'subway-station');
    if (spotInfo.length === 0) return null;
    return spotInfo[0];
  }

  await retrieveCurrentObject();
  await retrieveCurrentExif();
  await retrieveSpecialSpotInfo(currentImage.data.name);
  await retrieveCaptions(currentImage.data.name);
  await retrievePrevNext(currentImage.data.name)

  watch(imageCoord, async x => {
    if (x[0] !== 0 && x[1] !== 0) {
      await retrieveGeo(currentImage.data.name, imageCoord.value);
    }
  })
</script>

<style lang="scss" scoped>
@use 'assets/global';

.navigation-toggle {
  width: 64px;
  height: 64px;
  position: fixed;
  right: 32px;
  bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: global.$primaryd;
  color: white;
  box-shadow: 0 4px 5px rgba(0, 0, 0, .4);
  border-radius: 100%;
  cursor: pointer;
  transition: all .2s ease;

  &:hover {
    background: global.$primarydd;
    box-shadow: 0 8px 10px rgba(0, 0, 0, .4);
    transform: translateY(-2px);
  }
}
</style>

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

.main-image {
  @media (max-width: 768px) {
    width: 100%;
    object-fit: contain;
  }

  &.loading {
    opacity: 0;
    position: absolute;
  }
}

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
  flex-direction: column;

  .note-item {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 1.5;

    svg {
      height: 18px;
    }
  }
}

label {
  font-size: 22.4px;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 17px;
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
      align-items: end;
      flex-wrap: wrap;

      img {
        max-width: 100%;
        object-fit: contain;
      }
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

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

  .copyright-bar,
  .center-bar {
    position: absolute;
    bottom: 0;
  }

  .copyright-bar {
    left: 0;

    @media (max-width: 1100px) {
      left: unset;
      bottom: unset;
      top: 0;
      right: 0;
    }
  }

  .center-bar {
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    gap: 16px;

    @media (max-width: 768px) {
      padding-bottom: 32px;
    }

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

  .loading+.image-loading-spinner {
    opacity: 1;
  }
}

.exif-message-container {
  padding: 32px;
  overflow: hidden;

  .exifs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 32px;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 16px;
    }

    .exif {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 28px;

      @media (max-width: 768px) {
        font-size: 22px;
      }

      >small {
        font-size: 50%;
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
          font-family: 'SF Pro Display', 'Inter', global.$fontFamilySet;

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