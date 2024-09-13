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
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  box-sizing: border-box;
  height: global.$navbarHeight;
  background: #2e2e2e;
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