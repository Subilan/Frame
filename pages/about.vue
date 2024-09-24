<template>
  <div class="about-container navbar-offset">
    <h1>About</h1>
    <p>Frame (stylizedly displayed as <em>the <strong>frame</strong></em>) is a simple web application built with Nuxt 3
      to showcase the photos <em>I took</em> during my travels to different places. The initial motive for creating this
      is my belief of the significance of recording my life, the desire to share the wonderful scenery and the
      underlying stories & experiences that impressed me.</p>
    <h2>What travels bring</h2>
    <p>To me, a travel to different places can be quite exciting and refreshing, especially when it involves nature.</p>
    <div class="about-galleries">
      <transition name="fade" mode="out-in" v-for="i in [0, 1, 2]">
        <div class="about-gallery" :class="`set${i+1}`" v-show="aboutGalleryControl[i]">
          <div class="img" v-for="x in imageSets[i]">
            <NuxtImg :src="to840P(buildObjectPath('about', x))" loading="lazy" placeholder placeholder-class="loading"/>
            <div class="loading-block"></div>
          </div>
        </div>
      </transition>
      <div class="next-btn" @click="nextGallery()">
        <icon :path="mdiArrowRight"/>
      </div>
    </div>
    <p>The travel per se is a brand new experience as the world is so big and there's so many surprises and never-mets
      for us to find. In fact, for me a travel also provides a valuable opportunity to document one's perspective on
      life, or
      more specifically, the way you meet and recognize people and things.</p>
    <p>And taking photos is a way of recording all of these things. The photos themselves are storytellers. You can
      reconnect with the moments through the them.</p>
    <hr/>
    <h2>Photo viewer design</h2>
    <p>Focusing on the intuitiveness, the photo viewer in Frame is built to be simple, clear, and
      fully functional.</p>
    <ul>
      <li>Each photo has two versions of quality available: original and compressed (1080px in height).</li>
      <li>GPS details are present whenever available. Along with the longitude & latitude numbers, there's an
        interactive map
        built with <a target="_blank" href="https://openlayers.org/">OpenLayers</a>.
      </li>
      <li>With the long. & lat. data, names of the places and the related scenic spots where the photos were taken are
        automatically retrieved from locally built Geojson data, which originally comes from <a
            href="https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov" target="_blank">xiangyuecn/AreaCity-JsSpider-StatsGov</a>.
      </li>
      <li>The signs of the road code (of national highways, GXX and GXXX) are also included.</li>
    </ul>
    <h2>Cloud service & photo quality</h2>
    <p>The photos are mildly JPEG compressed using <a href="https://imagemagick.org/index.php" target="_blank">ImageMagick</a>
      before uploaded in order to partially save the cost of storage and bandwidth without excessively affect the photo
      viewing perception. Aliyun OSS is the current cloud service.</p>
    <p>When loading a photo in photo viewer, a resizing filter limiting the photo to a maximum height of 1080px
      (refering to common 1920x1080 resolution) is applied. You can disable this filter and view in original quality by
      clicking the
      <icon :path="mdiImage" style="vertical-align: middle; margin-right: 4px"/>
      <em>Load original</em> button at the bottom of the image section (the unresized photo will be downloaded in the
      meantime). This filter is always applied on page load to lower bandwidth consumption.
    </p>
    <h2>There's no photo actually taken with a camera. Why?</h2>
    <p>The photos are mostly shot on iPhone for convenience. It's known that the quality of mobile photos is not comparable to professional cameras.</p>
    <p>Since this is not a photography exhibition webpage and I'm not a specialized photographer either, it's better to emphasize that the <em>rough</em> look of the photo, not the textural details, is what matters to me <em>currently</em>.</p>
    <p>However, if my interest and time permit, there can be camera photos in the future.</p>
    <h2>Font</h2>
    <p>The logo (let's consider it a logo for now) of Frame and the whole web page is using <a
        href="https://mozilla.github.io/Fira/" target="_blank">Fira Sans</a> as the primary font.</p>
    <h2>Copyright</h2>
    <p>Photos on this site is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
                                                target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0</a>.</p>
    <p><a href="https://github.com/Subilan/Frame" target="_blank">Code of this project</a> is licensed under MIT.</p>
    <p>The national highway road signs are collected from WikiMedia Commons, and they are from various authors.
      According to their copyright claims:
    </p>
    <blockquote>
      <p>This image of road traffic sign is from the mandatory National Standard of the People's Republic of China GB
        5768, Road traffic signs and markings. Per <a
            href="https://zh.wikisource.org/wiki/%E6%9D%83%E5%8F%B81999%E7%AC%AC50%E5%8F%B7" target="_blank">权司[1999]
          第50号</a> issued by the National Copyright Administration, mandatory standards are technical standards with
        legal natures, so the copyright protection is inapplicable pursuant to Article 5 of the <a
            href="https://en.wikisource.org/wiki/Copyright_Law_of_the_People%27s_Republic_of_China" target="_blank">Copyright
          Law of the People's Republic of China</a>.</p>
    </blockquote>
    <p>The signs are licensed under CC0.</p>
  </div>
</template>
<script setup lang="ts">
import {mdiArrowRight, mdiImage} from "@mdi/js";
import {buildObjectPath} from "#imports";

const aboutGalleryControl = ref([true, false, false]);

async function nextGallery() {
  for (let i = 0; i < aboutGalleryControl.value.length; i++) {
    let current = aboutGalleryControl.value[i];
    if (current === true) {
      aboutGalleryControl.value[i] = false;
      aboutGalleryControl.value[i === aboutGalleryControl.value.length - 1 ? 0 : i + 1] = true;
      break;
    }
  }
}

function to840P(url: string) {
  return url + "?x-oss-process=image/resize,h_840"
}

const imageSets = [
  [
    "IMG_1970.jpg",
    "IMG_3919.jpg",
    "IMG_2541.jpg",
    "IMG_7639.jpg",
    "IMG_8582.jpg",
    "IMG_9011.jpg"
  ],
  [
    "IMG_3281.jpg",
    "IMG_2773.jpg",
    "IMG_2578.jpg",
    "IMG_7025.jpg",
    "IMG_4575.jpg",
    "IMG_4334.jpg"
  ],
  [
    "IMG_6968.jpg",
    "IMG_4479.jpg",
    "IMG_4084.jpg",
    "IMG_6918.jpg",
    "IMG_7840.jpg",
    "IMG_8462.jpg",
    "IMG_E8081.jpg"
  ]
]
</script>

<style lang="scss" scoped>
.about-container {
  max-width: 1200px;
  padding: 16px;
  margin-left: auto;
  margin-right: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.about-galleries {
  height: 782px;
  overflow: hidden;
  position: relative;

  .next-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 24px;
    width: 24px;
    background: black;
    opacity: .5;
    transition: all .2s ease;
    padding: 16px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      opacity: .8;
    }
  }
}

