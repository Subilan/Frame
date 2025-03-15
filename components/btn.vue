<template>
  <button class="button">
    <slot/>
  </button>
</template>

<style lang="scss">
@use 'assets/global';

.button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: global.$primaryd;
  outline: none;
  border-radius: 10px;
  color: white;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: all .2s ease;
  font-family: global.$fontFamilySet;
  border: 1px solid transparent;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  svg {
    height: 18px;
    width: 18px;
    transition: all .2s ease;
  }

  &:hover {
    background: #1c2528;
  }

  &:active {
    filter: brightness(60%);
  }

  &.shadow {
    box-shadow: 0 3px 3px rgba(0, 0, 0, .2);

    &:hover {
      box-shadow: 0 5px 6px rgba(0, 0, 0, .4);
    }
  }

  &.shadow-dark {
    box-shadow: 0 5px 6px rgba(0, 0, 0, .4);
  }

  &.bg-transparent {
    background: transparent;
  }

  &.bg-white {
    background: white;

    &:hover {
      background: #eee;
    }

    &:active {
    filter: brightness(80%);
  }
  }

  &.border-white {
    border-color: white;
  }

  &.border-primary {
    border-color: global.$primaryd;
  }

  &.text-primary {
    color: global.$primaryd;
  }

  &.text-white {
    color: white;
  }
}
</style>