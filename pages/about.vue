<template>
  <div class="about-container navbar-offset">
    <h1>About</h1>
    <p>Frame (stylizedly displayed as <em>the <strong>frame</strong></em>) is a simple web application built with Nuxt 3
      to showcase the photos <em>I took</em> during my travels to different places. The initial motive for creating this
      is my belief of the significance of recording my life, the desire to share the wonderful scenery and the
      underlying stories & experiences, which are impressive to me.</p>
    <h2>What travels bring</h2>
    <p>To me, a travel to different places can be quite exciting and refreshing, especially when the natural parts
      involve.</p>
    <p>The travel per se is a brand new experience as the world is so big and there's so many surprises and never-mets
      for us to find. In fact, for me a travel also provides a precious chance to document your perspective of life, or
      more specifically, the way you meet and recognize people and things.</p>
    <p>And taking photos is a way of recording all of these things. The photos themeselves are story tellers. You can reconnect with the moments through the them.</p>
    <hr/>
    <h2>Photo viewer design</h2>
    <p>Focusing on the intuitiveness, the photo viewer in Frame (route: /view/***) is built to be simple, clear, and
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
      <li>Code of the road is also marked out (for national highways, GXX and GXXX).</li>
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
      <p>This image of road traffic sign is from the mandatory National Standard of the People's Republic of China GB 5768, Road traffic signs and markings. Per <a href="https://zh.wikisource.org/wiki/%E6%9D%83%E5%8F%B81999%E7%AC%AC50%E5%8F%B7" target="_blank">权司[1999] 第50号</a> issued by the National Copyright Administration, mandatory standards are technical standards with legal natures, so the copyright protection is inapplicable pursuant to Article 5 of the <a href="https://en.wikisource.org/wiki/Copyright_Law_of_the_People%27s_Republic_of_China" target="_blank">Copyright Law of the People's Republic of China</a>.</p>
    </blockquote>
    <p>The signs are licensed under CC0.</p>
  </div>
</template>
<script setup lang="ts">
import {mdiImage} from "@mdi/js";
</script>

<style lang="scss" scoped>
.about-container {
  max-width: 1200px;
  padding: 16px;
  margin-left: auto;
  margin-right: auto;
}

h2 {
  margin: 16px 0;
}

h1 {
  font-size: 38px;
}

p, li {
  line-height: 1.5;
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