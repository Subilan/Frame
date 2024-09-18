<template>
  <client-only>
    <ol-map class="map-container" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 400px">
      <ol-view :center="center" :rotation="rotation" :zoom="zoom"
               :projection="projection" />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-map>
  </client-only>
</template>

<script setup>
const center = defineModel();
const projection = ref('EPSG:4326')
const zoom = ref(8)
const rotation = ref(0)
</script>

<style lang="scss" scoped>
.ol-attribution li {
  display: flex;
  align-items: baseline;
  gap: 4px;

  a::after {
    content: none;
  }
}
</style>