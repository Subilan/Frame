import fs from 'fs/promises';
import { DIST_PATH, PUBLIC_DATA_PATH } from './paths';

// 顺序即依赖：photos 一次性补齐 EXIF、逆地理编码并产出文件目录与分类，records 再读取其中的文件目录
import './photos';
import './records';

// 全部阶段成功后才刷新公开数据目录，构建失败时不影响已发布的数据
await fs.rm(PUBLIC_DATA_PATH, { recursive: true, force: true });
await fs.cp(DIST_PATH, PUBLIC_DATA_PATH, { recursive: true });

console.log(`🌐 已同步产物到 public/__data`);
