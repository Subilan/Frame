import fs from 'fs/promises';
import path from 'path';

const STAGES = ['photos', 'records'] as const;
type Stage = (typeof STAGES)[number];

const SCRIPT_PATH = import.meta.dirname;
const DIST_PATH = SCRIPT_PATH + '/dist';
const PUBLIC_DATA_PATH = path.join(SCRIPT_PATH, '../../public/__data');

function readArg(name: string) {
	const prefix = `--${name}`;
	const hit = process.argv.slice(2).find(x => x === prefix || x.startsWith(prefix + '='));
	if (hit === undefined) return undefined;
	return hit.slice(prefix.length + 1);
}

const stageArg = readArg('stage') ?? 'all';

if (stageArg !== 'all' && !STAGES.includes(stageArg as Stage)) {
	throw new Error(`未知的 stage：${stageArg}，可选值为 ${[...STAGES, 'all'].join(' / ')}`);
}

const stages: Stage[] = stageArg === 'all' ? [...STAGES] : [stageArg as Stage];

const stageLoaders: Record<Stage, () => Promise<unknown>> = {
	photos: () => import('./build_photos'),
	records: () => import('./build_records')
};

for (const stage of stages) {
	console.log(`\n▶️ 开始构建 ${stage} 数据\n`);
	await stageLoaders[stage]();
}

// 各阶段只写 dist，统一在这里刷新公开数据目录，避免单独运行某一阶段时留下半成品
await fs.rm(PUBLIC_DATA_PATH, { recursive: true, force: true });
await fs.cp(DIST_PATH, PUBLIC_DATA_PATH, { recursive: true });

console.log(`🌐 已同步 dist 到 public/__data`);
