<template>
  <button class="button" :class="`type-${type}`">
    <slot/>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String
  }
});

</script>

<style lang="scss">
@use 'assets/global';

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: global.$primaryd;
  outline: none;
  border: none;
  border-radius: 10px;
  color: white;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: all .2s ease;
  font-family: global.$fontFamilySet;

  svg {
    height: 18px;
    width: 18px;
  }

  &:hover {
    background: #1c2528;
  }

  &:active {
    filter: brightness(60%);
  }

  &.shadow {
    box-shadow: 0 3px 3px rgba(0, 0, 0, .2);
  }

  &.shadow-dark {
    box-shadow: 0 5px 6px rgba(0, 0, 0, .4);
  }
}

.button.type-border {
  border: 1px solid global.$primaryd;
  color: global.$primaryd;
  background: white;
}
</style>