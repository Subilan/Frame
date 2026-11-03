# the frame

https://photos.subilan.win - A web album designed to showcase the photos I took during my past travels. Version 2.

- [v1 (2025)](https://github.com/Subilan/Frame/tree/v1)

## 数据构建

照片来自 OSS 上的 `public/frame/` 前缀，站点展示所需的数据由 `scripts/build.ts` 一次运行为产出静态 JSON，最终落到 `public/__data/`，运行时按路由按需拉取。

```bash
npm run build:data
```

一次运行内部按依赖顺序走完：枚举 OSS 照片并补齐缺失的 EXIF（写入 `cache/exif_cache.json`）→ 根据 EXIF 里的 GPS 补齐缺失的逆地理编码与 AOI（写入 `cache/regeo.json`）→ 生成文件目录、分类索引与站点统计 → 解析游记 markdown。两个缓存都会被复用，已拉取过的照片不会重复请求；缺少 `AMAP_KEY` 且确实有缺失项时会中止，不会产出没有地址的数据。请求间隔、并发数等参数直接写在 `scripts/regeo.ts` 顶部；需要全量重取逆地理编码时，删除 `app/data/cache/regeo.json` 后重跑即可。

逆地理编码使用 `extensions=all`，会额外拿到照片所在的 AOI（面状兴趣区）。构建时只把**落在景区 AOI 内**的照片归入「景点」分类：AOI 类型需属于风景名胜、公园广场、博物馆、美术馆等，面积不能太小，且至少要有 3 张照片才会进入索引。只是“在景点附近”的照片不会被强行归类。同一坐标落在多个嵌套 AOI 时按“目的地”粒度选择（博物馆优先，其次名称上涵盖其它候选的父级区域，最后取面积最大的区域），避免一次到访被拆成扎如沟、五花海这样的子景点。景点索引的键是 AOI id，展示名和城市等元信息在 `categories/spot-meta.json` 中。

`.env` 需要提供 OSS 的 `AKID`、`AKSECRET`，以及高德 Web 服务 key `AMAP_KEY`。产物先写 `scripts/.data/`，全部环节成功后才整体替换 `public/__data/`，因此构建失败不会影响已发布的数据。

## 目录约定

```
scripts/          构建脚本
  build.ts        入口，按依赖顺序跑完全部环节
  photos.ts       枚举 OSS 照片，生成 filetrees、分类索引与集合元信息
  records.ts      把游记 markdown 解析成结构化内容
  regeo.ts        逆地理编码的补取与缓存（由 photos 环节调用）
  paths.ts        统一的路径常量
  .data/          构建产物，全部成功后同步到 public/__data（gitignore）
  utils/
app/data/         数据
  types.ts        前后端共用的数据契约
  collections.json    相册树与文案（人工维护）
  captions/*.toml     照片注解（人工维护）
  records/*.md        游记正文（人工维护）
  cache/
    exif_cache.json   已拉取过的 EXIF，避免重复请求 OSS
    regeo.json        逆地理编码结果与更新日期，重建需要消耗接口配额
```
