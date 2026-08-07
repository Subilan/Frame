import { useMemo } from 'react';
import { Link, useOutletContext } from 'react-router';
import type { Route } from './+types/chronicles';
import type { ChronicleItem } from '~/data/types';
import formatDate from '~/utils/formatDate';
import getOssUrlFromSimpleRepr from '~/utils/getOssUrlFromSimpleRepr';
import { getJson } from '~/utils/getJson';
import type { NavLayoutOutletContext } from '~/layouts/NavLayout';

type Chronicle = ChronicleItem & { imagePath: string };

function latestDate(items: Chronicle[]) {
	return items.reduce((max, item) => {
		const date = item.imageInfo?.date ?? '';
		return date > max ? date : max;
	}, '');
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: '记录' },
		{ name: 'description', content: '用精选的照片与文字，记录每一次旅行。' }
	];
}

export async function clientLoader(): Promise<{ chronicles: Chronicle[] }> {
	const result = await getJson(['/chronicles.json']);
	const chronicles = ((result?.[0] as ChronicleItem[] | undefined) ?? [])
		.filter((x): x is Chronicle => !!x.imagePath)
		.sort((a, b) => (b.imageInfo?.date ?? '').localeCompare(a.imageInfo?.date ?? ''));

	return { chronicles };
}

export default function Chronicles({ loaderData }: Route.ComponentProps) {
	const { chronicles } = loaderData;
	const {
		navLoaderData: { allCollections }
	} = useOutletContext<NavLayoutOutletContext>();

	const groups = useMemo(() => {
		const groupMap = new Map<string, Chronicle[]>();

		for (const chronicle of chronicles) {
			const key = chronicle.collection ?? '未分类';
			const items = groupMap.get(key) ?? [];
			items.push(chronicle);
			groupMap.set(key, items);
		}

		return Array.from(groupMap.entries())
			.map(([id, items]) => ({
				id,
				title: allCollections[id]?.title ?? id,
				items
			}))
			.sort((a, b) => latestDate(b.items).localeCompare(latestDate(a.items)));
	}, [chronicles, allCollections]);

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Chronicles</h1>
				<p className="text-neutral-500">用精选的照片与文字，记录每一次旅行。</p>
			</section>

			<div className="flex flex-col gap-16">
				{groups.map(group => (
					<section key={group.id} className="flex flex-col gap-6">
						<div className="flex items-baseline justify-between gap-4">
							<h2 className="text-3xl">{group.title}</h2>
							<Link
								to={`/collection/${group.id}`}
								className="inpage-link text-sm shrink-0"
							>
								前往合集 →
							</Link>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{group.items.map(chronicle => (
								<Link
									key={chronicle.slug}
									to={`/chronicles/${chronicle.slug}`}
									className="flex flex-col gap-3 hover:opacity-90 active:opacity-70"
								>
									<div className="aspect-[4/3] overflow-hidden rounded-2xl">
										<img
											className="h-full w-full object-cover"
											src={getOssUrlFromSimpleRepr(
												chronicle.imagePath +
													'?x-oss-process=image/resize,h_500'
											)}
											alt={chronicle.title}
											loading="lazy"
										/>
									</div>
									<div>
										<h3 className="text-xl font-bold">{chronicle.title}</h3>
										{chronicle.imageInfo?.date && (
											<time className="text-sm text-neutral-500">
												{formatDate(chronicle.imageInfo.date, 'ym')}
											</time>
										)}
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
