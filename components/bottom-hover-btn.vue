<template>
  <transition name="fadeup">
    <div class="bottom-hover-btn-container" v-if="toggle || !showOnScroll">
      <btn class="shadow" @click="$emit('c')">
        <slot />
      </btn>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  showOnScroll: {
    type: Boolean,
    default: true
  },
  defaultToggle: {
    type: Boolean,
    default: false
  }
})

const toggle = ref(props.defaultToggle);

let prevScrollTop = 0;

onMounted(() => {
  window.addEventListener('scroll', e => {
    const delta =  prevScrollTop - (document.scrollingElement?.scrollTop || 0);
    toggle.value = delta < 0;
    prevScrollTop = document.scrollingElement?.scrollTop || 0;
  })
})
</script>

<style lang="scss">
.bottom-hover-btn-container {
  bottom: 0;
  left: 0;
  position: fixed;
  width: 100vw;
  display: flex;
  justify-content: center;
  padding-bottom: 32px;
  z-index: 50;
  pointer-events: none;

  .button {
    font-size: 18px;
    pointer-events: all;
  }
}
</style>