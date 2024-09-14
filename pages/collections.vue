<template>
  <div class="collection-container navbar-offset">
    <div class="collection-outer" v-for="x in 8" @click="navigateTo('/collection/a-journey-to-xinjiang')">
      <div class="collection">
        <div class="image">
          <img src="@/assets/index.jpg" alt="alt"/>
        </div>
        <div class="texts">
          <h2>A Journey to Xinjiang</h2>
          <p class="basic-info">Feb, 2024 · 1396 photos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">

.collection-container {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 16px;
}

.collection-outer:hover .click-to-open-tip {
  opacity: 1;
  transform: translateY(0);
}

.collection {
  box-sizing: border-box;
  background: white;
  position: relative;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, .1);
  transition: all .2s ease;
  cursor: pointer;
  overflow: hidden;
  height: 230px;

  &::after {
    content: 'Enter collection';
    position: absolute;
    bottom: -16px;
    font-size: 14px;
  }

  &:hover {
    border: 3px solid black;
    box-shadow: 0 15px 18px rgba(0, 0, 0, .2);
    transform: translateY(-5px);
  }

  .image {
    width: 100%;
    max-height: 15vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
  }

  img {
    width: 100%;
    height: 100%;
    transition: all .2s ease;
    object-fit: cover;
  }

  .texts {
    padding: 10px;

    h2 {
      margin: 0;
      font-style: italic;
    }

    small {
      color: #aaa;
    }
  }
}
</style>
<script setup lang="ts">
</script>