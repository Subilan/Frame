import { BookOpenTextIcon, InfoIcon, MenuIcon } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate, type Location } from 'react-router';
import Modal from './Modal';
import type { CollectionMeta } from '~/data/types';
import { CSSTransition } from 'react-transition-group';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';

export type NavbarProps = {
	allCollections: Record<string, CollectionMeta>;
};

const navItems = [
	{
		to: '/',
		text: '首页'
	},
	{
		to: '/categories',
		text: '分类'
	}
	// {
	// 	to: '/highlights',
	// 	text: '精选集'
	// }
];

export default function Navbar({ allCollections }: NavbarProps) {
	const navigate = useNavigate();
	const location = useLocation();

	const [aboutModalOpen, setAboutModalOpen] = useState(false);
	const [collectionStoryModalOpen, setCollectionStoryModalOpen] = useState(false);
	const isIndexPage = useMemo(() => location.pathname === '/', [location]);

	const collectionName = useMemo(() => {
		const result = /^\/collection\/([A-Za-z0-9_\-\/]+)\/?$/.exec(location.pathname);

		if (result === null) return null;
		return result[1];
	}, [location]);

	const currentCollection = useMemo(() => {
		if (!collectionName) return undefined;
		return allCollections[collectionName];
	}, [collectionName]);

	// const [searchModalOpen, setSearchModalOpen] = useState(false);

	const [collapseOpen, setCollapseOpen] = useState(false);
	const collapseRef = useRef<HTMLDivElement>(null);
	const menuIconRef = useRef<SVGSVGElement>(null);
	useOutsideAlerter(collapseRef, () => setCollapseOpen(false), [menuIconRef]);
	
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
						{/* <SearchIcon onClick={() => setSearchModalOpen(true)} className="cursor-pointer" size={'20'} /> */}
						{isIndexPage && (
							<>
								<InfoIcon
									onClick={() => setAboutModalOpen(true)}
									className="cursor-pointer"
									size={'20'}
								/>
							</>
						)}
						{currentCollection?.story && (
							<>
								<BookOpenTextIcon
									className="cursor-pointer"
									size={'20'}
									onClick={() => setCollectionStoryModalOpen(true)}
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
			{/* <SearchModal open={searchModalOpen} setOpen={setSearchModalOpen}/> */}

			{currentCollection?.story && (
				<Modal
					width="500px"
					open={collectionStoryModalOpen}
					setOpen={setCollectionStoryModalOpen}
				>
					<div className="flex flex-col gap-3">
						<h3 className="text-3xl font-bold">
							<span className="text-neutral-400 mr-2">相册故事</span>
							{currentCollection.title}
						</h3>
						<div
							className="[&_p]:my-2"
							dangerouslySetInnerHTML={{ __html: currentCollection.story }}
						></div>
					</div>
				</Modal>
			)}

			<Modal open={aboutModalOpen} setOpen={setAboutModalOpen}>
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-2 pb-5">
						<h3 className="text-4xl">the frame</h3>
						<span className="text-neutral-400">version 202512</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-neutral-400">最近更新时间</span>
						<span>2025-12-04</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-neutral-400">GitHub 地址</span>
						<span>
							<a href="https://github.com/Subilan/Frame" className="underline">
								https://github.com/Subilan/Frame
							</a>
						</span>
					</div>
					<div className="flex flex-col gap-1">
						<span className="text-neutral-400">逆地理位置编码数据</span>
						<span>高德地图，最近同步于 2025-12-04</span>
					</div>
				</div>
			</Modal>
		</>
	);
}
