<template>
  <template v-if="collection">
    <collection-view :title="collection.name[lang]" :subtitle="collection.date[lang]" :tag="`collection-${collectionName}`"
      :description="collection.desc[lang]" :theme-image="collection.theme">
      <template #meta>
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
      </template>
      <template #externalLinks>
        <a target="_blank" :href="x.href" v-for="x in collection.external.filter(x => x.type === 'article')">
          {{ t('collection.readExternal', x.name) }}
        </a>
        <a target="_blank" :href="x.href" v-for="x in collection.external.filter(x => x.type === 'video')">
          {{ t('collection.watchExternal', x.name) }}
        </a>
      </template>
      <template #description>
        <div class="description" v-html="collection.desc[lang]" />
      </template>
    </collection-view>
  </template>
</template>

<script setup lang="ts">
  import { mdiHelpCircleOutline, mdiImage, mdiPackageVariant } from "@mdi/js";
  import getCollectionByName from "~/utils/client/getCollectionByName";
  import t from "~/utils/client/t";

  const route = useRoute();
  const collectionName = route.params.collection as string;
  const collection = getCollectionByName(collectionName);

  const lang = useLanguage();
</script>