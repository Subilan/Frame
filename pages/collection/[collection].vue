<template>
  <div class="single-collection-container navbar-offset">
    <div class="top">
      <div class="left">
        <h2>A Journey to Xinjiang<small>Feb, 2024</small></h2>
        <div class="meta">
          <span><icon :path="mdiImage"/> 1396 photos</span>
          <span><icon :path="mdiPackageVariant"/> 390 GB</span>
          <span><badge>jpeg-compressed</badge></span>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias aliquam, aperiam aspernatur assumenda at
          consequatur deserunt inventore ipsam laborum qui quos rem repellat rerum sapiente sit voluptas voluptatem
          voluptatum.</p>
        <div class="section external-links">
          <label>RELATED &raquo;</label>
          <a target="_blank" href>Read “北疆游记（一）” on subilan.win</a>
          <a target="_blank" href>Read “北疆游记（二）” on subilan.win</a>
        </div>
      </div>
      <div class="right">
        <img src="@/assets/xinjiang-theme.png"/>
      </div>
    </div>
    <div class="images" v-if="images.length > 0">
      <div class="image" v-for="x in images">
        <nuxt-img draggable="false" :src="toThumbnail(x.url)" loading="lazy" placeholder placeholder-class="loading" />
        <circle-spinner class="image-loading-indicator"/>
        <div class="layer">
          <p>View now
            <icon :path="mdiLaunch"/>
          </p>
        </div>
      </div>
    </div>
    <div class="no-content" v-else-if="!hasNext">
      There's no content at this time.
    </div>
    <div class="bottom-indicator" ref="bottomIndicator"></div>
    <div class="long-time-loading-indicator-wrapper">
      <div class="long-time-loading-indicator" :class="{active: longTimeLoadingIndicator}">
        <circle-spinner size="16"/>
        <span>Loading more photos, just a moment...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  mdiChevronDown,
  mdiHarddisk,
  mdiImage,
  mdiLaunch,
  mdiPackage,
  mdiPackageVariant,
  mdiZipBoxOutline
} from "@mdi/js";
import indexImage from '@/assets/index.jpg'
import axios from "axios";
import {useElementVisibility} from "@vueuse/core";

const images = ref([]);
const hasNext = ref(true);
const currentIndexCursor = ref(0);
const limit = 20;
const loadAttempts = ref(0);

const route = useRoute();
const collectionName = route.params.collection;
const bottomIndicator = ref(null);
const bottomIndicatorVisibility = useElementVisibility(bottomIndicator)
const longTimeLoadingIndicator = ref(false);

const retrievingObjects = ref(false);

function toThumbnail(url) {
  return url + '?x-oss-process=image/resize,h_800';
}

function startLongTimeDetection() {
  setTimeout(() => {
    if (retrievingObjects.value) longTimeLoadingIndicator.value = true;
  }, 1000)
}

watch(bottomIndicatorVisibility, async v => {
  if (retrievingObjects.value) return;
  if (v) {
    retrievingObjects.value = true;
    startLongTimeDetection();
    const objects = await getObjects(collectionName, currentIndexCursor.value, limit);
    retrievingObjects.value = false;
    longTimeLoadingIndicator.value = false;
    loadAttempts.value += 1;
    if (objects.status === 200) {
      if (objects.data.code === 'ok') {
        images.value.push(...objects.data.data.images)
        currentIndexCursor.value += limit;
        hasNext.value = objects.data.data.hasNext;
      } else {
        console.error(objects);
      }
    } else {
      console.error(objects);
    }
  }
})

async function getObjects(tag, startIndex, limit) {
  return await axios.get(`/api/list-objects?tag=${tag}&startIndex=${startIndex}&limit=${limit}`);
}
</script>

<style lang="scss" scoped>
@use 'assets/global';

.image-loading-indicator {
  opacity: 0;
  transition: all .2s ease;
}

.loading + .image-loading-indicator {
  opacity: 1;
}

.section {
  display: flex;
  align-items: center;
  gap: 16px;

  label {
    background: global.$primaryd;
    padding: 4px 8px;
    color: white;
    border-radius: 4px;
  }
}

.long-time-loading-indicator-wrapper {
  position: fixed;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: none;
}

.long-time-loading-indicator {
  background: white;
  color: black;
  border-radius: 10px;
  border: 2px solid global.$primaryd;
  margin-bottom: 32px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-style: italic;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .2);

  transform: translateY(150%);
  opacity: 0;
  transition: all .2s ease;

  &.active {
    transform: translateY(0);
    opacity: 1;
  }
}

.no-content {
  padding: 0 32px;
  font-size: 20px;
  color: #aaa;
  font-style: italic;
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-indicator {
  visibility: hidden;
  height: 1px;
}

.single-collection-container {
  width: 100%;
  position: relative;
}

.top {
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  p {
    margin: 16px 0;
    line-height: 1.5;
    max-width: 80%;
  }

  .right {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    img {
      height: 200px;
    }
  }
}

.images {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: repeat(5, 1fr);
}

.image {
  height: 20vh;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
  }

  &:hover {
    .layer {
      opacity: 1;
      transform: scale(1);
    }
  }

  .layer {
    background: rgba(0, 0, 0, .6);
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    pointer-events: none;
    opacity: 0;
    transform: scale(1.2);
    transition: all .2s ease;

    p {
      font-size: 28px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    svg {
      height: 32px;
      width: 32px;
    }
  }
}

.meta {
  display: flex;
  align-items: center;

  .badge {
    gap: 4px;

    svg {
      height: 16px;
      width: min-content;
    }
  }

  span::after {
    content: '·';
    margin-right: 8px;
  }

  span:last-child::after {
    content: none;
  }

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.top {
  width: 100%;

  h2 {
    font-size: 48px;
    margin-bottom: 10px;

    small {
      font-size: 70%;
      font-weight: 300;
      margin-left: 16px;
    }
  }
}
</style>