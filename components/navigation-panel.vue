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
                            回到合集
                        </div>
                    </div>
                    <div class="navigation-block">
                        <div class="icon">
                            <icon :path="mdiDice5" />
                        </div>
                        <div class="text">
                            随机一张<br /><small>“{{ collection.name[lang] }}”内</small>
                        </div>
                    </div>
                    <div class="navigation-block">
                        <div class="icon">
                            <icon :path="mdiDice5Outline" />
                        </div>
                        <div class="text">
                            随机一张<br /><small>全站范围</small>
                        </div>
                    </div>
                    <div class="navigation-block prev" v-if="prevName.length > 0"
                        @click="navigateTo(prevImageViewerPath)">
                        <div class="icon">
                            <icon :path="mdiArrowLeft" />
                        </div>
                        <div class="text">
                            上一张<br /><small><kbd>Shift</kbd> + <kbd>A</kbd></small>
                        </div>
                    </div>

                    <div class="navigation-block next" v-if="nextName.length > 0"
                        @click="navigateTo(nextImageViewerPath)">
                        <div class="icon">
                            <icon :path="mdiArrowRight" />
                        </div>
                        <div class="text">
                            下一张<br /><small><kbd>Shift</kbd> + <kbd>S</kbd></small>
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