import Card from '~/components/Card';
import type { Route } from './+types/home';
import collections from '~/data/collections.json';
import { useMemo } from 'react';
import useFiletreeLengths from '~/hooks/useFiletreeLengths';

export function meta({}: Route.MetaArgs) {
	return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

function cpath(name: string) {
	return `/collection/${name}`;
}

export default function Home() {
	const featuredCollection = useMemo(() => collections.find(x => x.featured)!, [collections]);
	const lengths = useFiletreeLengths();

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Photos</h1>
				<p className="text-neutral-500">所有公开照片</p>
			</section>
			<section className="flex flex-col gap-10">
				<Card.Large to={cpath(featuredCollection.name)} title={featuredCollection.title} featured count={lengths[featuredCollection.name]} bg={featuredCollection.image + '?x-oss-process=resize,h_1080'} />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{collections
						.filter(x => !x.featured)
						.map(c => (
							<Card.Medium key={c.name} to={cpath(c.name)} title={c.title} count={lengths[c.name]} bg={c.image + '?x-oss-process=resize,h_500'} />
						))}
				</div>
			</section>
		</div>
	);
}
