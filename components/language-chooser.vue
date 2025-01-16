<template>
  <transition name="fade">
    <div class="language-chooser-layer" @click.self="model = !model" v-if="model">
      <div class="language-chooser" v-if="model">
        <section>
          <div class="item" @click="lang = 'en'; model = false;" :class="{active: lang === 'en'}">
            English
            <div class="spacer"/>
            <span class="active-icon"><icon :path="mdiCheck"/></span>
          </div>
          <div class="item" @click="lang = 'zh'; model = false;" :class="{active: lang === 'zh'}">
            简体中文
            <div class="spacer"/>
            <span class="active-icon"><icon :path="mdiCheck"/></span>
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {mdiCheck} from "@mdi/js";

const model = defineModel();
const lang = useLanguage();
</script>

<style lang="scss" scoped>
@use "assets/global";

.language-chooser-layer {
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

  .language-chooser {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    section {
      margin: 8px 0;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      border-radius: 10px;
      border: 2px solid black;
      background: white;
      box-shadow: 0 3px 7px rgba(0, 0, 0, .5);
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        padding: 16px;
        font-size: 22px;
        transition: all .2s ease;
        cursor: pointer;

        svg {
          opacity: 0;
          transition: all .2s ease;
        }

        &:hover {
          background: #dfdfdf;

          svg {
            opacity: 1;
          }
        }

        &::after {
          content: none;
        }

        .active-icon {
          display: none;
        }

        &.active {
          border-color: white;
          background: global.$primaryd;
          color: white;

          .non-active-icon {
            display: none;
          }

          .active-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .active-icon svg {
            opacity: 1;
            transform: translateX(0);
          }
        }
      }
    }

    @media (max-width: 768px) {
      width: 75%;
    }
  }
}
</style>