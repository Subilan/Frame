<template>
  <Title>{{ lang === 'zh' ? '关于' : 'About' }}</Title>
  <div class="about-container navbar-offset">
    <template v-if="lang === 'zh'">
      <h1 class="about-title">关于</h1>
      <h2>这是一个什么样的网站</h2>
      <p>本网站本质上是一个称为 Frame（风格化拼写：<site-title />）的网站程序，它基于 Nuxt 3 构建，用于展示我在旅行中的不同地点拍摄的照片。</p>
      <p>做出这一网站，是因为我希望能够通过它来记录自己过往的生活与走过的地方，并保留这些照片背后的故事和当时的想法。</p>
      <h2>旅行是...</h2>
      <p>
        旅行本身是一种全新的生活体验。世界如此巨大，有太多的未知等待我们去感受，去发掘。旅行对我而言，是一种用于记录和体现自己看待生活视角的方式。从旅行中我们能看到自己如何待人接物。</p>
      <p>
        而拍照是记录旅行最为简单的方式，它是一种视角的记录。拍照并不是简单地留下印记——这些照片在旅行过后也将化身为故事的阐述者。通过重新查看这些照片，或许就可以与当时的心境和感受重新链接。</p>
    </template>
    <template v-if="lang === 'en'">
      <h1 class="about-title">About</h1>
      <h2>What's this website about?</h2>
      <p>It's about the photos <em>I took</em> during my travels to different places.</p>
      <p>The website is based on Frame (stylizedly displayed as <site-title />), a simple web application built with
        Nuxt 3, which enables me to share the wonderful scenery and the
        underlying stories & experiences that impressed me.</p>
      <h2>A travel is... (IMO)</h2>
      <p>Going on a travel is taking a brand new experience in this big big world. There's so many surprises and
        never-mets for us to find.</p>
      <p>Do you find it fanscinating to feel and record your own real perspective on things, or even your life? Just fly
        to somewhere you've never been to, make plans for your daily exploration goal without any deliberate
        sophistication, and collect something refreshing & interesting. You will feel that you are <em>omnipotent</em>.
      </p>
      <p>And taking photos is one of the approaches to document your unique POV. Photos are
        storytellers. You can reconnect with the precious moments and your feelings through them, anytime, anywhere.</p>
    </template>
    <div class="about-galleries">
      <transition name="fade" mode="out-in" v-for="i in [0, 1, 2]">
        <div class="about-gallery" :class="`set${i + 1}`" v-show="aboutGalleryControl[i]">
          <div class="img" v-for="x in imageSets[i]">
            <NuxtImg :src="to840P(buildObjectPath('about', x))" loading="lazy" placeholder
              placeholder-class="loading" />
            <div class="loading-block"></div>
          </div>
        </div>
      </transition>
      <div class="next-btn" @click="nextGallery()">
        <icon :path="mdiArrowRight" />
      </div>
    </div>
    <template v-if="lang === 'zh'">
      <hr />
      <h1>网站设计</h1>
      <h2>照片查看器的设计</h2>
      <p>本站中用于展示照片的专用页面称为照片查看器，它的一些特性具体说明如下：</p>
      <ul>
        <li>每个照片具有两种质量等级：原图和压缩，压缩后的图片高度固定为 1080px，按等比例方式进行缩放。可点击工具栏中的
          <icon :path="mdiImage" style="vertical-align: middle; margin-right: 4px" />
          <em>加载原图</em> 按钮切换图片的质量。
        </li>
        <li>照片中如果存有 GPS 信息，会在查看器页面的靠下部分呈现出来。同时，根据 GPS 信息中的经纬度，会显示相关图片的具体拍摄地点名称，还会在可交互的世界地图上标出拍摄的地点。这一地图是基于
          <a target="_blank" href="https://openlayers.org/">OpenLayers</a> 构建的。拍摄地点的名称一般是中文，如果存在官方的英文翻译也会套用。
        </li>
        <li>如果照片的拍摄地点是景区、地铁站或者公路旁，也会按照实际将它们的名称（标志）标注在经纬度获取的地点旁边。
        </li>
      </ul>
      <p>图片查看器中还附带了一个拓展菜单（右下角的加号按钮），可用于快速切换页面或随机浏览。</p>
      <h2>图片存储服务与质量</h2>
      <p>目前所采用的云服务是阿里云的对象存储（OSS）。</p>
      <p>图片大部分都是用非专业的拍照设备（手机）拍摄的。为了节省云服务的流量，以及使用 iPhone 拍摄的照片大部分为 HEIF 格式，本站的所有照片在上传之前都利用 <a
          href="https://imagemagick.org/index.php" target="_blank">ImageMagick</a> 进行了 JPEG 压缩。压缩过程中尽量保留了原图的观感。</p>
      <h2>网站字体</h2>
      <p>网站左上角的 Logo 使用的是 <a href="https://mozilla.github.io/Fira/" target="_blank">Fira Sans</a>
        字体，网站本身使用的是 <a href="https://fonts.google.com/specimen/Open+Sans" target="_blank">Open Sans</a>。</p>
      <h2>数据集</h2>
      <ul>
        <li><a href="https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov"
            target="_blank">xiangyuecn/AreaCity-JsSpider-StatsGov</a> - 大陆三级行政区划地理边界信息</li>
        <li><a href="https://github.com/2blam/HK-geojson">2blam/HK-geojson</a> - 非官方的香港选区地理边界信息 <em> -
            不确定是否可以和大陆的那种地区名称一样使用</em></li>
      </ul>
      <h2>版权</h2>
      <p>本站的所有照片均为原创，以 <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer">CC BY-SA 4.0</a> 协议授权。</p>
      <p><a href="https://github.com/Subilan/Frame" target="_blank">本网站的代码</a>采用 MIT 协议授权。</p>
      <p>本网站上使用到的国家公路图标是在维基共享媒体上获取到的，它们的发布者各不相同。但根据他们自己写出的版权协议，这些标志应该都属于公有领域。
      </p>
      <blockquote>
        <p>This image of road traffic sign is from the mandatory National Standard of the People's Republic of China GB
          5768, Road traffic signs and markings. Per <a
            href="https://zh.wikisource.org/wiki/%E6%9D%83%E5%8F%B81999%E7%AC%AC50%E5%8F%B7" target="_blank">权司[1999]
            第50号</a> issued by the National Copyright Administration, mandatory standards are technical standards with
          legal natures, so the copyright protection is inapplicable pursuant to Article 5 of the <a
            href="https://en.wikisource.org/wiki/Copyright_Law_of_the_People%27s_Republic_of_China"
            target="_blank">Copyright
            Law of the People's Republic of China</a>.</p>
      </blockquote>
      <p>本站上的地铁线路标志为自制，以 <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer">CC BY-SA 4.0</a> 协议授权。</p>
    </template>
    <template v-if="lang === 'en'">
      <hr />
      <h1>Site Design</h1>
      <h2>Photo viewer design</h2>
      <p>In this site, the page dedicated to showcase the photo is called the photo viewer. Some points on its design
        are:</p>
      <ul>
        <li>Each photo has two versions of quality available: original and compressed (1080px in height). You can toggle
          the quality by clicking
          <icon :path="mdiImage" style="vertical-align: middle; margin-right: 4px" />
          <em>Load original</em> button in the toolbar.
        </li>
        <li>GPS details are present if available. Along with the longitude & latitude numbers, there's an complete name
          of that place and an interactive map built with <a target="_blank"
            href="https://openlayers.org/">OpenLayers</a>. The name of the place is in
          Chinese most of the time, but it can be in English if there's any authentic translations.
        </li>
        <li>The name of related scenic spot, subway station or road where the photos were taken is shown if any.</li>
      </ul>
      <h2>Photo storage & quality</h2>
      <p>Aliyun OSS is the current cloud storage service. The photos are mostly taken with unprofessional devices such
        as mobile phones, mildly JPEG-compressed using <a href="https://imagemagick.org/index.php"
          target="_blank">ImageMagick</a>
        before uploaded in order to save the cost of storage and bandwidth without excessively affect the quality.</p>
      <h2>Font</h2>
      <p>The logo on the top left of this site is using <a href="https://mozilla.github.io/Fira/" target="_blank">Fira
          Sans</a> and the webpage is using <a href="https://fonts.google.com/specimen/Open+Sans" target="_blank">Open
          Sans</a>.</p>
      <h2>Datasets</h2>
      <ul>
        <li><a href="https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov"
            target="_blank">xiangyuecn/AreaCity-JsSpider-StatsGov</a> - 3-level administrative division geographical
          boundary dataset of mainland China.</li>
        <li><a href="https://github.com/2blam/HK-geojson">2blam/HK-geojson</a> - Geographical boundary dataset of
          constitency areas in Hong Kong SAR (Unofficial). <em> - Not sure if it's appropriate to consider it as region
            names just like that of mainland China.</em></li>
      </ul>
      <h2>Copyright</h2>
      <p>Photos on this site are licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"
          target="_blank" rel="license noopener noreferrer">CC BY-SA 4.0</a>.
      </p>
      <p><a href="https://github.com/Subilan/Frame" target="_blank">Code of this project</a> is licensed under MIT.</p>
      <p>The national highway road signs are collected from WikiMedia Commons, and they are from various authors.
        According to their copyright claims, the signs are supposed to be in public domain.
      </p>
      <blockquote>
        <p>This image of road traffic sign is from the mandatory National Standard of the People's Republic of China GB
          5768, Road traffic signs and markings. Per <a
            href="https://zh.wikisource.org/wiki/%E6%9D%83%E5%8F%B81999%E7%AC%AC50%E5%8F%B7" target="_blank">权司[1999]
            第50号</a> issued by the National Copyright Administration, mandatory standards are technical standards with
          legal natures, so the copyright protection is inapplicable pursuant to Article 5 of the <a
            href="https://en.wikisource.org/wiki/Copyright_Law_of_the_People%27s_Republic_of_China"
            target="_blank">Copyright
            Law of the People's Republic of China</a>.</p>
      </blockquote>
      <p>The signs of different subway lines on this site are self-made, licensed under <a
          href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
          rel="license noopener noreferrer">CC BY-SA 4.0</a>.</p>
    </template>

    <bottom-hover-btn @click="suggestionLayer = true">
      <icon :path="mdiCommentOutline" />{{ lang === 'zh' ? '提出建议' : 'Give advice' }}
    </bottom-hover-btn>

    <about-suggestion-layer v-model="suggestionLayer" />
  </div>
</template>
<script setup lang="ts">
  import { mdiArrowRight, mdiCommentOutline, mdiImage, mdiPlus } from "@mdi/js";
  import buildObjectPath from "~/utils/client/buildObjectPath";

  const lang = useLanguage();
  const aboutGalleryControl = ref([true, false, false]);

  const suggestionLayer = ref(false);

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

<style lang="scss">
.about-container {

  p,
  li {
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
}
</style>

<style lang="scss" scoped>
.about-title {
  margin-top: 64px;
  margin-bottom: 16px;
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

  @media (max-width: 768px) {
    height: auto;
  }

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

  @media (max-width: 768px) {
    grid-gap: 8px;
  }

  .img {
    height: 250px;
    position: relative;

    @media (max-width: 768px) {
      height: 100px;
    }

    .loading {
      opacity: 0;
    }

    .loading+.loading-block {
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
    height: 100%;
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

      &,
      img {
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

    > :nth-child(3),
    > :nth-child(6) {

      &,
      img {
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

      &,
      img {
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
  font-size: 28px;
}

h1 {
  font-size: 34px;
}

p,
li {
  line-height: 1.5;
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

  &,
  * {
    color: #aaa;
  }
}
</style>