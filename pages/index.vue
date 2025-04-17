<template>
  <Title>{{ lang === 'zh' ? '首页' : 'Main Page' }}</Title>
  <div class="index-background navbar-offset">
    <img :src="indexImagePath" @load="backgroundLoaded" :class="{ backgroundNotLoad, loaded: imageLoaded }"
      loading="lazy" alt="background" class="index-background-image primary" />
    <img v-if="!isFirst" :class="{ backgroundNotLoad, loaded: imageLoaded }" :src="indexPrevImagePath" loading="lazy"
      alt="background-secondary" class="index-background-image secondary" />
    <div class="overlay" :class="{ dark: layerDark }" />
    <div class="+overlay">
      <transition name="scale-bottom" mode="out-in">
        <div class="hero-text" v-if="textLoaded">
          <div class="hero-text-head"
            :class="{ withRoad: typeof selected.name === 'string' && selected.name.startsWith('road-') }">
            <div class="road" v-if="typeof selected.name === 'string' && selected.name.startsWith('road-')">
              <img :alt="selected.name" :src="`/road-svg/${selected.name.replace('road-', '')}.svg`" />&nbsp;
            </div>
            <span class="name" v-else-if="typeof selected.name === 'object'">{{ selected.name[lang] }}&nbsp;</span>
            <span class="region">
              {{ selected.meta.region[lang] }}
            </span>
          </div>
          <div class="hero-text-meta">
            <span class="date"><span class="gt-768">{{ t('index.shotAt') }}&nbsp;</span>{{
              formatDate(selected.meta.date) }}</span>
            <span class="device"><span class="gt-768">{{ t('index.shotOn') }}&nbsp;</span><span
                :class="{ apple: selected.meta.device.includes('iP') }">{{ selected.meta.device }}</span></span>
            <span class="altitude" v-if="selected.meta.altitude"><span class="gt-768">{{ t('index.altitude')
                }}&nbsp;</span>{{
                  selected.meta.altitude.toFixed(0)
                }}<small>m</small></span>
          </div>
          <div class="hero-text-content" v-html="selected.story[lang].join('')" />
          <div class="hero-text-actions">
            <btn class="shadow border-primary bg-white text-primary"
              @click="navigateTo(buildViewerPath(selected.ossPrefix, selected.image))">
              {{ t('index.viewImage') }}
              <icon :path="mdiArrowTopRight" />
            </btn>
            <btn class="shadow" @click="navigateTo('/collections')">
              {{ t('index.seeCollections') }}
              <icon :path="mdiArrowRight" />
            </btn>
          </div>
        </div>
      </transition>
      <div class="next-image-button-container">
        <btn @click="refreshBackgroundImage" :class="{ 'border-white': imageLoaded, 'bg-transparent': imageLoaded }"
          class="next-image-button shadow-dark bg-transparent text-white">
          <span class="text">{{ t('index.nextImage') }}</span>
          <icon :class="{ buttonIconRotating: !imageLoaded }" :path="mdiRefresh" />
        </btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { mdiArrowRight, mdiArrowTopRight, mdiRefresh } from '@mdi/js';
  import bannersImport from '~/static/banners.json';
  import type { HomeBannerItem } from "~/types/client";
  import buildObjectPath from "~/utils/client/buildObjectPath";
  import formatDate from '~/utils/client/formatDate';
  import buildViewerPath from "~/utils/client/buildViewerPath";
  import randomArrayIndex from '~/utils/common/randomArrayIndex';
  import t from '~/utils/client/t';
  import pick from '~/utils/server/pick';

  const banners: HomeBannerItem[] = bannersImport;

  const lang = useLanguage();

  const indexImagePath = ref('');
  const indexPrevImagePath = ref('');
  const isFirst = ref(true);
  const imageLoaded = ref(false);
  const textLoaded = ref(false);
  const layerDark = ref(false);

  let selected: HomeBannerItem;
  let prevSelected: number[] = [];
  let directPrevSelected = -1;
  let selectedIndex = 0;

  const backgroundNotLoad = ref(true);

  onMounted(() => {
    refreshBackgroundImage(true);
  })

  function backgroundLoaded() {
    imageLoaded.value = true;
    layerDark.value = selected.dark || false;
    // 主图淡入之后
    setTimeout(() => {
      indexPrevImagePath.value = indexImagePath.value;
      textLoaded.value = true;
      // 防止出现首次 indexPrevImagePath 为空导致裂图被显示出来
      isFirst.value = false;
    }, 300);
  }

  function refreshBackgroundImage(first = false) {
    imageLoaded.value = false;
    textLoaded.value = false;

    // 主图淡出之后
    setTimeout(() => {
      selected = pick(banners);

      if (prevSelected.length === banners.length) prevSelected = [];

      while (prevSelected.includes(selectedIndex) || directPrevSelected === selectedIndex) {
        selectedIndex = randomArrayIndex(banners);
        selected = banners[selectedIndex];
      }

      prevSelected.push(selectedIndex);

      directPrevSelected = selectedIndex;

      // 如果是首次，就不设置视觉效果延迟
      if (first) {
        indexImagePath.value = buildObjectPath(selected.ossPrefix, selected.image, '1500');
      } else {
        setTimeout(() => {
          indexImagePath.value = buildObjectPath(selected.ossPrefix, selected.image, '1500');
        }, 1000);
      }
    }, 300);
  }
