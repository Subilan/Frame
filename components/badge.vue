<template>
  <span class="badge">
    <slot/>
  </span>
</template>

<style lang="scss">
.badge {
  padding: 4px 10px;
  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 30px;
  font-size: 70%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: default;

  &.light-blue {
    color: white;
    background: #03a9f4;
    border-color: #e1f5fe;
  }
}
</style>