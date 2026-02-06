import Card from '~/components/Card';
import type { Route } from './+types/index';
import { useMemo } from 'react';
import { useOutletContext } from 'react-router';
import type { NavLayoutOutletContext } from '~/layouts/NavLayout';

export function meta({}: Route.MetaArgs) {
	return [
		{ title: '相框' },
		{ name: 'description', content: 'Subilan 的个人相册 - https://subilan.win' }
	];
}

function cpath(name: string) {
	return `/collection/${name}`;
}

export default function Index({}: Route.ComponentProps) {
	const {
		navLoaderData: { allCollections }
	} = useOutletContext<NavLayoutOutletContext>();
	
	const featuredCollection = useMemo(
		() => Object.values(allCollections).find(x => x.featured === true),
		[allCollections]
	);

	const nonFeaturedTopCollections = useMemo(
		() => Object.values(allCollections).filter(x => !x.featured && x.level === 0),
		[allCollections]
	);

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Photos</h1>
				<p className="text-neutral-500">所有公开照片</p>
			</section>
			<section className="flex flex-col gap-10">
				{featuredCollection && (
					<Card.Large
						to={cpath(featuredCollection.name)}
						title={featuredCollection.title}
						featured
						count={featuredCollection.size}
						bg={featuredCollection.image + '?x-oss-process=image/resize,h_1080'}
					/>
				)}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{nonFeaturedTopCollections.map(c => (
						<Card.Medium
							key={c.name}
							to={cpath(c.name)}
							title={c.title}
							count={c.size}
							bg={c.image + '?x-oss-process=image/resize,h_500'}
						/>
					))}
				</div>
			</section>
		</div>
	);
}
