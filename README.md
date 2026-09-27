# the frame

https://photos.subilan.win - A web album designed to showcase the photos I took during my past travels. Version 2.

- [v1 (2025)](https://github.com/Subilan/Frame/tree/v1)

## 数据构建

照片来自 OSS 上的 `public/frame/` 前缀，站点展示所需的数据由 `scripts/build.ts` 一次运行为产出静态 JSON，最终落到 `public/__data/`，运行时按路由按需拉取。

```bash
npm run build:data                    # 一次产出全部数据
npm run build:data -- --skip-regeo    # 没有 AMAP_KEY 时跳过逆地理编码
npm run build:data -- --force         # 全量重新请求逆地理编码（默认只补缺失项）
npm run build:data -- --interval=500  # 调整逆地理编码的请求间隔
```

一次运行内部按依赖顺序走完：枚举 OSS 照片并补齐缺失的 EXIF（写入 `cache/exif_cache.json`）→ 根据 EXIF 里的 GPS 补齐缺失的逆地理编码（写入 `cache/regeo.json`）→ 生成文件目录、分类索引与站点统计 → 解析游记 markdown。两个缓存都会被复用，已拉取过的照片不会重复请求；缺少 `AMAP_KEY` 且确实有缺失项时会中止，不会产出没有地址的数据。

`.env` 需要提供 OSS 的 `AKID`、`AKSECRET`，以及高德 Web 服务 key `AMAP_KEY`。产物先写 `scripts/.data/`，全部环节成功后才整体替换 `public/__data/`，因此构建失败不会影响已发布的数据。

## 目录约定

```
scripts/          构建脚本
  build.ts        入口，按依赖顺序跑完全部环节
  photos.ts       枚举 OSS 照片，生成 filetrees、分类索引与集合元信息
  records.ts      把游记 markdown 解析成结构化内容
  regeo.ts        逆地理编码的补取与缓存（由 photos 环节调用）
  options.ts      命令行参数
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
