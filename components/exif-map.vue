<template>
  <ol-map class="map-container" :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 400px">
    <ol-view :center="center" :rotation="rotation" :zoom="zoom"
             :projection="projection"/>

    <ol-tile-layer>
      <ol-source-osm/>
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-point :coordinates="center"></ol-geom-point>
          <ol-style>
            <ol-style-circle :radius="10">
              <ol-style-fill :color="'#009688'"></ol-style-fill>
              <ol-style-stroke
                  :color="'#004d40'"
                  :width="2"
              ></ol-style-stroke>
            </ol-style-circle>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
const center = defineModel();
const projection = ref('EPSG:4326')
const zoom = ref(8)
const rotation = ref(0)

</script>

<style lang="scss">
.ol-attribution li {
  > * {
    display: inline;
  }


  a::after {
    content: none;
  }
}
</style>