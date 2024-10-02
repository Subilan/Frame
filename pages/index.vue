<template>
  <div class="index-background navbar-offset" :style="{
    'background-image': `url(${indexImagePath})`
  }">
    <div class="overlay"/>
    <div class="+overlay">
      <div class="hero-text">
        <p v-html="quoteDisplay.content" @click.self="getRandomQuote"></p>
        <div class="author-note">
          <small>
            <icon :path="mdiFormatQuoteOpen"/>
            — <span v-html="quoteDisplay.from.f"/></small>
        </div>
      </div>

      <div class="index-buttons">
        <btn class="shadow-dark" @click="navigateTo('/collections')">Collections
          <icon :path="mdiArrowRight"/>
        </btn>
        <btn class="shadow-dark" type="border">Learn more
          <icon :path="mdiLaunch"/>
        </btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import indexImagePath from '@/assets/index.jpg';
import {mdiArrowRight, mdiFormatQuoteOpen, mdiLaunch, mdiRefresh} from '@mdi/js';
import quotesImport from '@/static/data/quotes.json';

const quotes: {
  content: string,
  from: {
    f: string,
    zh: string
  }
}[] = quotesImport;

const quoteIndex = ref(randArrayIndex(quotes));
const quoteDisplay = computed(() => quotes[quoteIndex.value])

function randArrayIndex(array: any[]) {
  return Math.floor(Math.random() * array.length);
}

function getRandomQuote() {
  quoteIndex.value = randArrayIndex(quotes);
}
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
  max-width: 50%;
  font-size: 36px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, .3);

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: 24px;
    padding: 0 32px;
  }

  .author-note {
    text-align: right;
  }

  a[target="_blank"] {
    color: inherit;
    &::after {
      content: none;
    }
  }

  small {
    font-size: 50%;
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
}
</style>