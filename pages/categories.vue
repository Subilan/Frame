<template>
  <Title>按分类查看</Title>
  <div class="categories-container common-container navbar-offset">
    <section class="hero">
      <div class="hero-inner">
        <h1>按分类查看</h1>
        <p>根据照片本身存储和人工标记的数据，这里列出了几个分类维度，以便快速查阅满足相关条件的图片。</p>
        <div class="available-categories">
          <div class="available-category" v-for="x in availableCategories" @click="scrollToSection(x)">
            <h3>{{ getCategoryTypeName(x)[lang] }} <small>{{ t('collectionView.photoNumSimple', x === 'transportation' ?
              (getTotalCount(categories.transportation.road) +
                getTotalCount(categories.transportation.subway)) : getTotalCount(categories[x])) }}</small></h3>
            <span>{{ availableCategoryDescriptions[x] }}</span>
            <icon :path="availableCategoryIcons[x]" />
          </div>
        </div>
      </div>
    </section>
    <section id="by-date">
      <h2>按日期</h2>
      <div class="categories">
        <div class="category" v-for="x in categories.date"
          @click="navigateTo(`/category/date/${x.c.year}.${x.c.month}`)"
          :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }">
          <div class="text">
            <div class="primary">{{ x.c.year }} 年 {{ x.c.month }} 月</div>
            <div class="secondary"> {{ x.count }} 张</div>
          </div>
        </div>
      </div>
    </section>
    <section id="by-region">
      <h2>按地区</h2>
      <select v-model="regionLevel">
        <option value="2">三级（区）</option>
        <option value="1">二级（市）</option>
        <option value="0">一级（省）</option>
      </select>
      <p>标
        <icon :path="mdiAirplane" style="vertical-align: middle;" /> 的包含在飞机上拍摄的照片
      </p>
      <div class="categories">
        <div class="category" v-for="x in regions[Number(regionLevel)]"
          :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }"
          @click="navigateTo(`/category/region/${x.c.geo.name}`)">
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
    </section>
    <section id="by-spot">
      <h2>按特定地点</h2>
      <div class="categories">
        <div class="category" v-for="x in categories.spot"
          :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }"
          @click="navigateTo(`/category/spot/${x.c}`)">
          <div class="text">
            <div class="primary">{{ x.c }}
            </div>
            <div class="secondary">{{ x.count }} 张
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="by-transportation">
      <h2>按交通设施</h2>
      <div class="categories">
        <div class="category" v-for="x in categories.transportation.road"
          :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }"
          @click="navigateTo(`/category/road/${x.c.name}`)">
          <div class="text">
            <div class="primary">
              <img alt="svg" :src="`/road-svg/${x.c.name}.svg`" draggable="false" />
              {{ getRoadName(x.c.name) }} · {{ x.c.loc }}
            </div>
            <div class="secondary">
              {{ x.count }} 张
            </div>
          </div>
        </div>
        <div class="category" v-for="x in categories.transportation.subway"
          :style="{ backgroundImage: `url(${toURL(x.firstImage, '200')})` }"
          @click="navigateTo(`/category/subway/${x.c.line}@${x.c.station}`)">
          <div class="text">
            <div class="primary">
              <img alt="svg" :src="`/subway-svg/${x.c.line === 'chongqing-2-3' ? 'chongqing-2-3-white' : x.c.line}.svg`" draggable="false" />
              {{ x.c.station }}
            </div>
            <div class="secondary">
              {{ x.c.ext_path }} · {{ x.count }} 张
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <bottom-hover-btn @c="navigateTo('/collections')">
    <icon :path="mdiImageMultiple" />按合集查看
  </bottom-hover-btn>
</template>

