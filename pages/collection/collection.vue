<template>
  <div class="single-collection-container navbar-offset" v-if="!notFound && !initialLoading">
    <div class="top">
      <div class="left">
        <h2>{{ collection.name }}<small>{{ collection.date }}</small></h2>
        <div class="meta">
          <span><icon :path="mdiImage"/> {{ collection.totalAmount }} photos</span>
          <span><icon :path="mdiPackageVariant"/> {{ (collection.totalSize / 1024 / 1024 / 1024).toFixed(2) }} GB</span>
          <span v-if="collection.mark"><badge>{{ collection.mark }}</badge></span>
        </div>
        <div class="description" v-html="collection.desc"></div>
        <div class="section external-links" v-if="collection.external">
          <label>EXTERNAL LINKS &raquo;</label>
          <a target="_blank" :href="x.href" v-for="x in collection.external">{{ x.text }}</a>
        </div>
      </div>
      <div class="right" v-if="collection.theme">
        <img alt="theme" :src="`/theme-pics/${collection.theme}`"/>
      </div>
    </div>
    <div class="images" v-if="images.length > 0">
      <div class="image" @click="navigateTo(`/view/${x.name}`)" v-for="x in images">
        <nuxt-img draggable="false" :src="toThumbnail(x.url)" loading="lazy" placeholder placeholder-class="loading"/>
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
    <div class="bottom-indicator" ref="bottomIndicator" v-if="hasNext"></div>
    <div class="long-time-loading-indicator-wrapper">
      <div class="long-time-loading-indicator" :class="{active: longTimeLoadingIndicator}">
        <circle-spinner size="16"/>
        <span>Loading more photos, just a moment...</span>
      </div>
    </div>
  </div>
  <div class="not-found-container describe center full navbar-offset" v-else-if="notFound">
    <icon :path="mdiHelpCircleOutline"/>
    <h2>FOUR-O-FOUR</h2>
    <p>Collection “{{ collectionName }}” cannot be found, maybe there's some misspelling?</p>
    <btn @click="useRouter().go(-1)" class="shadow" type="primary"><icon :path="mdiArrowLeft"/> Go back</btn>
  </div>
  <div class="loading-container center full flex-column gap-32 navbar-offset" v-else-if="initialLoading">
    <circle-spinner/>
    <em>Loading collection “{{ collectionName }}”...</em>
  </div>
</template>

<script setup>
import {
  mdiArrowLeft,
  mdiHelpCircleOutline,
  mdiImage,
  mdiLaunch,
  mdiPackageVariant
} from "@mdi/js";
import {useElementVisibility} from "@vueuse/core";
import get from "@/utils/get";
import getCollectionByName from "@/utils/getCollectionByName";


const images = ref([]);
const hasNext = ref(true);
const currentIndexCursor = ref(0);
const limit = 20;
const loadAttempts = ref(0);

const route = useRoute();
const collectionName = route.params.collection;
const collection = getCollectionByName(collectionName);
const bottomIndicator = ref(null);
const bottomIndicatorVisibility = useElementVisibility(bottomIndicator)
const longTimeLoadingIndicator = ref(false);

const retrievingObjects = ref(false);

const notFound = ref(false);
const initialLoading = ref(true);

function toThumbnail(url) {
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
  if (objects.status === 200) {
    if (objects.data.code === 'ok') {
      images.value.push(...objects.data.data.images)
      currentIndexCursor.value += limit;
      hasNext.value = objects.data.data.hasNext;
    } else if (objects.data.code === 'ng') {
      if (objects.data.data === 'nothing') notFound.value = true;
      console.error(objects);
    }
  } else {
    console.error(objects);
  }
}

async function getObjects(tag, startIndex, limit) {
  return await get(`/api/list-objects?tag=${tag}&startIndex=${startIndex}&limit=${limit}`);
}

onMounted(() => {
  update().finally();
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
  line-height: 1.5;
}
</style>

<style lang="scss" scoped>
@use 'assets/global';

.image-loading-indicator {
  opacity: 0;
}

.loading + .image-loading-indicator {
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

  @media (max-width: 768px) {
    padding: 20px;
  }

  .description {
    max-width: 80%;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  .right {
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media (max-width: 768px) {
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
    font-size: 12px;

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

.top {
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
      margin-left: 16px;
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