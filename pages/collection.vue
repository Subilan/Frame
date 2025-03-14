<template>
  <Title>{{ lang === 'zh' ? '合集：' : 'Collection: ' }}{{ collection ? collection.name[lang] : '' }}</Title>
  <div class="single-collection-container navbar-offset" v-if="!notFound && !initialLoading && collection">
    <div class="top">
      <div class="left">
        <h2>{{ collection.name[lang] }}&nbsp;&nbsp;<small>{{ collection.date[lang] }}</small></h2>
        <div class="meta">
          <span>
            <icon :path="mdiImage" />{{ t('collection.photoNum', collection.pickedAmount, collection.totalAmount) }}
            <popup class="top p8 autowidth trigger-hover gt-768 font-12">
              <icon color="#aaa" size="16" :path="mdiHelpCircleOutline" />
              <template #content>
                <span>{{ t('collection.photoIsPicked', collection.pickedAmount, collection.totalAmount) }}</span>
              </template>
            </popup>
          </span>
          <span>
            <icon :path="mdiPackageVariant" /> {{ (collection.totalSize / 1024 / 1024 / 1024).toFixed(2) }} GB
          </span>
        </div>
        <div class="description" v-html="collection.desc[lang]" />
        <div class="section external-links" v-if="collection.external && collection.external.length > 0">
          <label>{{ t('collection.externalLinks') }} &raquo;</label>
          <a target="_blank" :href="x.href" v-for="x in collection.external.filter(x => x.type === 'article')">
            {{ t('collection.readExternal', x.name) }}
          </a>
          <a target="_blank" :href="x.href" v-for="x in collection.external.filter(x => x.type === 'video')">
            {{ t('collection.watchExternal', x.name) }}
          </a>
        </div>
      </div>
      <div class="spacer" />
      <div class="right" v-if="collection.theme">
        <img alt="theme" :src="`/theme-pics/${collection.theme}`" />
      </div>
    </div>
    <div class="images" v-if="images.length > 0">
      <router-link class="image" :to="buildViewerPathFromObjectPath(x.name) || '#'" v-for="x in images">
        <nuxt-img draggable="false" :src="toThumbnail(x.url)" loading="lazy" placeholder placeholder-class="loading" />
        <circle-spinner class="image-loading-indicator" />
        <div class="layer">
          <p>{{ t('collection.viewNow') }}
            <icon :path="mdiLaunch" />
          </p>
        </div>
      </router-link>
    </div>
    <div class="no-content" v-else-if="!hasNext">
      {{ t('collection.noContent') }}
    </div>
    <div class="bottom-indicator" ref="bottomIndicator" v-if="hasNext"></div>
    <div class="snack-wrapper">
      <div class="snack" :class="{ active: longTimeLoadingIndicator }">
        <circle-spinner size="16" />
        <span>{{ t('collection.loadingPhotos') }}</span>
      </div>
    </div>
  </div>
  <div class="not-found-container describe center full navbar-offset" v-else-if="notFound">
    <icon :path="mdiHelpCircleOutline" />
    <h2>{{ t('collection.fourOfour.title') }}</h2>
    <p>{{ t('collection.fourOfour.text', collectionName) }}</p>
    <btn @click="useRouter().go(-1)" class="shadow" type="primary">
      <icon :path="mdiArrowLeft" />
      {{ t('collection.fourOfour.goBack') }}
    </btn>
  </div>
  <div class="loading-container center full flex-column gap-32 navbar-offset" v-else-if="initialLoading">
    <circle-spinner />
    <span>{{ t('collection.loadingCollection', collectionName) }}</span>
  </div>
</template>

<script setup lang="ts">
  import {
    mdiArrowLeft,
    mdiHelpCircleOutline,
    mdiImage,
    mdiLaunch,
    mdiPackageVariant
  } from "@mdi/js";
  import { useElementVisibility } from "@vueuse/core";
  import getCollectionByName from "@/utils/getCollectionByName";
