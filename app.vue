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

const lang = useLanguage();

useHead({
  titleTemplate: chunk => chunk ? `${chunk} | the frame` : 'the frame'
})
</script>
