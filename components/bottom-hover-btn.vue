<template>
  <div class="bottom-hover-btn-container">
    <btn class="shadow" @click="$emit('click')">
      <slot />
    </btn>
  </div>
</template>

<style lang="scss">
.bottom-hover-btn-container {
  bottom: 0;
  left: 0;
  position: fixed;
  width: 100vw;
  display: flex;
  justify-content: center;
  padding-bottom: 32px;

  .button {
    font-size: 18px;
  }
}
</style>