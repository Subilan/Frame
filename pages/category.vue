<template>
    <collection-view v-model:total-count="totalCount" :title="getCategoryTitle()" :bind-count="true" :tag="`category-${type}-${name.split('@')[0]}`">
        <template #title>
            <img v-if="type === 'road'" draggable="false" :src="`/road-svg/${name}.svg`" height="60px"/>
            <img v-if="type === 'subway'" draggable="false" :src="`/subway-svg/${name.split('@')[0]}.svg`" height="60px"/>
            {{ getCategoryTitle() }}
        </template>
        <template #meta>
            <span>
                <icon :path="mdiShapeOutline"/>
                {{ t('collectionView.categorizeBy', getCategoryTypeName(type)[lang]) }}
            </span>
            <span>
                <icon :path="mdiPackageVariant"/> {{ t('collectionView.photoNumSimple', totalCount, totalCount) }}
            </span>
        </template>
        <template #description>
            <template v-if="type === 'date'">
                <p>这里列出了已上传的拍摄于 {{ name.split('.').join(' 年 ') }} 月的照片。</p>
            </template>
        </template>
    </collection-view>
</template>

<script lang="ts" setup>
import { mdiPackageVariant, mdiShapeOutline } from '@mdi/js';
import type { CategoryType } from '~/types/common/objects';
import t from '~/utils/client/t';
import getCategoryTypeName from '~/utils/common/getCategoryTypeName';

const route = useRoute();
const totalCount = ref(0);

const type = route.params.categoryType as CategoryType;
const name = route.params.categoryName as string;

const lang = useLanguage();

function getCategoryTitle() {
    switch(type)  {
        case 'date': return `${name.split('.').join(' 年 ')} 月`;
        case 'region': case 'spot': return name;
        case 'subway': return name.split('@')[1];
        case 'road': return name.toUpperCase();
    }
}
</script>