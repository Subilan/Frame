<template>
  <Title>
    {{ lang === 'zh' ? '查看' : 'View' }} {{ !currentImage.loading ? getImageNameByRemotePath(currentImage.data.result.name) : ''
    }}
  </Title>
  <div :lang="lang" class="viewer-container navbar-offset" v-if="!currentImage.loading">
    <div class="image-container full navbar-offset">
      <NuxtImg ref="mainImage" class="main-image" placeholder placeholder-class="loading" draggable="false"
        :src="finalURL" @load="imageLoaded" />
      <circle-spinner stroke="white" class="image-loading-spinner" />
      <div class="copyright-bar" v-if="currentImage.data.result.meta.date">
        <image-copyright :year="getDayjs()(currentImage.data.result.meta.date)?.format('YYYY')" />
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
    <div class="exif-message-container" v-if="!currentImage.loading">
      <template v-if="currentImage.data.result.captions.length > 0">
        <div class="external-caption-container">
          <label>{{ t('view.details.captions') }}</label>
          <div class="caption-content" v-html="currentImage.data.result.captions" />
        </div>
        <hr />
      </template>
      <div class="exifs">
        <div class="exif" v-if="currentImage.data.result.meta.date">
          <label>{{ t('view.details.shotAt') }}</label>
          <span>{{ getDayjs()(currentImage.data.result.meta.date)?.format('YYYY/MM/DD HH:mm:ss') }}</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.shotOn') }}</label>
          <div class="apple" v-if="currentImage.data.result.meta.device.startsWith('iP')">
            <div class="device">Apple {{ currentImage.data.result.meta.device }}</div>
          </div>
        </div>
        <div class="exif">
          <label>{{ t('view.details.resolution') }}</label>
          <span>{{ currentImage.data.result.meta.dimension.w }}px*{{ currentImage.data.result.meta.dimension.h }}px</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.size') }}</label>
          <span>{{ (currentImage.data.result.size / 1000000).toFixed(1) }}<small>MB</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.timezone') }}</label>
          <span>UTC{{ currentImage.data.result.meta.timeOffset }} <small>{{
            getTimeOffsetName(currentImage.data.result.meta.timeOffset)
              }}</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.focalLength') }}</label>
          <span>{{ currentImage.data.result.meta.lens.focalLength }}<small>mm</small></span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.aperature') }}</label>
          <span><em>f</em>/{{ currentImage.data.result.meta.lens.aperature }}</span>
        </div>
        <div class="exif">
          <label>{{ t('view.details.exposureTime') }}</label>
          <span>{{ currentImage.data.result.meta.exposureTime }}<small>s</small></span>
        </div>
      </div>
      <hr />
      <div class="map-information-container" v-if="currentImage.data.result.meta.wgs84.length > 0">
        <div class="map-container">
          <client-only>
            <exif-map v-model="currentImage.data.result.meta.wgs84" />
          </client-only>
        </div>
        <div class="right">
          <div class="location-container">
            <label>{{ t('view.details.location') }}</label>
            <div class="location-contents">
              <div class="location-primary">
                <span class="center" v-if="isSpecial('road')">
                  <img alt="svg" height="50px" :src="`/road-svg/${getSpecial('road').toLowerCase()}.svg`"
                    draggable="false" />
                </span>
                <span class="center" v-if="isSpecial('subway-station')">
                  <img alt="svg" height="40px" :src="`/subway-svg/${getSubwayStationInfo()?.line}.svg`"
                    draggable="false" />
                </span>
                <span v-if="isSpecial('spot')">
                  {{ getSpecial('spot') }}
                </span>
                <span v-else-if="isSpecial('subway-station')">
                  {{ getSubwayStationInfo()?.station }}
                </span>
                <span
                  :style="{ 'font-size': isSpecial('road') || isSpecial('spot') || isSpecial('subway-station') ? '85%' : '' }">
                  {{ geoName }}
                </span>
                <popup class="trigger-hover top p8 autowidth">
                  <badge class="light-blue" v-if="isSpecial('flight')">
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
              <span>{{ currentImage.data.result.meta.coordinates.lat[0] }}°{{ currentImage.data.result.meta.coordinates.lat[1] }}'{{
                currentImage.data.result.meta.coordinates.lat[2]
                }}" <small>N</small></span>
            </div>
            <div>
              <label>{{ t('view.details.longitude') }}</label>
              <span>{{ currentImage.data.result.meta.coordinates.lng[0] }}°{{ currentImage.data.result.meta.coordinates.lng[1] }}'{{
                currentImage.data.result.meta.coordinates.lng[2]
                }}" <small>E</small></span>
            </div>
            <div>
              <label>{{ t('view.details.altitude') }}</label>
              <span>{{ currentImage.data.result.meta.altitude.toFixed(2) }} <small>m</small></span>
            </div>
            <div>
              <label>{{ t('view.details.speed') }}</label>
              <span>{{ currentImage.data.result.meta.gpsspeed > 0.1 ? currentImage.data.result.meta.gpsspeed.toFixed(2) :
                t('view.gpsSpeedZero') }} <small v-if="currentImage.data.result.meta.gpsspeed > 0.1">km/h</small></span>
            </div>
          </div>
          <client-only>
            <div class="note gt-1400">
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

  <viewer-navigation v-model="navigationPanelEnabled" :prev-name="currentImage.data.result.navigation.prev || ''"
    :next-name="currentImage.data.result.navigation.next || ''" :current-collection-name="collectionName" :random="currentImage.data.random"/>

  <div class="snack-wrapper" v-if="currentImage.data.result.geo">
    <div class="snack" :class="{ active: showRandomExplorationSnack }">
      <div class="random-exploration">
        <div class="primary" :class="{ bold: !isNotSpecial() }">
          <template v-if="isSpecial('spot')">
            {{ getSpecial('spot') }}
          </template>
          <template v-else-if="isSpecial('road')">
            <img alt="svg" height="50px" :src="`/road-svg/${getSpecial('road').toLowerCase()}.svg`" draggable="false" />
          </template>
          <template v-else-if="isSpecial('subway-station')">
            <img alt="svg" height="40px" :src="`/subway-svg/${getSubwayStationInfo()?.line}.svg`" draggable="false" />
            {{ getSubwayStationInfo()?.station }}
          </template>
          <template v-else-if="isNotSpecial()">
            {{ geoName }}
          </template>
        </div>
        <div class="secondary">
          {{ isNotSpecial() ? geoExtPathPrefix : geoExtPath }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Delayed, ResponseStoreItem } from "~/types/client";
  import {
    mdiAirplane, mdiAlertOutline,
    mdiDownload, mdiFullscreen,
    mdiImage,
    mdiImageOutline,
    mdiInformationOutline,
    mdiPlus
  } from "@mdi/js";
  import Popup from "@/components/popup.vue";
  import ImageCopyright from "@/components/image-copyright.vue";
  import { useFullscreen } from "@vueuse/core";
  import type { StoreItem } from "~/types/server";
  import buildObjectPath from "~/utils/client/buildObjectPath";
  import withFallback from "~/utils/client/withFallback";
  import req from "~/utils/client/req";
  import type { SpecialSpotDefault } from "~/types/common/objects";
  import t from "~/utils/client/t";
  import getDayjs from "~/utils/common/getDayjs";
  import hasHWA from "~/utils/client/hasHWA";
  import getImageNameByRemotePath from "~/utils/client/getImageNameByRemotePath";

  const lang = useLanguage();
  const isExploring = useExploring();

  const showRandomExplorationSnack = ref(false);

  const route = useRoute();
  const collectionName = route.params.collectionName as string;
  const filename = route.params.filename as string;
  const remotePath = buildObjectPath(collectionName, filename, '', '', true);

  const navigationPanelEnabled = ref(false);

  const geoName = computed(() => withFallback(lang.value, currentImage.data.result.geo?.en_name, currentImage.data.result.geo?.name));
  const geoExtPath = computed(() => withFallback(lang.value, currentImage.data.result.geo?.en_ext_path, currentImage.data.result.geo?.ext_path));
  const geoExtPathPrefix = computed(() => geoExtPath.value.replace(`${geoName.value}`, '').replace(', ', ''));

  const currentImage = reactive<Delayed<ResponseStoreItem>>({
    loading: false,
    data: {
      result: {
        name: "",
        url: "",
        size: 0,
        collection: "",
        navigation: {
          prev: null,
          next: null
        },
        meta: {
          date: undefined,
          coordinates: {
            lng: [],
            lat: []
          },
          wgs84: [],
          timeOffset: "",
          dimension: {
            h: 0,
            w: 0
          },
          device: "",
          filesize: 0,
          lens: {
            focalLength: 0,
            aperature: 0
          },
          gpsspeed: 0,
          exposureTime: "",
          altitude: 0
        },
        special: [],
        captions: "",
        geo: undefined
      },
      random: {
        current: "",
        all: ""
      }
    }
  });

  const originalLoaded = ref(false);

  const finalURL = computed(() => originalLoaded.value ? currentImage.data.result.url : toThumbnail1080p(currentImage.data.result.url));

  const mainImage = ref<HTMLElement | null>(null);
  const { isFullscreen, enter, exit, toggle } = useFullscreen(mainImage);

  function toThumbnail1080p(url: string) {
    return url + '?x-oss-process=image/resize,h_1080';
  }

  function scrollToDetails() {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  async function retrieveCurrentObject() {
    const res = await req<StoreItem>(`/api/get-object?name=${btoa(remotePath)}`);

    if (res.code === 'ng') {
      console.error(res);
      return;
    }

    Object.assign(currentImage.data, res);
    currentImage.loading = false;
  }


  function downloadPhoto() {
    alert('Download is not available at present.');
  }

  function isSpecial(type: 'spot' | 'flight' | 'subway-station' | 'road') {
    return currentImage.data.result.special.some(x => x.type === type);
  }

  function isNotSpecial() {
    return currentImage.data.result.special.length === 0;
  }

  function getSpecial(type: 'spot' | 'road') {
    const spotInfo = currentImage.data.result.special.filter(x => x.type === type);
    if (spotInfo.length === 0) return '';
    return (spotInfo[0] as SpecialSpotDefault).name;
  }

  function getTimeOffsetName(offset: string) {
    switch (offset) {
      case '+08:00':
        return 'Asia/Shanghai';
    }
  }

  function getSubwayStationInfo() {
    const spotInfo = currentImage.data.result.special.filter(x => x.type === 'subway-station');
    if (spotInfo.length === 0) return null;
    return spotInfo[0];
  }

  await retrieveCurrentObject();

  function imageLoaded() {
    if (isExploring.value) {
      setTimeout(() => {
        showRandomExplorationSnack.value = true;
        setTimeout(() => {
          isExploring.value = false;
          showRandomExplorationSnack.value = false;
        }, 2500);
      }, 200);
    }
  }
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

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (min-width: 768px) {
    &:hover {
      background: global.$primarydd;
      box-shadow: 0 8px 10px rgba(0, 0, 0, .4);
      transform: translateY(-2px);
    }
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

.snack {
  @media (min-width: 768px) {
    padding: 16px;
  }

  .random-exploration {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    @media (max-width: 768px) {
      font-size: 14px;
      gap: 4px;
    }

    .primary {
      font-size: 150%;
      font-style: normal;
      display: flex;
      align-items: center;
      gap: 8px;

      @media (max-width: 768px) {
        font-size: 120%;
      }

      &.bold {
        font-weight: bold;
      }
    }

    .secondary {
      color: #aaa;
    }
  }
}

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

      @media (max-width: 768px) {
        font-size: 24px;
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

  @media (max-width: 768px) {
    padding: 18px;
  }

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