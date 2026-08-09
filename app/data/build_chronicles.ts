import fs from 'fs/promises';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkComment from 'remark-comment';
import remarkRehype from 'remark-rehype';
// @ts-ignore
import remarkExcerpt from 'remark-excerpt';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import * as yaml from 'yaml';
import path from 'path';
import { VFile } from 'vfile';
import type { ChronicleBlock, ChronicleImage, ChronicleItem, PhotoRecord } from '~/data/types';

const SCRIPT_PATH = import.meta.dirname;

const markdownFiles = await fs.readdir(SCRIPT_PATH + '/chronicles');

type Frontmatter = {
	path?: string;
	collection?: string;
};

const parsed: ChronicleItem[] = [];

const htmlProcessor = unified()
	.use(remarkRehype, { allowDangerousHtml: true })
	.use(rehypeStringify);

async function mdastToHtml(node: any): Promise<string> {
	const hast = await htmlProcessor.run({ type: 'root', children: [node] } as any);
	return htmlProcessor.stringify(hast as any);
}

function mdastText(node: any): string {
	if (typeof node.value === 'string') return node.value;
	if (Array.isArray(node.children)) return node.children.map(mdastText).join('');
	return '';
}

function getTitle(tree: any): string {
	for (const child of tree.children ?? []) {
		if (child.type === 'heading' && child.depth === 1) return mdastText(child);
	}
	return '';
}

function isImageParagraph(node: any): boolean {
	return (
		node.type === 'paragraph' &&
		node.children.length > 0 &&
		node.children.every((x: any) => x.type === 'image')
	);
}

function toChronicleImage(node: any): ChronicleImage {
	return {
		path: node.url,
		alt: node.alt || undefined,
		caption: node.title || undefined
	};
}

async function extractSplitBlock(
	value: string,
	align: 'left' | 'right'
): Promise<ChronicleBlock> {
	const innerTree = unified().use(remarkParse).parse(value);
	let imageNode: any;
	const textNodes: any[] = [];

	for (const child of innerTree.children) {
		if (!imageNode && isImageParagraph(child)) {
			imageNode = child;
		} else {
			textNodes.push(child);
		}
	}

	const text = (await Promise.all(textNodes.map(mdastToHtml))).join('');

	if (!imageNode) {
		return { type: 'paragraph', html: text };
	}

	return {
		type: 'split',
		align,
		image: toChronicleImage(imageNode.children[0]),
		text
	};
}

async function extractBlocks(tree: any): Promise<ChronicleBlock[]> {
	const blocks: ChronicleBlock[] = [];

	for (const child of tree.children ?? []) {
		if (child.type === 'heading' && child.depth === 1) continue;

		if (isImageParagraph(child)) {
			blocks.push({ type: 'image', image: toChronicleImage(child.children[0]) });
			continue;
		}

		if (
			child.type === 'code' &&
			(child.lang === 'split-left' || child.lang === 'split-right')
		) {
			blocks.push(
				await extractSplitBlock(
					child.value,
					child.lang === 'split-left' ? 'left' : 'right'
				)
			);
			continue;
		}

		const html = await mdastToHtml(child);
		if (!html) continue;

		blocks.push(
			child.type === 'heading'
				? {
						type: 'heading',
						level: Math.min(Math.max(child.depth, 2), 4) as 2 | 3 | 4,
						html
					}
				: { type: 'paragraph', html }
		);
	}

	return blocks;
}

/**
 * 把 `::: split-left` / `::: split-right` 容器展开成 fenced code，
 * 方便在 markdown 里表达“图片 + 文字”双列布局。
 */
function expandSplitContainers(content: string): string {
	const lines = content.split('\n');
	const output: string[] = [];
	let i = 0;

	while (i < lines.length) {
		const openMatch = /^:::\s*(split-left|split-right)\s*$/.exec(lines[i]);

		if (openMatch) {
			const lang = openMatch[1];
			output.push('```' + lang);
			i++;

			while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
				output.push(lines[i]);
				i++;
			}

			if (i < lines.length) i++;
			output.push('```');
		} else {
			output.push(lines[i]);
			i++;
		}
	}

	return output.join('\n');
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

async function getImageInfo(simpleRepr?: string) {
	if (!simpleRepr) return undefined;

	const result = /^([A-Za-z0-9\-\/]+)\/(.*)$/.exec(simpleRepr);
	if (!result) return undefined;

	const collectionName = result[1].replaceAll('/', '~');
	const collectionItems = (
		await import(SCRIPT_PATH + '/dist/filetrees/' + collectionName + '.json')
	).default as PhotoRecord[];
	const item = collectionItems.find(x => x.name.endsWith(result[2]));
	if (!item?.ts) return undefined;

	return {
		date: new Date(item.ts).toISOString()
	};
}

const parseTasks = markdownFiles.map(async filename => {
	const document = (await fs.readFile(SCRIPT_PATH + '/chronicles/' + filename)).toString();
	const expanded = expandSplitContainers(document);

	const processor = unified()
		.use(remarkParse)
		.use(remarkComment)
		.use(remarkFrontmatter)
		.use(remarkExtractFrontmatter, { yaml: yaml.parse, name: 'fm' });
	const file = new VFile(expanded);
	const tree = (await processor.run(processor.parse(file), file)) as any;
	const fm = (file.data.fm ?? {}) as Partial<Frontmatter>;
	const excerpt = await getExcerpt(expanded);

	const data: ChronicleItem = {
		slug: filename.replace(/\.md$/, ''),
		filename,
		title: getTitle(tree),
		content: await extractBlocks(tree),
		collection: fm.collection ?? (fm.path ? fm.path.replace(/\/[^/]+$/, '') : undefined),
		imagePath: fm.path,
		excerpt: excerpt.length === 0 ? undefined : excerpt,
		imageInfo: await getImageInfo(fm.path)
	};
	parsed.push(data);
});

await Promise.all(parseTasks);

const slugs = parsed.map(x => x.slug);
if (new Set(slugs).size !== slugs.length) {
	throw new Error('构建失败：存在重复的 chronicle slug');
}

await fs.writeFile(SCRIPT_PATH + '/dist/chronicles.json', JSON.stringify(parsed));
await fs.copyFile(
	SCRIPT_PATH + '/dist/chronicles.json',
	path.join(SCRIPT_PATH, '../../public/__data/chronicles.json')
);
