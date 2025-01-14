<template>
  <div class="index-background navbar-offset" :style="{
    'background-image': `url(${indexImagePath})`
  }">
    <div class="overlay"/>
    <div class="+overlay">
      <div class="hero-text" :class="{loaded}">
        <div class="hero-text-head" :class="{withRoad}">
          <div class="road" v-if="withRoad">
            <img :alt="selected.name" :src="`/road-svg/${selected.name.replace('road-', '')}.svg`"/>&nbsp;
          </div>
          <span class="name" v-else>{{ selected.name }}&nbsp;&nbsp;</span>
          <span class="region">
            {{ selected.meta.region }}
          </span>
        </div>
        <div class="hero-text-meta">
          <span class="date"><span class="gt-768">Shot at </span>{{ formatDate(selected.meta.date) }}</span>
          <span class="device"><span class="gt-768">Shot on </span><span
              :class="{apple: selected.meta.device.includes('iPhone')}">{{ selected.meta.device }}</span></span>
          <span class="altitude"><span class="gt-768">Altitude </span>{{
              selected.meta.altitude.toFixed(0)
            }}<small>m</small></span>
        </div>
        <div class="hero-text-content" v-html="selected.story.join('')"/>
        <div class="hero-text-actions">
          <btn class="shadow border" @click="navigateTo(buildViewerPath(selected.ossPrefix, selected.image))">
            查看图片
            <icon :path="mdiArrowTopRight"/>
          </btn>
          <btn class="shadow" @click="navigateTo('/collections')">
            全部合集
            <icon :path="mdiArrowRight"/>
          </btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {mdiArrowRight, mdiArrowTopRight} from '@mdi/js';
import bannersImport from '@/static/data/banners.json';
import type {HomeBannerItem} from "~/types";
import buildObjectPath from "~/utils/buildObjectPath";
import formatDate from '~/utils/formatDate';
import buildViewerPath from "~/utils/buildViewerPath";

function randArrayIndex(array: any[]) {
  return Math.floor(Math.random() * array.length);
}

const banners: HomeBannerItem[] = bannersImport;

const indexImagePath = ref('');
const withRoad = ref(false);
const loaded = ref(false);

const selected: HomeBannerItem = banners[randArrayIndex(banners)];

onMounted(() => {
  indexImagePath.value = buildObjectPath(selected.ossPrefix, selected.image, '2000');
  withRoad.value = selected.name.startsWith('road-');
  loaded.value = true;
})
</script>

<style lang="scss">
@use "assets/global";

.index-buttons {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 64px;
}


.\+overlay {
  z-index: 2;
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
  height: calc(100vh - #{global.$navbarHeight});
  background-size: cover;
  background-position: center;
  position: relative;
  background-color: black;

  .overlay {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .3));
    z-index: 1;
  }
}

.hero-text {
  color: white;
  max-width: 50%;
  font-size: 36px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .3);
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;

  &.loaded {
    animation: .4s ease ScaleBottom forwards;
  }

  @media (max-width: 1200px) {
    max-width: 80%;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 30px;
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

    > *:not(:last-child)::after {
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
    font-size: 70%;
    line-height: 1.6;
  }

  .hero-text-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

@keyframes ScaleBottom {
  from {
    opacity: 0;
    transform: translateY(5%) scale(.95);
  }

  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>