<template>
  <div class="copyright">© 2024 Subilan, under <a
      href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1" target="_blank"
      rel="license noopener noreferrer">CC BY-SA 4.0<img
      src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img
      src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img
      src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></a></div>
</template>

<style lang="scss">
.copyright {
  padding: 8px;
  opacity: .5;
  transition: all .2s ease;
  background: rgba(0, 0, 0, .9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    opacity: 1;
  }

  &, a {
    color: white
  }

  img {
    height: 16px;
    margin-left: 3px;
    vertical-align: middle;
  }
}
</style>