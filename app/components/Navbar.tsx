import { InfoIcon, MenuIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import Modal from './Modal';
import { CSSTransition } from 'react-transition-group';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { getJson } from '~/utils/getJson';
import type { SiteStats } from '~/data/types';

const navItems = [
	{
		to: '/',
		text: '首页'
	},
	{
		to: '/categories',
		text: '分类'
	},
	{
		to: '/records',
		text: '记录'
	}
];

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();

	const [aboutModalOpen, setAboutModalOpen] = useState(false);
	const isIndexPage = useMemo(() => location.pathname === '/', [location]);

	const collectionName = useMemo(() => {
		const result = /^\/collection\/([A-Za-z0-9_\-\/]+)\/?$/.exec(location.pathname);

		if (result === null) return null;
		return result[1];
	}, [location]);

	const [collapseOpen, setCollapseOpen] = useState(false);
	const collapseRef = useRef<HTMLDivElement>(null);
	const menuIconRef = useRef<SVGSVGElement>(null);
	useOutsideAlerter(collapseRef, () => setCollapseOpen(false), [menuIconRef]);

	const [stats, setStats] = useState<SiteStats>();

	// 只在需要看的时候拉取，纯静态数据，失败就不展示
	useEffect(() => {
		if (!aboutModalOpen || stats) return;

		getJson(['/stats.json']).then(result => {
			if (result?.[0]) setStats(result[0] as SiteStats);
		});
	}, [aboutModalOpen, stats]);

	const statsItems = [
		{ label: '张照片', value: stats?.photoTotal },
		{ label: '个合集', value: stats?.collectionTotal }
	];
	
	return (
		<>
			<div
				className={
					'fixed top-0 w-full z-30 bg-neutral-900/90 transition-all' +
					' ' +
					(collapseOpen ? 'bg-neutral-900!' : '')
				}
			>
				<nav className="flex h-[68px] items-center gap-3 p-4 md:p-5">
					<MenuIcon
						ref={menuIconRef}
						className="md:hidden"
						size={20}
						onClick={() => setCollapseOpen(!collapseOpen)}
					/>
					<div
						className="text-xl md:text-lg font-bold select-none cursor-pointer"
						onClick={() => navigate('/')}
					>
						the frame
					</div>
					<div className="h-5 hidden md:block w-px bg-neutral-500 mx-3" />
					<div className="hidden md:flex gap-5 items-center text-neutral-400 **:hover:text-neutral-300 **:active:text-neutral-200 [&_.active]:text-white">
						{navItems.map(navItem => (
							<NavLink key={navItem.to} to={navItem.to}>
								{navItem.text}
							</NavLink>
						))}
						{collectionName && <NavLink to={location.pathname}>合集</NavLink>}
					</div>
					<div className="flex-1" />
					<div className="flex gap-5">
						{isIndexPage && (
							<>
								<InfoIcon
									onClick={() => setAboutModalOpen(true)}
									className="cursor-pointer"
									size={'20'}
								/>
							</>
						)}
					</div>
				</nav>
			</div>

			<CSSTransition
				unmountOnExit
				in={collapseOpen}
				nodeRef={collapseRef}
				timeout={200}
				classNames={'fade-down'}
			>
				<div
					ref={collapseRef}
					className={
						'fixed top-[68px] shadow-lg bg-neutral-900/90 w-full z-50 flex flex-col pb-2 md:hidden text-xl text-neutral-500 [&_.active]:text-white' +
						' ' +
						(collapseOpen ? 'bg-neutral-900!' : '')
					}
					onClick={() => setCollapseOpen(false)}
				>
					{navItems.map(navItem => (
						<NavLink className={'py-2 px-4'} key={navItem.to} to={navItem.to}>
							{navItem.text}
						</NavLink>
					))}
					{collectionName && (
						<NavLink className={'py-2 px-4'} to={location.pathname}>
							合集
						</NavLink>
					)}
				</div>
			</CSSTransition>

			<Modal open={aboutModalOpen} setOpen={setAboutModalOpen}>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 pb-5">
						<h3 className="text-4xl">the frame</h3>
						<span className="text-neutral-400">version 202609</span>
					</div>
					<div className="grid grid-cols-2 gap-3 pb-2">
						{statsItems.map(item => (
							<div key={item.label} className="flex flex-col">
								<span className="text-2xl">
									{item.value ?? '—'}
								</span>
								<span className="text-neutral-400">
									{item.label}
								</span>
							</div>
						))}
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-neutral-400">GitHub</span>
						<span>
							<a href="https://github.com/Subilan/Frame" className="underline">
								https://github.com/Subilan/Frame
							</a>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-neutral-400">逆地理位置编码数据</span>
						<span>
							{stats?.regeoUpdatedAt
								? `高德地图 ${stats.regeoUpdatedAt}`
								: '高德地图'}
						</span>
					</div>
				</div>
			</Modal>
		</>
	);
}
