<template>
  <Html :lang="lang">
    <main :lang="lang">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </main>
  </Html>
</template>

<script setup>
import '@/assets/global.scss'
import '@/assets/fonts/fira-sans/font.css';
import '@/assets/fonts/fira-code/font.css';

const lang = useLanguage();

useHead({
  titleTemplate: chunk => chunk ? `${chunk} | the frame` : 'the frame'
})
</script>
