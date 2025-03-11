<template>
  <Title>{{ lang === 'zh' ? '所有合集' : 'Collections' }}</Title>
  <div class="collection-container navbar-offset">
    <div class="collection-outer" v-for="x in collections" @click="navigateTo(`/collection/${x.ossPrefix}`)">
      <div class="collection card">
        <div class="image">
          <img :src="buildObjectPath(x.ossPrefix, x.banner)" alt="alt" />
        </div>
        <div class="texts">
          <h2><span>{{ x.name[lang] }}</span><small>{{ x.date[lang] }}</small></h2>
          <p class="basic-info">{{ t('collections.photoShownNum', x.pickedAmount) }} · {{ t('collections.photoTotalNum',
            x.totalAmount)}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import collections from "@/static/data/collections.json";
  import buildObjectPath from "@/utils/buildObjectPath";

  const lang = useLanguage();
</script>

<style lang="scss">
@use 'assets/global';

.collection-container {
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 16px;

  @media (max-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 8px;
    padding: 16px;
  }
}

.collection-outer:hover .click-to-open-tip {
  opacity: 1;
  transform: translateY(0);
}

.collection {
  height: 100%;

  .image {
    width: 100%;
    overflow: hidden;
    display: flex;
    height: 15vh;
    align-items: center;
    position: relative;

    @media (max-width: 768px) {
      height: 17vh;
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

      span {
        margin-right: 8px;
      }

      small {
        font-weight: normal;
        text-wrap: nowrap;
      }
    }

    small {
      color: #aaa;
    }

    .basic-info {
      margin-bottom: 0;
    }
  }
}
</style>