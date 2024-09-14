<template>
  <div class="single-collection-container navbar-offset">
    <div class="top">
      <div class="left">
        <h2>A Journey to Xinjiang<small>Feb, 2024</small></h2>
        <div class="meta">
          <span><icon :path="mdiImage"/> 1396 photos</span>
          <span><icon :path="mdiHarddisk"/> 390 GB</span>
          <span><badge>jpeg-compressed <icon :path="mdiZipBoxOutline"/></badge></span>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A alias aliquam, aperiam aspernatur assumenda at
          consequatur deserunt inventore ipsam laborum qui quos rem repellat rerum sapiente sit voluptas voluptatem
          voluptatum.</p>
      </div>
      <div class="right">
        <img src="@/assets/xinjiang-theme.png"/>
      </div>
    </div>
    <div class="images">
      <div class="image" v-for="x in 25" :style="{
        'background-image': `url(${indexImage})`
      }">
        <div class="layer">
          <p>View now
            <icon :path="mdiLaunch"/>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {mdiHarddisk, mdiImage, mdiLaunch, mdiZipBoxOutline} from "@mdi/js";
import indexImage from '@/assets/index.jpg'
import axios from "axios";

const route = useRoute();
const collectionName = route.params.collection;

async function getObjects(startIndex) {
  return await axios.get(`/api/list-objects?startIndex=${startIndex}&limit=20`);
}
</script>

<style lang="scss" scoped>
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
    max-width: 60%;
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
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

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