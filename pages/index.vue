<template>
  <div class="index-background navbar-offset" :style="{
    'background-image': `url(${indexImagePath})`
  }">
    <div class="overlay"/>
    <div class="+overlay">
      <div class="hero-text">
        <p>Perhaps one did not want to be loved so much as to be understood.</p>
        <div class="author-note">
          <small><icon :path="mdiFormatQuoteOpen"/> — 1984 (1945, Eric Arthur Blair a.k.a. <strong>George Orwell</strong>)</small>
        </div>
      </div>

      <div class="index-buttons">
        <a-button type="primary" size="large" @click="navigateTo('/collections')">
          按合集浏览 <icon :path="mdiArrowRight"/>
        </a-button>

        <a-button size="large" @click="navigateTo('/about')">
          了解更多 <icon :path="mdiLaunch"/>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import indexImagePath from '@/assets/index.jpg';
import {mdiArrowRight, mdiCommentQuote, mdiFormatQuoteOpen, mdiInformationOutline, mdiLaunch} from '@mdi/js';
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
  max-width: 40%;
  font-size: 36px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .3);

  .author-note {
    text-align: right;
  }

  small {
    font-size: 50%;
    font-style: italic;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
}
</style>