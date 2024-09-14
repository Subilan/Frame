<template>
  <span class="badge">
    <slot/>
  </span>
</template>

<style lang="scss">
.badge {
  padding: 4px 8px;
  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 30px;
  font-size: 80%;
}
</style>