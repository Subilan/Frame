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

	const wheelListener = useCallback(
		(e: WheelEvent) => {
			if (e.deltaY < 0) {
				swiper?.slidePrev();
			} else {
				swiper?.slideNext();
			}
		},
		[swiper]
	);

	useEffect(() => {
		window.addEventListener('keydown', keyboardListener);
		window.addEventListener('wheel', wheelListener);

		return () => {
			window.removeEventListener('keydown', keyboardListener);
			window.removeEventListener('wheel', wheelListener);
		};
	}, [keyboardListener, wheelListener]);

	useEffect(() => {
		highlights.map((x, i) => {
			if (x.excerpt) {
				setCollapsed(clp => ({ ...clp, [i]: true }));
			}
		});
	}, [highlights]);

	return (
		<div className="w-full">
			<Swiper
				className="h-full bg-linear-0 from-0% from-black/50 to-transparent to-30%"
				modules={[EffectFade]}
				slidesPerView={1}
				effect="fade"
				loop
				onSlideChange={swiper => setCurrentHl(highlights[swiper.activeIndex])}
				onSwiper={swiper => setSwiper(swiper)}
			>
				{highlights.map(
					(hl, i) =>
						hl.imagePath && (
							<SwiperSlide
								key={hl.filename}
								className="bg-center bg-cover bg-no-repeat bg-neutral-800"
								style={{
									height: 'calc(100dvh - 68px)',
									backgroundImage: `url(${getOssUrlFromSimpleRepr(hl.imagePath + '?x-oss-process=image/resize,h_1080')})`
								}}
							>
								<div className="flex items-end h-full p-10">
									<div className="flex text-shadow-lg flex-col gap-3">
										<h2 className="text-4xl">{hl.title}</h2>
										<div
											className="[&_h1]:hidden [&_p]:my-2 max-w-[700px] text-lg"
											dangerouslySetInnerHTML={{
												__html:
													collapsed[i] && hl.excerpt
														? hl.excerpt
														: hl.content
											}}
										></div>
										{hl.excerpt && (
											<a
												onClick={() =>
													setCollapsed(clp => ({ ...clp, [i]: !clp[i] }))
												}
												className="inpage-link"
											>
												{collapsed[i] ? '展开' : '收起'}
											</a>
										)}
									</div>
								</div>
							</SwiperSlide>
						)
				)}
			</Swiper>
			<NavLink
				to={getFrameUrlFromSimpleRepr(currentHl.imagePath)}
				className="absolute shadow-lg right-10 bottom-10 z-10 text-xl rounded-full bg-sky-200 hover:scale-105 active:scale-95 transition-all text-sky-900 py-3 px-5 "
			>
				在相册中查看 <ArrowUpRightIcon className="inline-block" />
			</NavLink>
			<button onClick={() => swiper?.slidePrev()} className="swiper-nav-button left-10">
				<ArrowLeftIcon />
			</button>
			<button onClick={() => swiper?.slideNext()} className="swiper-nav-button right-10">
				<ArrowRightIcon />
			</button>
		</div>
	);
}
