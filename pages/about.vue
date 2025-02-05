<template>
  <div class="about-container navbar-offset">
    <template v-if="lang === 'zh'">
      <h1 class="about-title">关于</h1>
      <p>Frame（风格化拼写：<em>the <strong>frame</strong></em>）是一个基于 Nuxt 3 的网站程序，用于展示我在旅行中的不同地点拍摄的照片。</p>
      <p>做出这一网站，是因为我希望能够通过它来记录自己过往的生活与走过的地方，并保留这些照片背后的故事和当时的想法。</p>
    </template>
    <template v-if="lang === 'en'">
      <h1 class="about-title" lang="en">About</h1>
      <p>Frame (stylizedly spelled and displayed as <em>the <strong>frame</strong></em>) is a simple web application built with Nuxt
        3
        to showcase the photos <em>I took</em> during my travels to different places. The initial motive for creating
        this
        is my belief of the significance of recording my life, the desire to share the wonderful scenery and the
        underlying stories & experiences that impressed me.</p>
    </template>
    <div class="about-galleries">
      <transition name="fade" mode="out-in" v-for="i in [0, 1, 2]">
        <div class="about-gallery" :class="`set${i+1}`" v-show="aboutGalleryControl[i]">
          <div class="img" v-for="x in imageSets[i]">
            <NuxtImg :src="to840P(buildObjectPath('about', x))" loading="lazy" placeholder
                     placeholder-class="loading"/>
            <div class="loading-block"></div>
          </div>
        </div>
      </transition>
      <div class="next-btn" @click="nextGallery()">
        <icon :path="mdiArrowRight"/>
      </div>
    </div>
    <template v-if="lang === 'zh'">
      <p>
        旅行本身是一种全新的生活体验。这个世界如此巨大，实在是有太多的未知等待我们去感受，去发掘。旅行对我而言，是一种用于记录和体现自己看待生活视角的方式，从旅行中我们能看到自己如何待人接物。</p>
      <p>
        拍照是记录旅行最为简单的方式，它是一种视角的记录。这些照片在旅行过后也将化身为故事的阐述者。通过重新查看这些照片，或许就可以与当时的心境和感受重新链接。</p>
      <hr/>
      <h1>网站设计</h1>
      <h2>照片查看器的设计</h2>
      <p>本网站的照片查看器围绕着功能的全面性和操作的简单、清晰性而设计。具体的一些特性说明如下：</p>
      <ul>
        <li>每个照片具有两种质量等级：原图和压缩，压缩后的图片高度为 1080px。</li>
        <li>照片中蕴含的 GPS 信息会直接呈现出来（如果存在）。同时，根据 GPS 信息中的经纬度，会在一个可交互的世界地图上标出拍摄的地点。这一地图是基于
          <a target="_blank" href="https://openlayers.org/">OpenLayers</a> 构建的。
        </li>
        <li>如果照片的拍摄地点是景区，也会按照实际标注在经纬度获取的地点旁边。这些经纬度与地点的映射信息依靠的是 <a
            href="https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov" target="_blank">xiangyuecn/AreaCity-JsSpider-StatsGov</a>
          项目所提供的数据。
        </li>
        <li>在公路旁所拍摄的图片，部分在地点旁也标有国家道路标志。</li>
      </ul>
      <h2>云服务与图片质量</h2>
      <p>目前所采用的云服务是阿里云的对象存储（OSS）。</p>
      <p>为了节省云服务的流量，以及使用 iPhone 拍摄的照片大部分为 HEIF 格式，本站的所有照片在上传之前都利用 <a
          href="https://imagemagick.org/index.php" target="_blank">ImageMagick</a> 进行了 JPEG 压缩。压缩过程中尽量保留了原图的观感。</p>
      <p>在图片加载器中加载图片时，默认加载的图像是经过缩放后的压缩图像，其高度被设置为 1080px。如果要查看原图，可点击图片底部工具栏中的
        <icon :path="mdiImage" style="vertical-align: middle; margin-right: 4px"/>
        <em>加载原图</em> 按钮，届时原始分辨率的图片会被下载并展示。
      </p>
      <h2>网站字体</h2>
      <p>网站的 Logo（我们暂且看成是一个 logo 吧TvT）使用的是 <a
          href="https://mozilla.github.io/Fira/" target="_blank">Fira Sans</a> 字体，网站本身使用的是 <a href="https://fonts.google.com/specimen/Open+Sans" target="_blank">Open Sans</a>。</p>
      <h2>版权</h2>
      <p>本站的所有照片均为原创，依据 <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
                                        target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0</a> 进行授权。</p>
      <p><a href="https://github.com/Subilan/Frame" target="_blank">本网站的代码</a>采用 MIT 协议授权。</p>
      <p>本网站上使用到的国家公路图标是在维基共享媒体上获取到的，它们的发布者各不相同。但根据他们自己写出的版权协议：
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
      <p>因此这些图片应当属于公有领域。</p>
    </template>
    <template v-if="lang==='en'">
      <p>The travel per se is a brand new experience as the world is so big and there's so many surprises and never-mets
        for us to find. A travel also provides a valuable opportunity to document one's perspective on
        life, or more specifically, the way you meet and recognize people and things.</p>
      <p>And taking photos is a way of recording some parts of these things. The photos themselves are storytellers. You can
        reconnect with the moments and feelings through them.</p>
      <hr/>
      <h1>Site Design</h1>
      <h2>Photo viewer design</h2>
      <p>Focusing on intuitiveness, the photo viewer in Frame is built to be simple, clear, and
        fully functional.</p>
      <ul>
        <li>Each photo has two versions of quality available: original and compressed (1080px in height).</li>
        <li>GPS details are present if available. Along with the longitude & latitude numbers, there's an
          interactive map
          built with <a target="_blank" href="https://openlayers.org/">OpenLayers</a>.
        </li>
        <li>With the long. & lat. data provided, names of the places and the related scenic spots where the photos were taken are
          automatically retrieved from locally built Geojson data, which originally comes from <a
              href="https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov" target="_blank">xiangyuecn/AreaCity-JsSpider-StatsGov</a>.
        </li>
        <li>The signs of the road code (of national highways, GXX and GXXX) are also included if possible.</li>
      </ul>
      <h2>Cloud service & photo quality</h2>
      <p>The photos are mildly JPEG compressed using <a href="https://imagemagick.org/index.php" target="_blank">ImageMagick</a>
        before uploaded in order to partially save the cost of storage and bandwidth without excessively affect the
        photo
        viewing perception. Aliyun OSS is the current cloud service.</p>
      <p>When loading a photo in photo viewer, a resizing filter limiting the photo to a maximum height of 1080px
        (refering to common 1920x1080 resolution) is applied. You can disable this filter and view in original quality
        by
        clicking the
        <icon :path="mdiImage" style="vertical-align: middle; margin-right: 4px"/>
        <em>Load original</em> button at the bottom of the image section (the unresized photo will be downloaded in the
        meantime). This filter is always applied on page load to lower bandwidth consumption.
      </p>
      <h2>Font</h2>
      <p>The logo (let's consider it a logo for now XD) of Frame is using <a
          href="https://mozilla.github.io/Fira/" target="_blank">Fira Sans</a> and the webpage is using <a href="https://fonts.google.com/specimen/Open+Sans" target="_blank">Open Sans</a>.</p>
      <h2>Copyright</h2>
      <p>Photos on this site is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
                                                  target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0</a>.
      </p>
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
      <p>So the signs are in public domain.</p>
    </template>
  </div>
</template>
<script setup lang="ts">
import {mdiArrowRight, mdiImage} from "@mdi/js";
import {buildObjectPath} from "#imports";

const lang = useLanguage();
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
h1 {
  text-align: center;
  margin: 32px 0;
  font-size: 300%;
}

.about-title {
  font-size: 500%;
  margin: 64px 0;
}

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
  border-left: 3px solid #aaa;
  margin-left: 0;
  padding-left: 16px;
  font-style: italic;
  &, * {
    color: #aaa;
  }
}
</style>