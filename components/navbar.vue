<template>
  <nav class="navbar">
    <div class="site-title" @click="navigateTo('/')">
      <site-title/>
    </div>
    <div class="spacer"/>
    <div class="nav-links">
      <router-link to="/categories">分类</router-link>
      <router-link to="/about">关于</router-link>
      <a target="_blank" href="https://subilan.win">博客</a>
      <a target="_blank" href="https://github.com/Subilan">GitHub</a>
    </div>
  </nav>
</template>

<style lang="scss">
@use "@/assets/global";

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
<script setup lang="ts">
import SiteTitle from "~/components/site-title.vue";
</script>