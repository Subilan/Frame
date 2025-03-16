<template>
  <Title>按分类查看</Title>
  <div class="categories-container common-container navbar-offset">
    <h1>按分类查看</h1>
    <p>根据照片本身存储和人工标记的数据，这里列出了几个分类维度，以便快速查阅满足相关条件的图片。</p>
    <h2>按时间</h2>
    <p>此分类下共有 {{ getTotalCount(categories.dates) }} 张照片。</p>
    <div class="categories">
      <div class="category" v-for="x in categories.dates" @click="navigateTo(`/category/date/${x.c.year}.${x.c.month}`)"
        :style="{ backgroundImage: `url(${toURL(x.firstImage, '100')})` }">
        <div class="text">
          <div class="primary">{{ x.c.year }} 年 {{ x.c.month }} 月</div>
          <div class="secondary"> {{ x.count }} 张</div>
        </div>
      </div>
    </div>
    <h2>按地区</h2>
    <p>
      选择层级
      <select v-model="regionLevel">
        <option value="2">三级（区）</option>
        <option value="1">二级（市）</option>
        <option value="0">一级（省）</option>
      </select>
      ，此分类下共有 {{ getTotalCount(categories.regions) }} 张照片，标 <icon style="vertical-align: middle;" :path="mdiAirplane"/> 的表示包含在飞机上拍摄的照片。
    </p>
    <div class="categories">
      <div class="category" v-for="x in regions[Number(regionLevel)]"
        :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }" @click="navigateTo(`/category/region/${x.c.geo.name}`)">
        <div class="text">
          <div class="primary">{{ x.c.geo.name }}
            <icon :path="mdiAirplane" v-if="x.c.isFlying" />
          </div>
          <div class="secondary">{{
            removeGeoExtPathPrefix(x.c.geo.ext_path, x.c.geo.name).length > 0 ?
              removeGeoExtPathPrefix(x.c.geo.ext_path, x.c.geo.name) + ' · ' : ''
          }}{{ x.count }} 张
          </div>
        </div>
      </div>
    </div>
    <h2>按特定地点</h2>
    <p>此分类下共有 {{ getTotalCount(categories.spots) }} 张照片。</p>
    <div class="categories">
      <div class="category" v-for="x in categories.spots"
        :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }" @click="navigateTo(`/category/spot/${x.c}`)">
        <div class="text">
          <div class="primary">{{ x.c }}
          </div>
          <div class="secondary">{{ x.count }} 张
          </div>
        </div>
      </div>
    </div>
    <h2>按交通设施</h2>
    <p>此分类下共有 {{ getTotalCount(categories.transportation.road) + getTotalCount(categories.transportation.subwayStations)
    }} 张照片。</p>
    <div class="categories">
      <div class="category" v-for="x in categories.transportation.road"
        :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }" @click="navigateTo(`/category/road/${x.c.name}`)">
        <div class="text">
          <div class="primary">
            <img alt="svg" height="45px" :src="`/road-svg/${x.c.name}.svg`" draggable="false" />
            {{ getRoadName(x.c.name) }} · {{ x.c.loc }}
          </div>
          <div class="secondary">
            {{ x.count }} 张
          </div>
        </div>
      </div>
      <div class="category" v-for="x in categories.transportation.subwayStations"
        :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }" @click="navigateTo(`/category/subway/${x.c.line}@${x.c.station}`)">
        <div class="text">
          <div class="primary">
            <img alt="svg" height="45px" :src="`/subway-svg/${x.c.line}.svg`" draggable="false" />
            {{ x.c.station }}
          </div>
          <div class="secondary">
            {{ x.c.ext_path }} · {{ x.count }} 张
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { mdiAirplane } from '@mdi/js';
  import Category from '~/static/category.json';
  import type { Categories, CategoryItem } from '~/types/common/objects';
  import removeGeoExtPathPrefix from '~/utils/client/removeGeoExtPathPrefix';
  import toURL from '~/utils/client/toURL';
  import distinct from '~/utils/common/distinct';

  const categories = Category as Categories;

  function getTotalCount<T>(category: CategoryItem<T>[]) {
    return category.reduce((a, x) => a + x.count, 0);
  }

  const regionLevel = useCookie<string>('frame-categories-region-level', {
    default: () => '2'
  });

  const regionLevel1Categories = distinct(categories.regions.map(x => {
    let splitted = x.c.geo.ext_path.split(' ');
    let ext_path = splitted.length === 2 ? '香港特别行政区' : splitted[splitted.length - 3];
    return {
      geo: {
        ext_path, name: ext_path
      },
      isFlying: x.c.isFlying
    };
  }), (a, b) => a.geo.ext_path === b.geo.ext_path);

  const regionLevel2Categories = distinct(categories.regions.map(x => {
    let splitted = x.c.geo.ext_path.split(' ');
    let ext_path = splitted.slice(0, splitted.length - 1).join(' ');
    let ext_path_splitted = ext_path.split(' ');
    let name = ext_path_splitted.length === 2 ? ext_path_splitted[1] : ext_path;
    return {
      geo: { ext_path, name },
      isFlying: x.c.isFlying
    }
  }), (a, b) => a.geo.ext_path === b.geo.ext_path);

  const regions: typeof Category['regions'][] = [[], [], categories.regions as typeof Category['regions']];

  const pre1 = regionLevel1Categories.map(x => categories.regions.filter(y => y.c.geo.ext_path.startsWith(x.geo.ext_path)));
  const pre2 = regionLevel2Categories.map(x => categories.regions.filter(y => y.c.geo.ext_path.startsWith(x.geo.ext_path)));

  for (let i = 0; i < pre1.length; i++) {
    regions[0].push({
      c: {
        geo: {
          name: regionLevel1Categories[i].geo.name,
          ext_path: regionLevel1Categories[i].geo.ext_path,
        },
        isFlying: regionLevel1Categories[i].isFlying
      },
      firstImage: pre1[i][0].firstImage,
      count: pre1[i].reduce((a, y) => a + y.count, 0)
    })
  }

  for (let i = 0; i < pre2.length; i++) {
    regions[1].push({
      c: {
        geo: {
          name: regionLevel2Categories[i].geo.name,
          ext_path: regionLevel2Categories[i].geo.name,
        },
        isFlying: regionLevel2Categories[i].isFlying
      },
      firstImage: pre2[i][0].firstImage,
      count: pre2[i].reduce((a, y) => a + y.count, 0)
    })
  }

  function getRoadName(road: string) {
    switch (road) {
      case 'g217': return '独库公路';
      case 'g30': return '连霍高速';
    }

    if (road.startsWith('g')) return '国道';
    if (road.startsWith('s')) return '省道';

    return '';
  }
</script>

<style lang="scss" scoped>
@use '@/assets/global';

select {
  border: 2px solid #ddd;
  outline: none;
  border-radius: 5px;
  transition: all .2s ease;

  &:hover {
    border-color: global.$primarydd;
  }
}

.categories {
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;

  .category {
    @extend .card;
    border-color: #ddd;
    flex: auto;
    padding: 16px;
    color: white;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;

    &:hover {

      &::after {
        background: rgba($color: #000000, $alpha: .1);
      }
    }

    &::after {
      content: '';
      background: rgba($color: #000000, $alpha: .3);
      transition: all .2s ease;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 8px;
      line-height: 1;
      z-index: 10;
      position: relative;
      text-shadow: 0 2px 5px rgba($color: #000000, $alpha: .3);

      .primary {
        font-size: 32px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .secondary {
        color: #ddd;
      }
    }
  }
}
</style>