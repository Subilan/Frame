// 数据构建总入口：先构建照片数据，再构建 records。
// 需要单独构建某一部分时，可分别运行 build:photos / build:records。
await import('./build_photos');
await import('./build_records');

export {};
