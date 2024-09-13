<template>
  <vue-icon type="mdi" :path="path"/>
</template>

<script setup>
import VueIcon from '@jamescoyle/vue-icon';

const props = defineProps({
  path: {
    type: String
  }
})
</script>