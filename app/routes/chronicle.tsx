import { ArrowLeftIcon } from 'lucide-react';
import { data, Link } from 'react-router';
import type { Route } from './+types/chronicle';
import type { ChronicleBlock, ChronicleImage, ChronicleItem } from '~/data/types';
import formatDate from '~/utils/formatDate';
import getOssUrlFromSimpleRepr from '~/utils/getOssUrlFromSimpleRepr';
import { getJson } from '~/utils/getJson';

export function meta({ data: loaderData }: Route.MetaArgs) {
	const title = loaderData?.chronicle?.title;
	return [
		{ title: title ? `${title} · 记录` : '记录' },
		{ name: 'description', content: title }
	];
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const result = await getJson(['/chronicles.json']);
	const chronicle = (result?.[0] as ChronicleItem[] | undefined)?.find(
		x => x.slug === params.slug
	);

	if (!chronicle) throw data('Not Found', { status: 404 });

	return { chronicle };
}

function ImageFigure({
	image,
	chronicleTitle,
	className,
	imgClassName,
	captionClassName
}: {
	image: ChronicleImage;
	chronicleTitle: string;
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
				alt={image.alt ?? chronicleTitle}
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

function renderBlock(block: ChronicleBlock, chronicleTitle: string, key: number) {
	switch (block.type) {
		case 'image':
			return (
				<div key={key} className="my-8 md:my-10">
					<ImageFigure
						image={block.image}
						chronicleTitle={chronicleTitle}
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
							chronicleTitle={chronicleTitle}
							className={block.align === 'right' ? 'md:order-2' : ''}
							imgClassName="aspect-[4/3] rounded-none md:rounded-2xl"
						/>
						<div
							className={
								'px-5 md:px-0 ' +
								(block.align === 'right' ? 'md:order-1 md:text-right ' : '') +
								'[&_p]:my-3 [&_p]:text-lg [&_p]:leading-8 [&_p]:text-neutral-200'
							}
							dangerouslySetInnerHTML={{ __html: block.text }}
						/>
					</div>
				</div>
			);

		case 'heading':
			return (
				<div
					key={key}
					className="mx-auto max-w-[680px] px-5 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold"
					dangerouslySetInnerHTML={{ __html: block.html }}
				/>
			);

		case 'paragraph':
			return (
				<div
					key={key}
					className="mx-auto max-w-[680px] px-5 [&_h1]:hidden [&_p]:my-5 [&_p]:text-lg [&_p]:leading-8 [&_p]:text-neutral-200 [&_ul]:my-5 [&_ol]:my-5 [&_blockquote]:my-5 [&_blockquote]:border-l-2 [&_blockquote]:border-neutral-700 [&_blockquote]:pl-4 [&_blockquote]:text-neutral-300 [&_a]:text-sky-500 [&_a]:underline"
					dangerouslySetInnerHTML={{ __html: block.html }}
				/>
			);
	}
}

export default function Chronicle({ loaderData }: Route.ComponentProps) {
	const { chronicle } = loaderData;
	const date = chronicle.imageInfo?.date
		? formatDate(chronicle.imageInfo.date, 'ymd')
		: null;
	const collectionId =
		chronicle.collection ??
		(chronicle.imagePath ? chronicle.imagePath.replace(/\/[^/]+$/, '') : undefined);

	return (
		<div>
			{chronicle.imagePath && (
				<div className="relative h-[55vh] md:h-[68vh]">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src={getOssUrlFromSimpleRepr(
							chronicle.imagePath + '?x-oss-process=image/resize,h_1080'
						)}
						alt={chronicle.title}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
					<div className="absolute inset-x-0 bottom-0">
						<div className="mx-auto flex max-w-[820px] flex-col gap-3 px-5 pb-8 md:pb-12">
							<Link to="/chronicles" className="inpage-link self-start">
								<ArrowLeftIcon size={18} />
								返回记录
							</Link>
							<h1 className="text-4xl font-bold md:text-6xl">
								{chronicle.title}
							</h1>
							{date && <time className="text-neutral-300">{date}</time>}
						</div>
					</div>
				</div>
			)}

			<article className="pb-16 md:pb-24">
				{chronicle.content.map((block, i) =>
					renderBlock(block, chronicle.title, i)
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