<script lang="ts" setup>
  import { mdiAirplane, mdiCalendar, mdiCreationOutline, mdiFile, mdiImageMultiple, mdiMapMarker, mdiTrain } from '@mdi/js';
  import Category from '~/static/category.json';
  import type { Categories, CategoryType } from '~/types/common/objects';
  import removeGeoExtPathPrefix from '~/utils/client/removeGeoExtPathPrefix';
  import t from '~/utils/client/t';
  import toURL from '~/utils/client/toURL';
  import distinct from '~/utils/common/distinct';
  import getCategoryTypeName from '~/utils/common/getCategoryTypeName';

  const categories = Category as Categories;
  const lang = useLanguage();

  function getTotalCount(category: any[]) {
    return category.reduce((a, x) => a + x.count, 0);
  }

  const regionLevel = useCookie<string>('frame-categories-region-level', {
    default: () => '2'
  });

  const regionLevel1Categories = distinct(categories.region.map(x => {
    let splitted = x.c.geo.ext_path.split(' ');
    let ext_path = splitted.length === 2 ? '香港特别行政区' : splitted[splitted.length - 3];
    return {
      geo: {
        ext_path, name: ext_path
      },
      isFlying: x.c.isFlying
    };
  }), (a, b) => a.geo.ext_path === b.geo.ext_path);

  const regionLevel2Categories = distinct(categories.region.map(x => {
    let splitted = x.c.geo.ext_path.split(' ');
    let ext_path = splitted.slice(0, splitted.length - 1).join(' ');
    let ext_path_splitted = ext_path.split(' ');
    let name = ext_path_splitted.length === 2 ? ext_path_splitted[1] : ext_path;
    return {
      geo: { ext_path, name },
      isFlying: x.c.isFlying
    }
  }), (a, b) => a.geo.ext_path === b.geo.ext_path);

  const regions: typeof Category['region'][] = [[], [], categories.region as typeof Category['region']];

  const pre1 = regionLevel1Categories.map(x => categories.region.filter(y => y.c.geo.ext_path.startsWith(x.geo.ext_path)));
  const pre2 = regionLevel2Categories.map(x => categories.region.filter(y => y.c.geo.ext_path.startsWith(x.geo.ext_path)));

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

  function scrollToSection(category: string) {
    document.getElementById(`by-${category}`)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const availableCategories: (keyof Categories)[] = ['date', 'region', 'spot', 'transportation'];
  const availableCategoryDescriptions: { [key in CategoryType]: string } = {
    road: '',
    date: '根据图片拍摄时记录的日期信息进行分类，精确到月份，如“2024 年 2 月”。',
    spot: '这是一个人工标识的属性，标记着图片拍摄时所在的景点或特定场所的名称，如“九寨沟”或“四月咖啡”。',
    subway: '',
    region: '根据图片拍摄时记录的 GPS 信息，按拍摄地点的三级行政区划（香港特别行政区只有两级数据）进行分类，如“深圳市”。',
    transportation: '根据图片拍摄所处位置附近的交通设施进行分类，例如公路，包括国道、省道和高速公路，或者某个城市具体的地铁站，如“G217”或“深圳 3 号线草埔”。'
  }
  const availableCategoryIcons: { [key in CategoryType]: string } = {
    road: '',
    date: mdiCalendar,
    spot: mdiCreationOutline,
    region: mdiMapMarker,
    transportation: mdiTrain,
    subway: ''
  }
</script>

<style lang="scss" scoped>
@use '@/assets/global';

.hero {
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    height: calc(100dvh - global.$navbarHeight);
  }

  p {
    text-align: center;
  }
}

.available-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  text-align: left;
  gap: 16px;
  margin: 16px 0;

  @media(max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }

  @media(max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .available-category {
    @extend .card;
    padding: 16px;

    @media (max-width: 768px) {
      font-size: 16px;
    }

    h3 {
      font-size: 28px;
      margin-top: 0;

      @media (max-width: 768px) {
        font-size: 20px;
      }

      small {
        font-weight: normal;
      }
    }

    svg {
      position: absolute;
      right: 16px;
      bottom: 16px;
      opacity: .05;
      height: 100px;
      width: 100px;
      transition: all .2s ease;

      @media (max-width: 768px) {
        height: 70px;
        width: 70px;
        bottom: unset;
        top: 16px;
      }
    }

    @media (min-width: 768px) {
      &:hover svg {
        opacity: .1;
      }
    }
  }
}

select {
  border: 2px solid #ddd;
  outline: none;
  border-radius: 5px;
  transition: all .2s ease;
  display: block;
  margin: 0 auto;
  font-size: 18px;

  &:hover {
    border-color: global.$primarydd;
  }
}

.categories-container {
  font-size: 18px;
  line-height: 1.5;

  @media (min-width: 768px) {
    margin-top: 0;
  }

  h1 {
    font-size: 250%;
    text-align: center;
  }

  h2 {
    font-size: 200%;
    text-align: center;
  }

  >p {
    max-width: 50%;
    margin: 0 auto;
    text-align: center;
  }

  section:not(:first-of-type) {
    margin: 32px 0;

    >p {
      text-align: center;
    }
  }

  .categories {
    margin: 16px 0;
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

    @media (min-width: 768px) {
      &:hover {
        &::after {
          background: rgba($color: #000000, $alpha: .1);
        }
      }
    }

    &::after {
      content: '';
      background: rgba($color: #000000, $alpha: .5);
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
        margin-bottom: 8px;

        @media (max-width: 768px) {
          flex-wrap: wrap;
        }

        img {
          height: 45px;

          @media (max-width: 768px) {
            height: 38px;
          }
        }

        @media (max-width: 768px) {
          font-size: 24px;
        }
      }

      .secondary {
        color: #ddd;

        @media (max-width: 768px) {
          font-size: 14px;
        }
      }
    }
  }
}
</style>