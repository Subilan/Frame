<template>
  <transition name="fade">
    <div class="drawer-layer" @click.self="model = !model" v-if="model">
        <div class="drawer" v-if="model">
          <section class="drawer-links">
            <router-link @click="model = false" v-for="x in navigations.filter(x => !x.external)" :to="x.to">{{ x.text }}
              <div class="spacer"/>
              <span class="non-active-icon"><icon :path="mdiArrowRight"/></span>
              <span class="active-icon"><icon :path="mdiCheck"/></span>
            </router-link>
            <a target="_blank" @click="model = false" v-for="x in navigations.filter(x => x.external)" :href="x.href">{{ x.text }}
              <div class="spacer"/>
              <span><icon :path="mdiArrowTopRight"/></span>
            </a>
          </section>
        </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import navigations from "~/components/navigations.json";
import {mdiArrowRight, mdiArrowTopRight, mdiCheck} from "@mdi/js";

const model = defineModel();
</script>

<style lang="scss">
@import "assets/global";

.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer-layer {
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

  .drawer {
    width: 25%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    section {
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      width: 75%;
    }
  }
}

section.drawer-links {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;

  a {
    border-radius: 10px;
    border: 2px solid black;
    background: white;
    box-shadow: 0 3px 7px rgba(0, 0, 0, .5);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 16px;
    font-size: 22px;
    transition: all .2s ease;

    svg {
      opacity: 0;
      transform: translateX(-20px);
      transition: all .2s ease;
    }

    span {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.router-link-exact-active {
      border-color: white;
      background: $primaryd;
      color: white;

      .non-active-icon {
        display: none;
      }

      .active-icon {
        display: block;
      }

      .active-icon svg {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .active-icon {
      display: none;
    }

    &:hover {
      background: #dfdfdf;

      svg {
        opacity: 1;
        transform: translateX(0);
      }
    }

    &::after {
      content: none;
    }
  }
}


</style>