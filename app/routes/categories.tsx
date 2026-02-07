import { ArrowRightIcon, BuildingIcon, CalendarIcon, CarIcon, TreePalmIcon } from 'lucide-react';
import type { Route } from './+types/categories';
import { data } from 'react-router';
import Card from '~/components/Card';
import type {
	Category,
	CategoryMeta,
	CityCategoryMeta,
	CollectionItem,
	SimpleCollectionItem
} from '~/data/types';
import { useIsVisible } from '~/hooks/useIsVisible';
import { useEffect, useMemo, useState } from 'react';
import './categories.css';
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

const sectionOrder = ['city', 'year'];

export default function Categories({ loaderData }: Route.ComponentProps) {
	const { categoryCityMeta, categoryYearMeta, categoryYear, categoryCity } = loaderData;

	const [citySectionRef, citySectionVisible] = useIsVisible<HTMLElement>();
	const [yearSectionRef, yearSectionVisible] = useIsVisible<HTMLElement>();

	const activeCategory = useMemo(() => {
		return sectionOrder[[citySectionVisible, yearSectionVisible].lastIndexOf(true)];
	}, [citySectionVisible, yearSectionVisible]);

	useEffect(() => {
		console.log(citySectionVisible, yearSectionVisible);
	}, [citySectionVisible, yearSectionVisible]);

	const [categoryModal, setCategoryModal] = useState(false);
	const [currentCategoryName, setCurrentCategoryName] = useState('');
	const [currentCategory, setCurrentCategory] = useState<SimpleCollectionItem[]>();

	return (
		<div className="max-w-[1200px] mx-5 xl:mx-auto my-16">
			<section className="mb-10 flex flex-col gap-3 align-center text-center">
				<h1 className="font-bold text-5xl">Categories</h1>
				<p className="text-neutral-500">按分类浏览照片</p>
			</section>
			<div className="sticky top-[75px] z-20 flex justify-center my-5">
				<div className="flex items-center gap-3 py-2 px-3 rounded-full transition-all shadow-md bg-neutral-900/50 backdrop-blur-sm">
					<button
						className={`category-button ${activeCategory === 'city' ? 'active' : ''}`}
						onClick={() => {
							window.scrollTo({
								top: document.getElementById('category-city-label')?.offsetTop,
								behavior: 'smooth'
							});
						}}
					>
						<BuildingIcon size={20} /> 城市
					</button>
					<button
						className={`category-button ${activeCategory === 'year' ? 'active' : ''}`}
						onClick={() =>
							window.scrollTo({
								top: document.getElementById('category-year-label')?.offsetTop,
								behavior: 'smooth'
							})
						}
					>
						<CalendarIcon size={20} /> 年份
					</button>
					{/* <button
						className={`category-button`}
					>
						<CarIcon size={20} /> 道路
					</button>
                    <button
						className={`category-button`}
					>
						<TreePalmIcon size={20} /> 景区
					</button> */}
				</div>
			</div>
			<Modal width="1200px" open={categoryModal} setOpen={setCategoryModal}>
				<h3 className="text-2xl">{currentCategoryName || '分类'}</h3>
				<div className="mt-5 grid grid-cols-3 gap-5 max-h-[70vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{currentCategory?.map(item => {
						console.log(item.url)
						return <Card.Medium
							key={item.name}
							bg={item.url + '?x-oss-process=image/resize,h_500'}
							to={getFrameUrlFromOssUrl(item.url)}
						/>
					})}
				</div>
			</Modal>
			<div className="flex flex-col gap-5">
				<section className="flex flex-col gap-5" ref={citySectionRef}>
					<h2 className="text-3xl" id="category-city-label">
						城市
					</h2>
					<div className="flex flex-col gap-5">
						{Object.entries(categoryCityMeta)
							.sort((a, b) => b[1].total - a[1].total)
							.map(([city, meta]) => {
								return (
									<div className="flex flex-col gap-2" key={city}>
										<h3 className="text-xl inline-flex items-center gap-3">
											{meta.total} 张 · {city}{' '}
											{meta.province !== city && (
												<small className="text-neutral-400">
													{meta.province}
												</small>
											)}
											<div className="flex-1" />
											{meta.total > 3 && (
												<a
													className="inpage-link leading-tight text-base"
													onClick={() => {
														setCurrentCategoryName(city);
														setCurrentCategory(categoryCity[city]);
														setCategoryModal(true);
													}}
												>
													查看所有
													<ArrowRightIcon size={20} />
												</a>
											)}
										</h3>
										<div className="grid grid-cols-3 gap-5">
											{categoryCity[city].slice(0, 3).map(cityImages => (
												<Card.Medium
													key={cityImages.name}
													bg={
														cityImages.url +
														'?x-oss-process=image/resize,h_500'
													}
													to={getFrameUrlFromOssUrl(cityImages.url)}
												/>
											))}
										</div>
									</div>
								);
							})}
					</div>
				</section>
				<hr className="my-10 text-neutral-700" />
				<section className="flex flex-col gap-5" ref={yearSectionRef}>
					<h2 className="text-3xl" id="category-year-label">
						年份
					</h2>
					<div className="flex flex-col gap-5">
						{Object.entries(categoryYearMeta)
							.sort((a, b) => b[1].total - a[1].total)
							.map(([year, meta]) => {
								return (
									<div className="flex flex-col gap-2" key={year}>
										<h3 className="text-xl inline-flex items-center gap-3">
											{meta.total} 张 · {year} <div className="flex-1" />
											{meta.total > 3 && (
												<a
													className="inpage-link leading-tight text-base"
													onClick={() => {
														setCurrentCategoryName(year + ' 年');
														setCurrentCategory(categoryYear[year]);
														setCategoryModal(true);
													}}
												>
													查看所有
													<ArrowRightIcon size={20} />
												</a>
											)}
										</h3>
										<div className="grid grid-cols-3 gap-5">
											{categoryYear[year].slice(0, 3).map(yearImages => (
												<Card.Medium
													key={yearImages.name}
													bg={
														yearImages.url +
														'?x-oss-process=image/resize,h_500'
													}
													to={getFrameUrlFromOssUrl(yearImages.url)}
												/>
											))}
										</div>
									</div>
								);
							})}
					</div>
				</section>
			</div>
		</div>
	);
}
