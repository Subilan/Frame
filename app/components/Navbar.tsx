import { BookOpenTextIcon, InfoIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import Modal from './Modal';
import type { CollectionMeta } from '~/data/types';

export type NavbarProps = {
	allCollections: Record<string, CollectionMeta>;
};

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

	return (
		<>
			<nav className="p-5 h-[68px] fixed top-0 w-full flex items-center gap-3 bg-neutral-900/90 backdrop-blur-xs z-20">
				<div
					className="text-lg font-bold select-none cursor-pointer"
					onClick={() => navigate('/')}
				>
					the frame
				</div>
				<div className="h-[75%] w-px bg-neutral-500 mx-3" />
				<div className="gap-5 flex items-center text-neutral-400 **:hover:text-neutral-300 **:active:text-neutral-200 [&_.active]:text-white">
					<NavLink to={'/'}>首页</NavLink>
					<NavLink to={'/categories'}>分类</NavLink>
					<NavLink to={'/featured'}>精选集</NavLink>
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
