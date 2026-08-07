import type { Route } from './+types/NavLayout';
import type { ReactNode } from 'react';
import { data, Outlet } from 'react-router';
import Navbar from '~/components/Navbar';
import { DataPath } from '~/consts';
import type { CollectionMeta } from '~/data/types';

export type NavLayoutProps = {
	children: ReactNode;
};

export async function clientLoader() {
	const allCollections = await fetch(DataPath + '/collections/__all.json');

	if (allCollections.status !== 200) throw data(allCollections.statusText, allCollections.status);

	return {
		allCollections: (await allCollections.json()) as Record<string, CollectionMeta>
	};
}

export type NavLayoutOutletContext = {
	navLoaderData: Route.ComponentProps['loaderData'];
};

export default function NavLayout(props: NavLayoutProps & Route.ComponentProps) {
	return (
		<>
			<Navbar />
			<main className="pt-[68px]">
				<Outlet
					context={{ navLoaderData: props.loaderData } satisfies NavLayoutOutletContext}
				/>
			</main>
		</>
	);
}
