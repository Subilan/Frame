import { Swiper, type SwiperClass, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { getJson } from '~/utils/getJson';
import { data, NavLink } from 'react-router';
import type { Route } from './+types/highlights';
import type { HighlightItem } from '~/data/build_highlights';
import getOssUrlFromSimpleRepr from '~/utils/getOssUrlFromSimpleRepr';
import { useCallback, useEffect, useState } from 'react';
import getFrameUrlFromSimpleRepr from '~/utils/getFrameUrlFromSimpleRepr';
import { ArrowLeftIcon, ArrowRight, ArrowRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { EffectFade } from 'swiper/modules';
import './highlights.css';
import formatDate from '~/utils/formatDate';

type HighlightItemWithImagePath = Required<Pick<HighlightItem, 'imagePath'>> & HighlightItem;

export async function clientLoader() {
	const result = await getJson(['/highlights.json']);

	if (!result) throw data(null, { status: 500 });

	return {
		highlights: (result[0] as HighlightItem[]).filter(
			x => x.imagePath
		) as HighlightItemWithImagePath[]
	};
}

export default function Highlights({ loaderData }: Route.ComponentProps) {
	const { highlights } = loaderData;

	const [currentHl, setCurrentHl] = useState<HighlightItemWithImagePath>(highlights[0]);
	const [currentHlIndex, setCurrentHlIndex] = useState(0);
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
	const [swiper, setSwiper] = useState<SwiperClass>();

	const keyboardListener = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'l') {
				swiper?.slidePrev();
			} else if (e.key === 'ArrowRight' || e.key === 'a' || e.key === 'h') {
				swiper?.slideNext();
			}
		},
		[swiper]
	);

	useEffect(() => {
		window.addEventListener('keydown', keyboardListener);

		return () => {
			window.removeEventListener('keydown', keyboardListener);
		};
	}, [keyboardListener]);

	useEffect(() => {
		highlights.map((x, i) => {
			if (x.excerpt) {
				setCollapsed(clp => ({ ...clp, [i]: true }));
			}
		});
	}, [highlights]);

	return (
		<div className="max-w-[1200px] mx-auto">
			<div className="h-[70dvh] relative">
				<Swiper
					className="h-full"
					modules={[EffectFade]}
					slidesPerView={1}
					effect="fade"
					loop
					onSlideChange={swiper => {
						setCurrentHlIndex(swiper.realIndex);
						setCollapsed(clp => ({ ...clp, [swiper.realIndex]: true }));
						setCurrentHl(highlights[swiper.realIndex]);
					}}
					onSwiper={swiper => setSwiper(swiper)}
				>
					{highlights.map(
						(hl, i) =>
							hl.imagePath && (
								<SwiperSlide key={hl.filename} className="bg-neutral-900">
									<img
										className="h-full block mx-auto object-contain shadow-2xl"
										src={getOssUrlFromSimpleRepr(
											hl.imagePath + '?x-oss-process=image/resize,h_1080'
										)}
									/>
								</SwiperSlide>
							)
					)}
				</Swiper>
				<button onClick={() => swiper?.slidePrev()} className="swiper-nav-button -left-20">
					<ArrowLeftIcon />
				</button>
				<button onClick={() => swiper?.slideNext()} className="swiper-nav-button -right-20">
					<ArrowRightIcon />
				</button>
			</div>

			<div className="flex flex-col items-center gap-3 my-5">
				<h2 className="text-2xl">{currentHl.title}</h2>
				{currentHl.imageInfo && (
					<h3 className="text-xl text-neutral-500">{formatDate(new Date(currentHl.imageInfo.date ?? 0), 'ymd')}</h3>
				)}
				<div
					className="[&_h1]:hidden [&_p]:my-2 text-center max-w-[700px] text-lg"
					dangerouslySetInnerHTML={{
						__html:
							collapsed[currentHlIndex] && currentHl.excerpt
								? currentHl.excerpt
								: currentHl.content
					}}
				></div>
				<div className="flex items-center gap-3">
					{currentHl.excerpt && (
						<a
							onClick={() =>
								setCollapsed(clp => ({
									...clp,
									[currentHlIndex]: !clp[currentHlIndex]
								}))
							}
							className="inpage-link"
						>
							{collapsed[currentHlIndex] ? '展开' : '收起'}描述
						</a>
					)}
					<NavLink
						to={getFrameUrlFromSimpleRepr(currentHl.imagePath)}
						className="inpage-link"
					>
						在相册中查看
					</NavLink>
				</div>
			</div>
		</div>
	);
}
