<template>
  <div class="popup-container" @click="onClick">
    <div class="activator">
      <slot/>
    </div>
    <div class="popup" :class="{active}">
      <slot name="content"/>
    </div>
  </div>
</template>

<script setup>
const active = ref(false);

function onClick() {
  // active.value = !active.value;
}
</script>

<style lang="scss">
@use 'assets/global';

.popup-container {
  position: relative;

  &.inline {
    display: inline;

    .activator {
      display: inline;
    }
  }

  .activator {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.top {
    .popup {
      bottom: 100%;
    }
  }

  &.trigger-hover:hover .popup, .popup.active {
    transform: translate(50%, 0);
    opacity: 1;
    pointer-events: all;
  }

  &.p8 .popup {
    padding: 8px;
  }

  &.autowidth .popup {
    width: max-content;
  }

  .popup {
    background: white;
    z-index: 10;
    position: absolute;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .2);
    width: 200%;
    max-height: 400px;
    overflow-y: auto;
    scrollbar-width: none;
    right: 50%;
    transform: translate(50%, 20px);
    opacity: 0;
    border-radius: 10px;
    padding: 16px;
    box-sizing: border-box;
    pointer-events: none;
    transition: all .2s ease;
    border: 2px solid global.$primaryd;
    font-size: 16px;

    p {
      line-height: 1.5;
    }

    h2 {
      margin-top: 0;
    }
  }
}
</style>