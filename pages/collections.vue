<template>
  <div class="collection-container navbar-offset">
    <div class="collection-outer" v-for="x in collections" @click="navigateTo(`/collection/${x.ossPrefix}`)">
      <div class="collection">
        <div class="image">
          <img :src="buildObjectPath(x.ossPrefix, x.banner)" alt="alt"/>
        </div>
        <div class="texts">
          <h2>{{ x.name }}</h2>
          <p class="basic-info">{{ x.date }} · {{ x.totalAmount }} photos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import collections from "@/static/data/collections.json";
import buildObjectPath from "@/utils/buildObjectPath";

</script>

<style lang="scss">
@use 'assets/global';

.collection-container {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
    padding: 16px;
  }
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
  border: 2px solid rgba(0, 0, 0, .1);
  transition: all .2s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: global.$primaryd;
    box-shadow: 0 15px 18px rgba(0, 0, 0, .2);
    transform: translateY(-5px);
  }

  .image {
    width: 100%;
    overflow: hidden;
    display: flex;
    height: 15vh;
    align-items: center;
    position: relative;

    @media (max-width: 768px) {
      height: 13vh;
    }
  }

  img {
    width: 100%;
    height: 100%;
    transition: all .2s ease;
    object-fit: cover;
  }

  .texts {
    padding: 14px;

    @media (max-width: 768px) {
      font-size: 14px;
      padding: 8px;
    }

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