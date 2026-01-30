import type { ReactNode } from 'react';
import { Outlet } from 'react-router';
import Navbar from '~/components/Navbar';

export type NavLayoutProps = {
	children: ReactNode;
};

export default function NavLayout(props: NavLayoutProps) {
	return (
		<>
			<Navbar />
			<main className="pt-[68px]">
				<Outlet />
			</main>
		</>
	);
}