import type { CollectionDataBody } from "~/types";

  const images = ref<any[]>([]);
  const hasNext = ref(true);
  const currentIndexCursor = ref(0);
  const limit = 20;
  const loadAttempts = ref(0);

  const lang = useLanguage();

  const route = useRoute();
  const collectionName = route.params.collection as string;
  const collection = getCollectionByName(collectionName);
  const bottomIndicator = ref(null);
  const bottomIndicatorVisibility = useElementVisibility(bottomIndicator)
  const longTimeLoadingIndicator = ref(false);

  const retrievingObjects = ref(false);

  const notFound = ref(false);
  const initialLoading = ref(true);

  function toThumbnail(url: string) {
    return url + '?x-oss-process=image/resize,h_400';
  }

  function startLongTimeDetection() {
    setTimeout(() => {
      if (retrievingObjects.value) longTimeLoadingIndicator.value = true;
    }, 1000)
  }

  watch(bottomIndicatorVisibility, async v => {
    if (v) await update();
  })

  async function update() {
    if (retrievingObjects.value) return;

    retrievingObjects.value = true;
    startLongTimeDetection();
    const objects = await getObjects(collectionName, currentIndexCursor.value, limit);
    initialLoading.value = false;
    retrievingObjects.value = false;
    longTimeLoadingIndicator.value = false;
    loadAttempts.value += 1;

    if (objects.code === 'ok') {
      images.value.push(...objects.data.images);
      currentIndexCursor.value += limit;
      hasNext.value = objects.data.hasNext;
    } else if (objects.code === 'ng') {
      if (objects.data === 'nothing') notFound.value = true;
    }
  }

  async function getObjects(tag: string, startIndex: number, limit: number) {
    return await req<{
      hasNext: boolean,
      images: CollectionDataBody[]
    }>(`/api/list-objects?tag=${tag}&startIndex=${startIndex}&limit=${limit}`);
  }

  onMounted(() => {
    if (collection === null) {
      notFound.value = true;
      return;
    }
    update();
  })
</script>

<style lang="scss" scoped>
.not-found-container {
  padding: 32px;

  p {
    max-width: 35%;
    text-align: center;
    line-height: 1.8;
    margin: 16px 0;
  }

  h2 {
    font-size: 40px;
    font-style: italic;
    margin-top: 16px;
    margin-bottom: 0;
  }
}
</style>

<style lang="scss">
.top .description p {
  margin: 16px 0;
  line-height: 1.6;
}
</style>

<style lang="scss" scoped>
@use 'assets/global';

.image-loading-indicator {
  opacity: 0;
}

.loading+.image-loading-indicator {
  opacity: 1;
}

.section {
  display: flex;
  align-items: center;
  gap: 16px;

  label {
    font-style: italic;
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

.single-collection-container>.top {
  padding: 32px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 20px;
  }

  .description {
    max-width: 60%;
    min-width: 300px;

    @media (max-width: 1350px) {
      max-width: 90%;
    }

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  .left {
    small {
      display: inline-block;
    }
  }

  .right {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media (max-width: 1100px) {
      display: none;
    }

    img {
      height: 200px;
    }
  }
}

.images {
  display: grid;
  box-sizing: border-box;
  grid-template-columns: repeat(5, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
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

    @media (max-width: 768px) {
      display: none;
    }

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

  @media (max-width: 768px) {
    font-size: 14px;

    svg {
      height: 14px;
      width: 14px;
    }
  }

  .badge {
    gap: 4px;

    @media (max-width: 768px) {
      gap: 0;
    }

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

.single-collection-container>.top {
  width: 100%;

  h2 {
    font-size: 48px;
    margin-bottom: 10px;

    @media (max-width: 768px) {
      font-size: 40px;
    }

    small {
      font-size: 70%;
      font-weight: 300;
    }
  }
}

.section.external-links {
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>