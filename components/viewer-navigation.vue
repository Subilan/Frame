<template>
    <transition name="fadeup">
        <div class="navigation-panel-layer" @click.self="model = !model" v-if="model">
            <div class="navigation-panel" v-if="model && collection">
                <div class="navigation-blocks">
                    <div class="navigation-block" @click="navigateTo('/collection/' + currentCollectionName)">
                        <div class="icon">
                            <icon :path="mdiApps" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.backToCollection') }}
                        </div>
                    </div>
                    <div class="navigation-block" @click="toRandom(currentCollectionName as CollectionDataKeys)">
                        <div class="icon">
                            <icon :path="mdiDice5" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.random') }}<br /><small>{{ t('view.navigationPanel.inCollection',
                                collection.name[lang]) }}</small>
                        </div>
                    </div>
                    <div class="navigation-block" @click="toRandom('all')">
                        <div class="icon">
                            <icon :path="mdiDice5Outline" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.random') }}<br /><small>{{ t('view.navigationPanel.inAll')
                            }}</small>
                        </div>
                    </div>
                    <div class="navigation-block prev" v-if="prevName.length > 0"
                        @click="navigateTo(prevImageViewerPath)">
                        <div class="icon">
                            <icon :path="mdiArrowLeft" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.prev') }}
                        </div>
                    </div>

                    <div class="navigation-block next" v-if="nextName.length > 0"
                        @click="navigateTo(nextImageViewerPath)">
                        <div class="icon">
                            <icon :path="mdiArrowRight" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.next') }}
                        </div>
                    </div>
                </div>
            </div>
            <p v-else-if="collection === null">Invalid Collection</p>
        </div>
    </transition>
</template>

<script setup lang="ts">
    import { mdiApps, mdiArrowLeft, mdiArrowRight, mdiDice5, mdiDice5Outline } from '@mdi/js';
    import type { Reactive } from 'vue';
    import type { CollectionDataBody, FrameResp, CollectionDataKeys, Delayed } from '~/types';

    const model = defineModel();

    const props = defineProps({
        prevName: {
            type: String,
            required: true
        },
        nextName: {
            type: String,
            required: true
        },
        currentCollectionName: {
            type: String,
            required: true
        },
        prevImageViewerPath: {
            type: String,
            required: true
        },
        nextImageViewerPath: {
            type: String,
            required: true
        }
    })

    const lang = useLanguage();

    const collection = computed(() => getCollectionByName(props.currentCollectionName));

    const randomResult: Reactive<Delayed<CollectionDataBody>> = reactive({
        loading: true,
        data: {
            name: '',
            url: '',
            lastModified: '',
            etag: '',
            type: '',
            size: 0,
            storageClass: '',
            owner: undefined
        }
    });

    async function getRandomPhoto(scope: CollectionDataKeys | 'all') {
        randomResult.loading = true;

        const res = await $fetch<FrameResp<CollectionDataBody>>(`/api/random?scope=${scope}`);

        if (res.code === 'ng') return;

        Object.assign(randomResult.data, res.data);

        randomResult.loading = false;
    }

    async function toRandom(scope: CollectionDataKeys | 'all') {
        await getRandomPhoto(scope);

        navigateTo(buildViewerPath(getCollectionNameByRemotePath(randomResult.data.name), getImageNameByRemotePath(randomResult.data.name)));
    }

    const keydownEventHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            model.value = false;
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', keydownEventHandler);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', keydownEventHandler);
    })
</script>

<style lang="scss" scoped>
@use 'assets/global';

.navigation-panel-layer {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 500;
    display: flex;
    justify-content: center;
    align-items: center;
}

.navigation-panel {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.navigation-blocks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    justify-self: center;
}

.navigation-block {
    border: 2px solid global.$primarydd;
    background: white;
    border-radius: 10px;
    transition: all .2s ease;
    cursor: pointer;

    &:hover {
        background: global.$primaryd;
        color: white;
        transform: scale(1.05);
        border-color: white;
    }

    padding: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .text {
        text-align: center;
        font-size: 26px;

        small {
            font-size: 16px;
            color: #aaa;
        }
    }

    .icon {
        svg {
            height: 64px;
            width: 64px;
        }
    }
}
</style>