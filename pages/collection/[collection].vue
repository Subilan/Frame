<template>
  <div class="single-collection-container navbar-offset">
    <div class="top">
      <h2>A Journey to Xinjiang<small>Feb, 2024</small></h2>
      <div class="meta">
        <span><icon :path="mdiImage"/> 1396 photos</span>
        <span><icon :path="mdiHarddisk"/> 390 GB</span>
        <span><badge>jpeg-compressed <icon :path="mdiZipBoxOutline"/></badge></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {mdiHarddisk, mdiImage, mdiZipBoxOutline} from "@mdi/js";

const route = useRoute();
const collectionName = route.params.collection;
</script>

<style lang="scss" scoped>
.single-collection-container {
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  padding: 32px;
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