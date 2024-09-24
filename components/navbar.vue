<template>
  <nav class="navbar">
    <transition name="x">
      <button @click="useRouter().go(-1)" class="back-btn" v-if="route.name === 'imageview' || route.name === 'collection'">
        <icon color="white" :path="mdiArrowLeft"/>
      </button>
    </transition>
    <div class="site-title" @click="navigateTo('/')">
      <site-title/>
    </div>
    <div class="spacer"/>
    <div class="nav-links">
      <router-link to="/collections">Collections</router-link>
      <router-link to="/about">About</router-link>
      <a target="_blank" href="https://subilan.win">Blog</a>
      <a target="_blank" href="https://github.com/Subilan">GitHub</a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import SiteTitle from "@/components/site-title.vue";
import {mdiArrowLeft} from "@mdi/js";

const route = useRoute();
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

.back-btn {
  border-radius: 100%;
  padding: 8px;
  width: 45px;
  height: 45px;
  transition: all .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;
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
  }
}
</style>