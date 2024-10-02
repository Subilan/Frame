<template>
  <nav class="navbar">
    <transition name="x">
      <button style="margin-right: 10px;" @click="useRouter().go(-1)" class="icon-btn" v-if="route.name === 'imageview' || route.name === 'collection'">
        <icon color="white" :path="mdiArrowLeft"/>
      </button>
    </transition>
    <div class="site-title" @click="navigateTo('/')">
      <site-title/>
    </div>
    <div class="spacer"/>
    <div class="nav-links">
      <router-link v-for="x in navigations.filter(x => !x.external)" :to="x.to">{{ x.text }}</router-link>
      <a target="_blank" v-for="x in navigations.filter(x => x.external)" :href="x.href">{{ x.text }}</a>
    </div>
    <button @click="drawerModel = !drawerModel" class="icon-btn drawer-btn">
      <icon color="white" :path="mdiMenu"/>
    </button>
  </nav>
  <drawer v-model="drawerModel"/>
</template>

<script setup lang="ts">
import SiteTitle from "@/components/site-title.vue";
import {mdiArrowLeft, mdiMenu} from "@mdi/js";
import navigations from './navigations.json';

const route = useRoute();
const drawerModel = ref(false);
</script>

<style lang="scss">
@use "@/assets/global";

.x-enter-active,
.x-leave-active {
  transition: all .3s ease;
}

.x-enter-from,
.x-leave-to {
  transform: scale(.3);
  opacity: 0;
}

.drawer-btn {
  @media (min-width: 1000px) {
    display: none !important;
  }
}

.icon-btn {
  border-radius: 100%;
  padding: 8px;
  width: 45px;
  height: 45px;
  transition: all .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;
  background: transparent;
  border: none;

  &:active {
    background: rgba(255, 255, 255, .1);
  }

  &:hover {
    background: rgba(255, 255, 255, .2);
  }
}

.navbar {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  height: global.$navbarHeight;
  background: global.$primarydd;
  box-shadow: 0 5px 10px rgba(0, 0, 0, .3);
  color: white;
  display: flex;
  align-items: center;
  padding: 0 32px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }

  .site-title {
    font-size: 30px;
    cursor: pointer;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 16px;

    a {
      color: white;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
}
</style>