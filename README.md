# the frame

https://photos.subilan.win - A web album designed to showcase the photos I took during my past travels. Version 2.

- [v1 (2025)](https://github.com/Subilan/Frame/tree/v1)

## 数据构建

照片来自 OSS 上的 `public/frame/` 前缀，站点展示所需的数据由 `app/data/` 下的脚本构建成静态 JSON，最终落到 `public/__data/`，运行时按路由按需拉取。

```bash
npm run build:all                 # 构建 photos 与 records 两个阶段
npm run build:all -- --stage=photos   # 只构建照片数据（需要 OSS 凭证）
npm run build:all -- --stage=records  # 只构建记录数据（依赖 photos 阶段产出的 dist/filetrees）
npm run build:regeo               # 增量补齐逆地理编码（需要 AMAP_KEY）
npm run build:regeo -- --force    # 全量重新请求逆地理编码
```

`.env` 需要提供 OSS 的 `AKID`、`AKSECRET`，以及高德 Web 服务 key `AMAP_KEY`。各阶段只写 `app/data/dist/`，`public/__data/` 由 `build.ts` 在全部阶段结束后统一同步。

人工维护的输入分别是：描述相册树与文案的 `app/data/collections.json`、按集合分文件的照片注解 `app/data/captions/*.toml`、游记正文 `app/data/records/*.md`。`app/data/exif_cache.json` 与 `app/data/regeo.json` 是构建期缓存与外部接口结果，可由脚本重新生成。
