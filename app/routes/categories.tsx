import { BuildingIcon, CalendarIcon, MountainIcon, type LucideIcon } from 'lucide-react';
import type { Route } from './+types/categories';
import { data } from 'react-router';
import Card from '~/components/Card';
import type {
	Category,
	CategoryMeta,
	CityCategoryMeta,
	SpotCategoryMeta
} from '~/data/types';
import { useRef, useState, type ReactNode } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { getJson } from '~/utils/getJson';
import getFrameUrlFromName from '~/utils/getFrameUrlFromName';
import getOssUrlFromName from '~/utils/getOssUrlFromName';
import Modal from '~/components/Modal';
import Button from '~/components/Button';

export async function clientLoader() {
	let categoryCityMeta: CategoryMeta<CityCategoryMeta>,
		categoryTimeMeta: CategoryMeta,
		categorySpotMeta: CategoryMeta<SpotCategoryMeta>,
		categoryCity: Category,
		categoryTime: Category,
		categorySpot: Category;

	const res = await getJson([
		'/categories/city-meta.json',
		'/categories/time-meta.json',
		'/categories/spot-meta.json',
		'/categories/city.json',
		'/categories/time.json',
		'/categories/spot.json'
	]);

	if (!res) {
		throw data(null, { status: 404 });
	}

	[
		categoryCityMeta,
		categoryTimeMeta,
		categorySpotMeta,
		categoryCity,
		categoryTime,
		categorySpot
	] = res;

	return {
		categoryCityMeta,
		categoryTimeMeta,
		categorySpotMeta,
		categoryCity,
		categoryTime,
		categorySpot
	};
}

type CategorySectionProp = {
	meta: CategoryMeta;
	title: string;
	sort?: (a: [string, { total: number }], b: [string, { total: number }]) => number;
	itemTitle?: (name: string, meta: Record<string, any>) => ReactNode;
	itemName?: (name: string, meta: Record<string, any>) => string;
	itemSubtitle?: (name: string, meta: Record<string, any>) => ReactNode;
	category: Category;
	categoryModal: {
		setItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
		setName: React.Dispatch<React.SetStateAction<string>>;
		setModal: React.Dispatch<React.SetStateAction<boolean>>;
	};
};

function CategorySection(props: CategorySectionProp) {
	const displayName = (name: string, meta: Record<string, any>) =>
		props.itemName ? props.itemName(name, meta) : name;

	return (
		<section className="flex flex-col gap-5">
			<h2 className="text-3xl">{props.title}</h2>
			<div className="flex flex-col gap-5">
				{Object.entries(props.meta)
					.sort(props.sort ?? ((a, b) => b[1].total - a[1].total))
					.map(([categoryName, categoryMeta]) => {
						return (
							<div className="flex flex-col gap-3" key={categoryName}>
								<h3 className="text-xl inline-flex items-baseline gap-3">
									<div className="inline-flex md:items-baseline md:gap-2 flex-col md:flex-row ">
										{props.itemTitle ? (
											props.itemTitle(categoryName, categoryMeta)
										) : (
											<>
												{categoryMeta.total} 张 ·{' '}
												{displayName(categoryName, categoryMeta)}{' '}
											</>
										)}
										{props.itemSubtitle && (
											<small className="text-neutral-400">
												{props.itemSubtitle(categoryName, categoryMeta)}
											</small>
										)}
									</div>
									<div className="flex-1" />
									{categoryMeta.total > 3 && (
										<a
											className="inpage-link leading-tight text-base"
											onClick={() => {
												props.categoryModal.setName(
													displayName(categoryName, categoryMeta)
												);
												props.categoryModal.setItems(
													props.category[categoryName]
												);
												props.categoryModal.setModal(true);
											}}
										>
											查看所有
										</a>
									)}
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
									{props.category[categoryName].slice(0, 3).map(name => (
										<Card.Medium
											key={name}
											bg={getOssUrlFromName(name) + '?x-oss-process=image/resize,h_500'}
											to={getFrameUrlFromName(name)}
										/>
									))}
								</div>
							</div>
						);
					})}
			</div>
		</section>
	);
}

