import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useNavigation,
	type LinksFunction
} from 'react-router';

import './app.css';
import './nprogress.css';
import FooterEl from './components/FooterEl';
import Navbar from './components/Navbar';
import { ButtonLink } from './components/Button';
import { useEffect } from 'react';
import NProgress from 'nprogress';

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous'
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
	},
	{
		rel: 'icon',
		href: '/favicon.png'
	}
];

export function Layout({ children }: { children: React.ReactNode }) {
	const location = useLocation();
	const navigation = useNavigation();

	useEffect(() => {
		if (navigation.state === 'loading') {
			NProgress.start();
		} else {
			NProgress.done();
		}
	}, [navigation.state]);

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
				<FooterEl />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: any) {
	const status = isRouteErrorResponse(error) ? error.status : 500;

	return (
		<>
			<Navbar />
			<main className="flex min-h-[90vh] flex-col items-center justify-center gap-8 px-5 pt-[68px]">
				<h1 className="text-[110px] leading-none font-bold tracking-tighter select-none md:text-[170px]">
					{status}
				</h1>
				<ButtonLink to="/">返回首页</ButtonLink>
			</main>
		</>
	);
}
