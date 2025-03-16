<template>
    <Title>{{ getPageTypeName()[lang] + (lang === 'zh' ? '：' : ': ') }}{{ title }}</Title>
    <div class="single-collection-container navbar-offset" v-if="!notFound && !initialLoading">
        <div class="top">
            <div class="left">
                <h2>
                    <template v-if="title">{{ title }}</template>
                    <slot name="title" />&nbsp;&nbsp;<small>{{ subtitle }}</small>
                </h2>
                <div class="meta">
                    <slot name="meta" />
                </div>
                <slot name="description"/>
                <div class="section external-links">
                    <label>{{ t('collectionView.externalLinks') }} &raquo;</label>
                    <slot name="externalLinks" />
                </div>
            </div>
            <div class="spacer" />
            <div class="right" v-if="themeImage">
                <img alt="theme" :src="`/theme-pics/${themeImage}`" />
            </div>
        </div>
        <div class="images" v-if="images.length > 0">
            <router-link class="image" :to="buildViewerPathFromObjectPath(x) || '#'" v-for="x in images">
                <nuxt-img draggable="false" :src="toURL(x, '480')" loading="lazy" placeholder
                    placeholder-class="loading" />
                <circle-spinner class="image-loading-indicator" />
                <div class="layer">
                    <p>{{ t('collectionView.viewNow') }}
                        <icon :path="mdiLaunch" />
                    </p>
                </div>
            </router-link>
        </div>
        <div class="no-content" v-else-if="!hasNext">
            {{ t('collectionView.noContent') }}
        </div>
        <div class="bottom-indicator" ref="bottomIndicator" v-if="hasNext"></div>
        <div class="snack-wrapper">
            <div class="snack" :class="{ active: longTimeLoadingIndicator }">
                <circle-spinner size="16" />
                <span>{{ t('collectionView.loadingPhotos') }}</span>
            </div>
        </div>
    </div>
    <div class="not-found-container describe center full navbar-offset" v-else-if="notFound">
        <icon :path="mdiHelpCircleOutline" />
        <h2>{{ t('collectionView.fourOfour.title') }}</h2>
        <p>{{ t('collectionView.fourOfour.text', tag) }}</p>
        <btn @click="useRouter().go(-1)" class="shadow" type="primary">
            <icon :path="mdiArrowLeft" />
            {{ t('collectionView.fourOfour.goBack') }}
        </btn>
    </div>
    <div class="loading-container center full flex-column gap-32 navbar-offset" v-else-if="initialLoading">
        <circle-spinner />
        <span>{{ t('collectionView.loading', getPageTypeName()[lang], tagName(tag)) }}</span>
    </div>
</template>

<script setup lang="ts">
    import {
        mdiArrowLeft,
        mdiHelpCircleOutline,
        mdiLaunch
    } from "@mdi/js";
    import { useElementVisibility, useLocalStorage } from "@vueuse/core";
    import req from "~/utils/client/req";
    import t from "~/utils/client/t";
    import buildViewerPathFromObjectPath from "~/utils/client/buildViewerPathFromObjectPath";
    import toURL from "~/utils/client/toURL";
    import type { Lang } from "~/types/client";
    import tagIs from "~/utils/common/tagIs";
import tagName from "~/utils/common/tagName";

    const props = defineProps({
        tag: {
            type: String,
            required: true
        },
        extra: {
            type: String,
        },
        title: {
            type: String,
        },
        subtitle: {
            type: String
        },
        themeImage: {
            type: String
        }
    })

    const cacheImages = useLocalStorage(`frame-collection-${props.tag}-cached-images`, () => '');
    const cacheImagesExpiration = useLocalStorage(`frame-collection-${props.tag}-cached-images-expiration`, () => new Date().getTime() + 3600000);
    const cacheImagesParsed = Number(cacheImagesExpiration.value) > new Date().getTime() ? (cacheImages.value.length > 0 ? JSON.parse(cacheImages.value) as string[] : []) : [];
    const images = reactive<string[]>(cacheImagesParsed);
    const hasNext = ref(true);
    const currentIndexCursor = ref(cacheImagesParsed.length);
    const limit = 20;
    const loadAttempts = ref(0);

    const lang = useLanguage();

    const bottomIndicator = ref(null);
    const bottomIndicatorVisibility = useElementVisibility(bottomIndicator)
    const longTimeLoadingIndicator = ref(false);

    const retrievingObjects = ref(false);

    const notFound = ref(false);
    const initialLoading = ref(true);

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
        const objects = await getObjects(props.tag, currentIndexCursor.value, limit, props.extra);
        initialLoading.value = false;
        retrievingObjects.value = false;
        longTimeLoadingIndicator.value = false;
        loadAttempts.value += 1;

        if (objects.code === 'ok') {
            images.push(...objects.data.images);
            currentIndexCursor.value += limit;
            hasNext.value = objects.data.hasNext;
        } else if (objects.code === 'ng') {
            if (objects.data === 'nothing') notFound.value = true;
        }
    }

    async function getObjects(tag: string, startIndex: number, limit: number, extra: string = '') {
        return await req<{
            hasNext: boolean,
            images: string[]
        }>(`/api/list-objects?tag=${tag}&startIndex=${startIndex}&limit=${limit}&extra=${extra}`);
    }

    onMounted(() => {
        update();
    });

    watch(images, v => {
        cacheImages.value = JSON.stringify(v);
        cacheImagesExpiration.value = new Date().getTime() + 3600000;
    })

    function getPageTypeName(): Lang<string> {
        if (tagIs(props.tag, 'category')) return {
            zh: '分类',
            en: 'category'
        }

        if (tagIs(props.tag, 'collection')) return {
            zh: '合集',
            en: 'collection'
        }

        return {
            zh: '',
            en: ''
        }
    }
</script>

<style lang="scss">
.single-collection-container {
    .top .description p {
        margin: 16px 0;
        line-height: 1.6;
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
    
    h2 {
        font-size: 48px;
        margin-bottom: 10px;
        display: flex;
        gap: 16px;
        align-content: center;

        @media (max-width: 768px) {
            font-size: 40px;
        }

        small {
            font-size: 70%;
            font-weight: 300;
        }
    }
}
</style>

<style lang="scss" scoped>
@use 'assets/global';

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

.section.external-links {
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>