function timeKeyValue(name: string) {
	const match = /^(\d+) 年 (\d+) 月$/.exec(name);
	return match ? +match[1] * 12 + +match[2] : 0;
}

function useCategoryModal() {
	const [modal, setModal] = useState(false);
	const [name, setName] = useState('');
	const [items, setItems] = useState<string[]>();

	return { modal, setModal, name, setName, items, setItems };
}

type CategoryTabsProps = {
	sections: { id: string; name: string; icon: LucideIcon }[];
	active: string;
	onChange: (id: string) => void;
};

const categorySections: CategoryTabsProps['sections'] = [
	{
		id: 'city',
		name: '城市',
		icon: BuildingIcon
	},
	{
		id: 'time',
		name: '时间',
		icon: CalendarIcon
	},
	{
		id: 'spot',
		name: '景点',
		icon: MountainIcon
	}
];

function CategoryTabs({ sections, active, onChange }: CategoryTabsProps) {
	return (
		<div className="sticky top-[75px] z-20 flex justify-center my-5">
			<div className="flex items-center gap-3 py-2 px-3 rounded-full transition-all shadow-md bg-neutral-900/50 backdrop-blur-sm">
				{sections.map(section => {
					const Icon = section.icon;
					return (
						<Button
							key={section.id}
							className={active === section.id ? 'active' : ''}
							onClick={() => onChange(section.id)}
						>
							<Icon size={20} /> {section.name}
						</Button>
					);
				})}
			</div>
		</div>
	);
}

export default function Categories({ loaderData }: Route.ComponentProps) {
	const {
		categoryCityMeta,
		categorySpotMeta,
		categoryTimeMeta,
		categoryTime,
		categoryCity,
		categorySpot
	} = loaderData;

	const [activeCategory, setActiveCategory] = useState(categorySections[0].id);
	const sectionRef = useRef<HTMLDivElement>(null);

	const categoryModal = useCategoryModal();

	function changeCategory(id: string) {
		if (id === activeCategory) return;

		setActiveCategory(id);
		sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function renderActiveCategory() {
		switch (activeCategory) {
			case 'spot':
				return (
					<CategorySection
						title="景点"
						meta={categorySpotMeta}
						category={categorySpot}
						itemName={(id, meta) => meta.name ?? id}
						itemSubtitle={(id, meta) => {
							if (
								!meta.city ||
								!meta.province ||
								meta.city === meta.province
							) {
								return meta.city ?? meta.province;
							}
							return `${meta.province}${meta.city}`;
						}}
						categoryModal={categoryModal}
					/>
				);
			case 'time':
				return (
					<CategorySection
						title="时间"
						meta={categoryTimeMeta}
						category={categoryTime}
						sort={(a, b) => timeKeyValue(b[0]) - timeKeyValue(a[0])}
						categoryModal={categoryModal}
					/>
				);
			default:
				return (
					<CategorySection
						title="城市"
						meta={categoryCityMeta}
						category={categoryCity}
						itemSubtitle={(id, meta) => meta.province !== id && meta.province}
						categoryModal={categoryModal}
					/>
				);
		}
	}

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Categories</h1>
				<p className="text-neutral-500">按分类浏览照片</p>
			</section>
			<CategoryTabs
				sections={categorySections}
				active={activeCategory}
				onChange={changeCategory}
			/>
			<SwitchTransition mode="out-in">
				<CSSTransition
					key={activeCategory}
					nodeRef={sectionRef}
					timeout={200}
					classNames="fade"
					unmountOnExit
				>
					<div ref={sectionRef} className="scroll-mt-[140px]">
						{renderActiveCategory()}
					</div>
				</CSSTransition>
			</SwitchTransition>

			<Modal width="1200px" open={categoryModal.modal} setOpen={categoryModal.setModal}>
				<h3 className="text-2xl">{categoryModal.name || '分类'}</h3>
				<div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{categoryModal.items?.map(name => (
						<Card.Medium
							key={name}
							bg={getOssUrlFromName(name) + '?x-oss-process=image/resize,h_500'}
							to={getFrameUrlFromName(name)}
						/>
					))}
				</div>
			</Modal>
		</div>
	);
}
