<template>
  <div class="default-layout">
    <navbar/>
    <a-config-provider :theme="{
      token: {
        colorPrimary: '#333'
      }
    }">
      <slot/>
    </a-config-provider>
  </div>
  <a-drawer>

  </a-drawer>
</template>
<script setup lang="ts">
</script>