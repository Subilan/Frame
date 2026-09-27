import path from 'path';

export const ROOT_PATH = path.join(import.meta.dirname, '..');
export const ENV_PATH = path.join(ROOT_PATH, '.env');
export const DATA_PATH = path.join(ROOT_PATH, 'app/data');
export const CACHE_PATH = path.join(DATA_PATH, 'cache');
export const PUBLIC_DATA_PATH = path.join(ROOT_PATH, 'public/__data');
export const DIST_PATH = path.join(import.meta.dirname, '.data');
