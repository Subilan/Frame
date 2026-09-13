import { ArrowLeftIcon } from 'lucide-react';
import { data, Link } from 'react-router';
import type { Route } from './+types/record';
import type { RecordBlock, RecordImage, RecordItem } from '~/data/types';
import formatDate from '~/utils/formatDate';
import getOssUrlFromSimpleRepr from '~/utils/getOssUrlFromSimpleRepr';
import { getJson } from '~/utils/getJson';

export function meta({ data: loaderData }: Route.MetaArgs) {
	const title = loaderData?.record?.title;
	return [
		{ title: title ? `${title} · 记录` : '记录' },
		{ name: 'description', content: title }
	];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const result = await getJson(['/records.json']);
	const record = (result?.[0] as RecordItem[] | undefined)?.find(
		x => x.slug === params.slug
	);

	if (!record) throw data('Not Found', { status: 404 });

	return { record };
}

function ImageFigure({
	image,
	recordTitle,
	className,
	imgClassName,
	captionClassName
}: {
	image: RecordImage;
	recordTitle: string;
	className?: string;
	imgClassName?: string;
	captionClassName?: string;
}) {
	return (
		<figure className={className}>
			<img
				className={'w-full object-cover ' + (imgClassName ?? '')}
				src={getOssUrlFromSimpleRepr(
					image.path + '?x-oss-process=image/resize,w_1200'
				)}
				alt={image.alt ?? recordTitle}
				loading="lazy"
			/>
			{image.caption && (
				<figcaption
					className={
						'mt-2 text-center text-sm text-neutral-500 ' + (captionClassName ?? '')
					}
				>
					{image.caption}
				</figcaption>
			)}
		</figure>
	);
}

type LayoutBlock = Extract<RecordBlock, { type: 'image' | 'split' }>;
type ContentGroup = { type: 'text'; html: string } | { type: 'block'; block: LayoutBlock };

function groupBlocks(blocks: RecordBlock[]): ContentGroup[] {
	const groups: ContentGroup[] = [];

	for (const block of blocks) {
		if (block.type === 'paragraph' || block.type === 'heading') {
			const last = groups[groups.length - 1];
			if (last?.type === 'text') {
				last.html += block.html;
			} else {
				groups.push({ type: 'text', html: block.html });
			}
			continue;
		}

		groups.push({ type: 'block', block });
	}

	return groups;
}

function renderBlock(block: LayoutBlock, recordTitle: string, key: number) {
	switch (block.type) {
		case 'image':
			return (
				<div key={key} className="my-8 md:my-10">
					<ImageFigure
						image={block.image}
						recordTitle={recordTitle}
						captionClassName="px-5"
					/>
				</div>
			);

		case 'split':
			return (
				<div key={key} className="my-10">
					<div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-2 md:gap-16 md:px-5">
						<ImageFigure
							image={block.image}
							recordTitle={recordTitle}
							className={block.align === 'right' ? 'md:order-2' : ''}
							imgClassName="aspect-[4/3] rounded-none md:rounded-2xl"
						/>
						<div
							className={
								'record-text record-text-split px-5 md:px-0' +
								(block.align === 'right' ? ' md:order-1 md:text-right' : '')
							}
							dangerouslySetInnerHTML={{ __html: block.text }}
						/>
					</div>
				</div>
			);
	}
}

export default function Record({ loaderData }: Route.ComponentProps) {
	const { record } = loaderData;
	const date = record.imageInfo?.date
		? formatDate(record.imageInfo.date, 'ymd')
		: null;
	const collectionId =
		record.collection ??
		(record.imagePath ? record.imagePath.replace(/\/[^/]+$/, '') : undefined);

	return (
		<div>
			{record.imagePath && (
				<div className="relative h-[55vh] md:h-[68vh]">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src={getOssUrlFromSimpleRepr(
							record.imagePath + '?x-oss-process=image/resize,h_1080'
						)}
						alt={record.title}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
					<div className="absolute inset-x-0 bottom-0">
						<div className="mx-auto flex max-w-[820px] flex-col gap-3 px-5 pb-8 md:pb-12">
							<Link to="/records" className="inpage-link self-start">
								<ArrowLeftIcon size={18} />
								返回记录
							</Link>
							<h1 className="text-4xl font-bold md:text-6xl">
								{record.title}
							</h1>
							{date && <time className="text-neutral-300">{date}</time>}
						</div>
					</div>
				</div>
			)}

			<article className="pb-16 md:pb-24">
				{groupBlocks(record.content).map((group, i) =>
					group.type === 'text' ? (
						<div
							key={i}
							className="record-text mx-auto max-w-[680px] px-5"
							dangerouslySetInnerHTML={{ __html: group.html }}
						/>
					) : (
						renderBlock(group.block, record.title, i)
					)
				)}
				{collectionId && (
					<div className="mx-auto mt-10 max-w-[680px] px-5 text-center">
						<Link
							to={`/collection/${collectionId}`}
							className="inpage-link"
						>
							在相册中查看 →
						</Link>
					</div>
				)}
			</article>
		</div>
	);
}
