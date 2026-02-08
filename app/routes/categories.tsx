import { BuildingIcon, CalendarIcon, type LucideIcon } from 'lucide-react';
import type { Route } from './+types/categories';
import { data } from 'react-router';
import Card from '~/components/Card';
import type { Category, CategoryMeta, CityCategoryMeta, SimpleCollectionItem } from '~/data/types';
import { useIsVisible } from '~/hooks/useIsVisible';
import { useMemo, useState, type ReactNode, type Ref } from 'react';
import { getJson } from '~/utils/getJson';
import getFrameUrlFromOssUrl from '~/utils/getFrameUrlFromOssUrl';
import Modal from '~/components/Modal';

export async function clientLoader() {
	let categoryCityMeta: CategoryMeta<CityCategoryMeta>,
		categoryYearMeta: CategoryMeta,
		categoryCity: Category,
		categoryYear: Category;

	const res = await getJson([
		'/categories/city-meta.json',
		'/categories/year-meta.json',
		'/categories/city.json',
		'/categories/year.json'
	]);

	if (!res) {
		throw data(null, { status: 404 });
	}

	[categoryCityMeta, categoryYearMeta, categoryCity, categoryYear] = res;

	return {
		categoryCityMeta,
		categoryYearMeta,
		categoryCity,
		categoryYear
	};
}

type CategorySectionProp = {
	sectionRef: Ref<HTMLElement | null>;
	meta: CategoryMeta;
	title: string;
	identifier: string;
	itemTitle?: (name: string, meta: Record<string, any>) => ReactNode;
	itemSubtitle?: (name: string, meta: Record<string, any>) => ReactNode;
	category: Category;
	categoryModal: {
		setItems: React.Dispatch<React.SetStateAction<SimpleCollectionItem[] | undefined>>;
		setName: React.Dispatch<React.SetStateAction<string>>;
		setModal: React.Dispatch<React.SetStateAction<boolean>>;
	};
};

function CategorySection(props: CategorySectionProp) {
	return (
		<section className="flex flex-col gap-5" ref={props.sectionRef}>
			<h2 className="text-3xl" id={props.identifier}>
				{props.title}
			</h2>
			<div className="flex flex-col gap-5">
				{Object.entries(props.meta)
					.sort((a, b) => b[1].total - a[1].total)
					.map(([categoryName, categoryMeta]) => {
						return (
							<div className="flex flex-col gap-2" key={categoryName}>
								<h3 className="text-xl inline-flex items-baseline gap-3">
									<div className="inline-flex md:items-baseline md:gap-2 flex-col md:flex-row ">
										{props.itemTitle ? (
											props.itemTitle(categoryName, categoryMeta)
										) : (
											<>
												{categoryMeta.total} 张 · {categoryName}{' '}
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
												props.categoryModal.setName(categoryName);
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
									{props.category[categoryName].slice(0, 3).map(images => (
										<Card.Medium
											key={images.name}
											bg={images.url + '?x-oss-process=image/resize,h_500'}
											to={getFrameUrlFromOssUrl(images.url)}
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

function useCategoryModal() {
	const [modal, setModal] = useState(false);
	const [name, setName] = useState('');
	const [items, setItems] = useState<SimpleCollectionItem[]>();

	return { modal, setModal, name, setName, items, setItems };
}

type CategoryNavigationProps = {
	sections: { id: string; name: string; icon: LucideIcon }[];
	visibilities: boolean[];
};

const categorySections: CategoryNavigationProps['sections'] = [
	{
		id: 'city',
		name: '城市',
		icon: BuildingIcon
	},
	{
		id: 'year',
		name: '年份',
		icon: CalendarIcon
	}
];

function CategoryNavigation({ sections, visibilities }: CategoryNavigationProps) {
	const activeCategory = useMemo(() => {
		return sections[visibilities.lastIndexOf(true)]?.id;
	}, [visibilities]);

	return (
		<div className="sticky top-[75px] z-20 flex justify-center my-5">
			<div className="flex items-center gap-3 py-2 px-3 rounded-full transition-all shadow-md bg-neutral-900/50 backdrop-blur-sm">
				{sections.map(section => {
					const Icon = section.icon;
					return (
						<button
							key={section.id}
							className={`primary-button ${activeCategory === section.id ? 'active' : ''}`}
							onClick={() => {
								window.scrollTo({
									top: document.getElementById(section.id)?.offsetTop,
									behavior: 'smooth'
								});
							}}
						>
							<Icon size={20} /> {section.name}
						</button>
					);
				})}
			</div>
		</div>
	);
}

export default function Categories({ loaderData }: Route.ComponentProps) {
	const { categoryCityMeta, categoryYearMeta, categoryYear, categoryCity } = loaderData;

	const [citySectionRef, citySectionVisible] = useIsVisible<HTMLElement>();
	const [yearSectionRef, yearSectionVisible] = useIsVisible<HTMLElement>();

	const categoryModal = useCategoryModal();

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Categories</h1>
				<p className="text-neutral-500">按分类浏览照片</p>
			</section>
			<CategoryNavigation
				sections={categorySections}
				visibilities={[citySectionVisible, yearSectionVisible]}
			/>
			<div className="flex flex-col gap-5">
				<CategorySection
					sectionRef={citySectionRef}
					identifier="city"
					title="城市"
					meta={categoryCityMeta}
					category={categoryCity}
					itemSubtitle={(id, meta) => meta.province !== id && meta.province}
					categoryModal={categoryModal}
				/>
				<hr className="my-10 text-neutral-700" />
				<CategorySection
					sectionRef={yearSectionRef}
					identifier="year"
					title="年份"
					meta={categoryYearMeta}
					category={categoryYear}
					categoryModal={categoryModal}
				/>
			</div>

			<Modal width="1200px" open={categoryModal.modal} setOpen={categoryModal.setModal}>
				<h3 className="text-2xl">{categoryModal.name || '分类'}</h3>
				<div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{categoryModal.items?.map(item => (
						<Card.Medium
							key={item.name}
							bg={item.url + '?x-oss-process=image/resize,h_500'}
							to={getFrameUrlFromOssUrl(item.url)}
						/>
					))}
				</div>
			</Modal>
		</div>
	);
}