</script>

<style lang="scss">
@use "assets/global";

.scale-bottom-enter-from,
.scale-bottom-leave-to {
  opacity: 0;
  transform: translateY(5%) scale(.95);
}

.scale-bottom-enter-active,
.scale-bottom-leave-active {
  transition: all .4s ease;
}
</style>

<style lang="scss" scoped>
@use "assets/global";

@keyframes Rotating {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.next-image-button-container {
  position: absolute;
  bottom: 32px;

  .next-image-button {
    transition: all .2s ease;
    transform: rotate(0deg);

    @media (max-width: 768px) {
      padding: 12px;
      border-radius: 100%;

      .text {
        display: none;
      }
    }

    .buttonIconRotating {
      animation: 2s ease Rotating infinite;
      animation-fill-mode: forwards;
    }
  }
}

.index-buttons {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 64px;
}

.\+overlay {
  z-index: 20;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.index-background {
  width: 100vw;
  height: calc(100dvh - #{global.$navbarHeight});
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: black;

  .index-background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all .3s ease;

    &.primary {
      z-index: 5;

      &:not(.loaded) {
        opacity: 0;
      }

      &.loaded {
        opacity: 1;
      }
    }

    &.secondary {
      z-index: 0;
    }
  }

  .overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba($color: #000, $alpha: .3);
    z-index: 10;
    transition: all .3s ease;

    &.dark {
      background: rgba($color: #000000, $alpha: .5)
    }
  }
}

.hero-text {
  color: white;
  max-width: 50%;
  font-size: 36px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .5);
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 1200px) {
    max-width: 80%;
    margin-bottom: 15%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 28px;
    padding: 0 32px;
  }

  .hero-text-head {
    display: flex;
    gap: 8px;
    align-items: baseline;
    flex-wrap: wrap;

    &.withRoad {
      align-items: end;
    }

    .road {
      height: 78px;

      @media (max-width: 768px) {
        height: 58px;
      }

      img {
        height: 100%;
      }
    }

    .name {
      font-size: 130%;
      font-weight: bold;
    }

    .region {
      font-size: 80%;
    }
  }

  .hero-text-meta {
    display: flex;
    align-items: center;
    font-size: 50%;

    >*:not(:last-child)::after {
      content: '·';
      margin: 0 12px;

      @media (max-width: 768px) {
        margin: 0 4px;
      }
    }

    .device {
      .apple {
        font-family: 'SF Pro Display', 'Inter', global.$fontFamilySet;
      }
    }
  }

  .hero-text-content {
    font-size: 65%;
    line-height: 1.6;
  }

  .hero-text-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>