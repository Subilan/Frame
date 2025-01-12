<template>
  <main :lang="lang">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </main>
</template>

<script setup>
import '@/assets/global.scss'
import '@/assets/fonts/fira-sans/font.css';
import '@/assets/fonts/fira-code/font.css';

const lang = useLanguage();
</script>
