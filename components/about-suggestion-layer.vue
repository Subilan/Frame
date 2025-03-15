<template>
    <transition name="fadeup">
        <div class="about-suggestion-layer" @click.self="model = !model" v-if="model">
            <div class="suggestion-dlg">
                <template v-if="lang === 'zh'">
                    <h2>提出建议</h2>
                    <p>本网站是 2025 年 1 月至 2 月期间搭建的，在 3 月份上线。</p>
                    <p>在一些地名的标注、英文的翻译、功能、布局方面可能有诸多不足之处或者 Bug，还请见谅。如有意愿，欢迎联系我进行指正。</p>
                </template>
                <template v-else-if="lang === 'en'">
                    <h2>Give advice</h2>
                    <p>This site is built from scratch (i.e. no UI lib used and the design is in parallel with dev)
                        during January and Feburary in 2025, and released in March.</p>
                    <p>There could be some mistakes on location names and English translation. The layout and functions
                        can also be buggy. Any suggestion is welcome and appreciated.
                    </p>
                </template>
                <div class="actions">
                    <btn @click="open('https://github.com/Subilan/Frame/issues/new')">
                        <icon :path="mdiGithub" />{{ lang === 'zh' ? '在 GitHub 上发布 Issue' : 'Create Issue on GitHub' }}
                    </btn>
                    <btn class="bg-white text-primary border-primary" @click="open('mailto:christophersubilan@gmail.com', false)">
                        <icon :path="mdiEmailOutline" />{{ lang === 'zh' ? '发送 Email' : 'Send me email' }}
                    </btn>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
    import { mdiEmailOutline, mdiGithub } from '@mdi/js';
    import open from '~/utils/client/open';

    const model = defineModel();
    const lang = useLanguage();

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

<style lang="scss">
@use '@/assets/global';

.about-suggestion-layer {
    background: rgba($color: #000000, $alpha: .7);
    height: 100vh;
    width: 100vw;
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    h2 {
        margin: 0;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-top: 16px;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: stretch;
        }
    }
}

.suggestion-dlg {
    max-width: 30%;
    background: white;
    border: 2px solid global.$primarydd;
    border-radius: 10px;
    padding: 32px;
    line-height: 1.5;
    box-sizing: border-box;
    box-shadow: 0 2px 5px rgba($color: #000000, $alpha: .3);

    @media (max-width: 1500px){
        max-width: 50%;
    }

    @media (max-width: 960px) {
        max-width: 80%;
    }

    @media(max-width: 768px) {
        max-width: 100%;
        margin: 0 16px;
    }
}
</style>