@keyframes LoadingBlock {
  0% {
    opacity: .1;
  }

  50% {
    opacity: .5;
  }

  100% {
    opacity: .1;
  }
}

.about-gallery {
  display: grid;
  grid-gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 1fr);

  .img {
    height: 250px;
    position: relative;

    .loading {
      opacity: 0;
    }

    .loading + .loading-block {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #aaa;
      top: 0;
      left: 0;
      animation: LoadingBlock 1.5s infinite;
    }
  }

  img {
    height: 250px;
    width: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  &.set1 {
    > :nth-child(1) {
      grid-area: 1 / 1 / 2 / 3;
    }

    > :nth-child(2) {
      grid-area: 1 / 3 / 2 / 4;
    }

    > :nth-child(3) {
      grid-area: 1 / 4 / 3 / 5;

      &, img {
        height: 100%;
        max-height: unset
      }
    }

    > :nth-child(4) {
      grid-area: 2 / 1 / 3 / 2;
    }

    > :nth-child(5) {
      grid-area: 2 / 2 / 3 / 4;
    }

    > :nth-child(6) {
      grid-area: 3 / 1 / 4 / 5;
    }
  }

  &.set2 {
    > :nth-child(1) {
      grid-area: 1 / 1 / 2 / 2;
    }

    > :nth-child(2) {
      grid-area: 1 / 2 / 2 / 4;
    }

    > :nth-child(3) {
      grid-area: 1 / 4 / 3 / 5;
    }

    > :nth-child(4) {
      grid-area: 2 / 3 / 3 / 4;
    }

    > :nth-child(5) {
      grid-area: 3 / 3 / 4 / 5;
    }

    > :nth-child(6) {
      grid-area: 2 / 1 / 4 / 3;
    }

    > :nth-child(3), > :nth-child(6) {
      &, img {
        height: 100%;
        max-height: unset
      }
    }
  }

  &.set3 {
    > :nth-child(1) {
      grid-area: 1 / 1 / 2 / 4;

      img {
        object-position: bottom;
      }
    }

    > :nth-child(5) {
      grid-area: 2 / 3 / 3 / 5;
    }

    > :nth-child(6) {
      grid-area: 3 / 2 / 4 / 4;
    }

    > :nth-child(3) {
      grid-area: 2 / 1 / 4 / 2;

      &, img {
        height: 100%;
        max-height: unset;
      }
    }

    > :nth-child(4) {
      grid-area: 2 / 2 / 3 / 3;
    }

    > :nth-child(2) {
      grid-area: 1 / 4 / 2 / 5;
    }

    > :nth-child(7) {
      grid-area: 3 / 4 / 4 / 5;
    }
  }
}

h2 {
  margin: 16px 0;
}

h1 {
  font-size: 38px;
}

p, li {
  line-height: 1.5;
  font-size: 18px;
}

ul {
  padding-left: 20px;
  margin: 8px 0;
}

blockquote {
  border-left: 3px solid black;
  margin-left: 0;
  padding-left: 16px;
  font-style: italic;
}
</style>