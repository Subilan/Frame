import fs from 'fs/promises';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import rehypeInferTitleMeta from 'rehype-infer-title-meta';
import remarkParse from 'remark-parse';
import remarkComment from 'remark-comment';
import remarkRehype from 'remark-rehype';
// @ts-ignore
import remarkExcerpt from 'remark-excerpt';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import * as yaml from 'yaml';
import path from 'path';
const SCRIPT_PATH = import.meta.dirname;

const markdownFiles = await fs.readdir(SCRIPT_PATH + '/highlights');

function applyPipeline(content: string) {
	return unified()
		.use(remarkParse)
		.use(remarkComment)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, { yaml: yaml.parse, name: 'fm' })
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeInferTitleMeta)
		.use(rehypeStringify)
		.process(content);
}

async function getExcerpt(content: string) {
	const result = await unified()
		.use(remarkFrontmatter)
		.use(remarkExcerpt)
		.use(remarkParse)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeStringify)
		.process(content);
	return result.toString();
}

export type HighlightItem = {
	filename: string;
	title: string;
	content: string;
	imagePath?: string;
	excerpt?: string;
};

type Frontmatter = {
	path: string;
};

const parsed: HighlightItem[] = [];

const parseTasks = markdownFiles.map(async filename => {
	const document = (await fs.readFile(SCRIPT_PATH + '/highlights/' + filename)).toString();
	const result = await applyPipeline(document);
	const content = result.toString();
	const excerpt = await getExcerpt(document);
	const fm = result.data.fm as Partial<Frontmatter>;
	const data: HighlightItem = {
		filename,
		title: result.data.meta?.title || '',
		content,
		imagePath: fm.path,
		excerpt: excerpt.length === content.length ? undefined : excerpt
	};
	parsed.push(data);
});

await Promise.all(parseTasks);

await fs.writeFile(SCRIPT_PATH + '/dist/highlights.json', JSON.stringify(parsed));
await fs.copyFile(
	SCRIPT_PATH + '/dist/highlights.json',
	path.join(SCRIPT_PATH, '../../public/__data/highlights.json')
);
