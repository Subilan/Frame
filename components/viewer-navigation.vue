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
                        @click="isExploring = true; navigateTo(buildViewerPathFromObjectPath(prevName))">
                        <div class="icon">
                            <icon :path="mdiArrowLeft" />
                        </div>
                        <div class="text">
                            {{ t('view.navigationPanel.prev') }}
                        </div>
                    </div>

                    <div class="navigation-block next" v-if="nextName.length > 0"
                        @click="isExploring = true; navigateTo(buildViewerPathFromObjectPath(nextName))">
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
    import type { CollectionDataKeys, Delayed } from '~/types';

    const isExploring = useExploring();

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
        }
    })

    const lang = useLanguage();

    const collection = computed(() => getCollectionByName(props.currentCollectionName));

    const randomResult = reactive<Delayed<string>>({
        loading: false,
        data: ''
    });

    async function getRandomPhoto(scope: CollectionDataKeys | 'all') {
        randomResult.loading = true;

        const res = await req<string>(`/api/random?scope=${scope}`);

        if (res.code === 'ng') return;

        randomResult.data = res.data;

        randomResult.loading = false;
    }

    async function toRandom(scope: CollectionDataKeys | 'all') {
        await getRandomPhoto(scope);

        isExploring.value = true;
        navigateTo(buildViewerPathFromObjectPath(randomResult.data));
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
    margin: 0 32px;
    pointer-events: none;
}

.navigation-blocks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
    justify-self: center;

    @media (max-width: 864px) {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        width: 90vw;
        gap: 0;
    }
}

.navigation-block {
    border: 2px solid global.$primarydd;
    background: white;
    border-radius: 10px;
    transition: all .2s ease;
    cursor: pointer;
    padding: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    pointer-events: all;

    @media (max-height: 900px) {
        padding: 16px;
    }

    @media (max-width: 864px) {
        padding: 16px 32px;
        flex-direction: row;
        gap: 32px;

        border-radius: 0;
        border-bottom: none;
        border-top: 0;

        &:first-child {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            border-top: 2px solid global.$primarydd;
        }

        &:last-child {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            border-bottom: 2px solid global.$primarydd;
        }
    }

    @media (min-width: 864px) {
        &:hover {
            background: global.$primaryd;
            color: white;
            transform: scale(1.05);
            border-color: white;
        }
    }

    .text {
        text-align: center;
        font-size: 26px;

        @media (max-height: 900px) {
            font-size: 20px;
        }

        small {
            font-size: 16px;
            color: #aaa;
        }

        @media (max-width: 864px) {
            text-align: left;
            display: flex;
            flex-direction: column;

            br {
                display: none;
            }
        }
    }

    .icon {
        svg {
            height: 64px;
            width: 64px;

            @media (max-width: 864px) or (max-height: 900px) {
                height: 48px;
                width: 48px;
            }
        }
    }
}
</style>