import { useEffect, useMemo, useRef, useState } from 'react';
import { data, useLocation, useNavigate } from 'react-router';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/photoswipe.css';
// @ts-ignore
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';
import Card from '~/components/Card';
import InfoIcon from 'lucide-static/icons/info.svg?raw';
import Modal from '~/components/Modal';
import './collection.css';
import type { Route } from './+types/collection';
import type { CollectionMeta, PhotoRecord } from '~/data/types';
import { DataPath, SlashSubstitute } from '~/consts';
import { ArrowDownIcon, ArrowLeftIcon, ArrowUpIcon, CalendarIcon, MapPinIcon, MountainIcon } from 'lucide-react';
import Dropdown from '~/components/Dropdown';
import formatDate from '~/utils/formatDate';
import getOssUrlFromName from '~/utils/getOssUrlFromName';

const exifDisplay: {
	cond?: (photo: PhotoRecord) => boolean;
	name: string;
	value: (photo: PhotoRecord) => string;
}[] = [
	{
		name: '文件大小',
		cond(photo) {
			return photo.size !== undefined;
		},
		value(photo) {
			return `${(photo.size! / 1024 / 1024).toFixed(1)} MB`;
		}
	},
	{
		name: '尺寸',
		value(photo) {
			const w = photo.width;
			const h = photo.height;
			if (!w || !h) return 'Unknown';

			return photo.orientation === 6 || photo.orientation === 8
				? `${h}px×${w}px`
				: `${w}px×${h}px`;
		}
	},
	{
		name: '拍摄设备',
		value(photo) {
			return photo.model ?? 'Unknown';
		}
	},
	{
		name: '拍摄时间',
		value(photo) {
			if (!photo.date) return 'Unknown';

			return photo.date.replace(
				/^(\d+):(\d+):(\d+) ([\d:]+)$/,
				'$1-$2-$3 $4 UTC+8'
			);
		}
	},
	{
		name: 'GPS',
		cond(photo) {
			return photo.lng !== undefined && photo.lat !== undefined;
		},
		value(photo) {
			return `${photo.lng!.replace('deg', '°')} ${photo.lngRef?.[0] ?? 'E'}<br/>${photo.lat!.replace('deg', '°')} ${photo.latRef?.[0] ?? 'N'}`;
		}
	},
	{
		name: 'GPS 地址',
		cond(photo) {
			return (
				photo.lng !== undefined &&
				photo.lat !== undefined &&
				photo.addr !== undefined &&
				photo.addr !== '中华人民共和国'
			);
		},
		value(photo) {
			return photo.addr!;
		}
	},
	{
		name: '海拔高度',
		cond(photo) {
			return photo.altitude !== undefined;
		},
		value(photo) {
			return `${photo.altitude!.toFixed(1)}m`;
		}
	}
];

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
	const collectionName = params['*'] as string | undefined;

	if (!collectionName) throw data('Not Found', { status: 404 });

	const collectionNameNormalized = collectionName.replace(/\//g, SlashSubstitute);

	let meta, filetree;
	let metaData: CollectionMeta;

	try {
		meta = await fetch(DataPath + `/collections/${collectionNameNormalized}.json`);
		if (meta.status !== 200) throw data(null, { status: meta.status });

		metaData = (await meta.json()) as CollectionMeta;

		// 如果这是一个叶子目录，就获取其filetree信息，否则不获取。
		if (!metaData.parent) {
			filetree = await fetch(DataPath + `/filetrees/${collectionNameNormalized}.json`);
			if (filetree.status !== 200) throw data(null, { status: filetree.status });
		} else {
			filetree = null;
		}
	} catch (e) {
		throw data(null, { status: 404 });
	}

	return {
		meta: metaData,
		filetree: filetree && ((await filetree.json()) as PhotoRecord[])
	};
}

export default function Collection({ loaderData }: Route.ComponentProps) {
	const { meta, filetree } = loaderData;

	const location = useLocation();
	const imageName = useMemo(() => location.hash.substring(1), [location]);

	const [lightbox, setLightbox] = useState<PhotoSwipeLightbox>();

	useEffect(() => {
		if (lightbox && imageName && filetree) {
			const targetIndex = filetree.findIndex(x => x.name.endsWith(imageName));
			if (targetIndex >= 0) lightbox.loadAndOpen(targetIndex);
		}
	}, [imageName, lightbox]);

	useEffect(() => {
		if (lightbox) {
			lightbox.on('uiRegister', () => {
				lightbox.pswp?.ui?.registerElement({
					name: 'info-button',
					order: 8,
					isButton: true,
					html: `<div class="lightbox-custom-button">${InfoIcon}</div>`,
					onClick(e, element, pswp) {
						const ossName = element.getAttribute('data-oss-name');
						const current = filetree?.find(x => x.name === ossName);

						if (current) {
							setCurrentPhoto(current);
							setExifModalOpen(true);
						}
					},
					onInit(element, pswp) {
						pswp.on('change', () => {
							element.setAttribute(
								'data-oss-name',
								pswp.currSlide?.data.element?.getAttribute('data-oss-name') || ''
							);
						});
					}
				});
			});

			new PhotoSwipeDynamicCaption(lightbox, {
				type: 'auto'
			});

			lightbox.init();
		}
	}, [lightbox]);

	useEffect(() => {
		if (meta.parent) {
			return;
		}

		setLightbox(
			new PhotoSwipeLightbox({
				gallery: '#gallery',
				children: 'a',
				showHideAnimationType: 'zoom',
				pswpModule: () => import('photoswipe'),
				closeTitle: '关闭',
				zoomTitle: '缩放',
				arrowPrevTitle: '上一张',
				arrowNextTitle: '下一张',
				errorMsg: '加载这张照片时出现了问题'
			})
		);

		return () => {
			lightbox?.destroy();
		};
	}, [meta]);

	const [exifModalOpen, setExifModalOpen] = useState(false);
	const [currentPhoto, setCurrentPhoto] = useState<PhotoRecord>();

	const [sortBy, setSortBy] = useState('date');
	const [orderBy, setOrderBy] = useState('asc');

	const navigate = useNavigate();

	// 缓存排序后的数据，避免每次 render 都重新排序
	const sortedFiletree = useMemo(() => {
		if (!filetree) return [];

		return [...filetree].sort((a, b) => {
			const orderMul = orderBy === 'asc' ? 1 : -1;

			if (sortBy === 'date') {
				const aTime = a.ts;
				const bTime = b.ts;
				if (aTime === undefined || bTime === undefined) return 0;

				return (aTime - bTime) * orderMul;
			}

			if (sortBy === 'altitude') {
				const aAlt = a.altitude;
				const bAlt = b.altitude;

				// 没有海拔数据的排到最后
				if (aAlt === undefined && bAlt === undefined) return 0;
				if (aAlt === undefined) return 1;
				if (bAlt === undefined) return -1;

				return (aAlt - bAlt) * orderMul;
			}

			if (sortBy === 'location') {
				const aAddr = a.addr;
				const bAddr = b.addr;

				if (!aAddr && !bAddr) return 0;
				if (!aAddr) return 1;
				if (!bAddr) return -1;

				return aAddr.localeCompare(bAddr, 'zh') * orderMul;
			}

			return 0;
		});
	}, [filetree, sortBy, orderBy]);

	// 从排序结果中取第一张有日期的照片，作为初始展示日期
	const baseDate = useMemo(() => {
		for (const f of sortedFiletree) {
			if (f.ts !== undefined) {
				return new Date(f.ts);
			}
		}
		return undefined;
	}, [sortedFiletree]);

	const [observerDate, setObserverDate] = useState<Date>();
	const displayDate = observerDate ?? baseDate;

	const photoRefs = useRef<Record<string, HTMLImageElement>>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				// 取所有相交照片中 boundingClientRect.top 最小的（视觉上最靠上）
				let bestTop = Infinity;
				let bestTs: string | undefined;

				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const ts = (entry.target as HTMLImageElement).dataset.ts;
					if (!ts) continue;
					if (entry.boundingClientRect.top < bestTop) {
						bestTop = entry.boundingClientRect.top;
						bestTs = ts;
					}
				}

				if (bestTs) {
					setObserverDate(new Date(+bestTs));
				}
			},
			{ threshold: 0.1 }
		);

		Object.values(photoRefs.current).forEach(ref => {
			observer.observe(ref);
		});

		return () => observer.disconnect();
	}, [meta]);

	return (
		<>
			{/* 标题部分 */}
			<div className="max-w-[1200px] mx-auto my-16">
				<section className="mb-10 flex flex-col gap-5 items-center text-center">
					<div className="flex flex-col gap-4 items-center">
						<a className="inpage-link" onClick={() => navigate(-1)}>
							<ArrowLeftIcon size={20} />
							返回上一页
						</a>
						<h1 className="font-bold leading-snug text-5xl">{meta.title}</h1>
						{/* {collection.locations && (
							<div className="flex items-center gap-2">
								{Array.isArray(collection.locations)
									? collection.locations.map((loc, i) => (
											<Fragment key={i}>
												{i > 0 && (
													<div className="bg-neutral-500 h-2 w-px" />
												)}
												<span>{loc}</span>
											</Fragment>
										))
									: collection.locations}
							</div>
						)} */}
					</div>
					<p className="text-neutral-400 max-w-[350px]">{meta.description}</p>
				</section>
			</div>

			{/* 照片部分 */}
			{!meta.parent && filetree && (
				<div className="flex flex-col">
					<div className="flex items-center gap-3 py-2.5 px-5 mb-2.5 bg-neutral-900/70 sticky top-[68px] z-40">
						{displayDate && <h2 className="text-xl">{formatDate(displayDate, 'ymd')}</h2>}
						<div className="flex-1" />
						<Dropdown
							title="排序"
							value={sortBy}
							setValue={setSortBy}
							items={[
								{ label: '拍摄时间', value: 'date', icon: CalendarIcon },
								{ label: '海拔高度', value: 'altitude', icon: MountainIcon },
								{ label: '地区', value: 'location', icon: MapPinIcon }
							]}
						/>
						<Dropdown
							title="顺序"
							value={orderBy}
							setValue={setOrderBy}
							items={[
								{ label: '升序', value: 'asc', icon: ArrowUpIcon },
								{ label: '降序', value: 'desc', icon: ArrowDownIcon }
							]}
						/>
					</div>
					<div
						className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 pswp-gallery"
						id="gallery"
					>
						{sortedFiletree.map(f => {
								const orientation = f.orientation;
								const swap = orientation === 6 || orientation === 8;
								const pswpWidth = swap ? f.height : f.width;
								const pswpHeight = swap ? f.width : f.height;

								return (
								<a
									data-cropped={true}
									data-oss-name={f.name}
									data-pswp-height={pswpHeight}
									data-pswp-width={pswpWidth}
									href={getOssUrlFromName(f.name)}
									key={f.name}
									target="_blank"
									className="relative hover:opacity-80 active:opacity-50"
								>
									<img
										ref={el => {
											if (el) {
												el.dataset.ts =
													f.ts !== undefined ? String(f.ts) : undefined;
												photoRefs.current[f.name] = el;
											} else {
												delete photoRefs.current[f.name];
											}
										}}
										data-oss-name={f.name}
										loading="lazy"
										src={getOssUrlFromName(f.name) + '?x-oss-process=image/resize,h_500'}
										className="object-cover object-center h-[250px] xl:h-[350px] w-full"
									/>
									{f.caption && (
										<>
											<div className="absolute right-4 bottom-4 bg-black/60 z-10 rounded-lg px-3 font-bold">
												ALT
											</div>
											<div className="pswp-caption-content">
												{f.caption.title && (
													<strong>{f.caption.title}</strong>
												)}
												<div className="whitespace-pre-wrap">
													{f.caption.content.trimEnd()}
												</div>
											</div>
										</>
									)}
								</a>
								);
							})}
					</div>
				</div>
			)}

			{/* 子相册卡片 */}
			{meta.parent && meta.children && (
				<div className="max-w-[1200px] mx-5 xl:mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{meta.children.map(c => {
						if (meta.childSizes[c.name] > 0) {
							const childPath = meta.name + '/' + c.name;
							return (
								<Card.Medium
									key={childPath}
									bg={c.image + '?x-oss-process=image/resize,h_500'}
									to={`/collection/${childPath}`}
									title={c.title}
									count={meta.childSizes[c.name]}
								/>
							);
						}

						return null;
					})}
				</div>
			)}

			<Modal open={exifModalOpen} setOpen={setExifModalOpen} width="600px">
				<div className="flex flex-col gap-3">
					{currentPhoto &&
						exifDisplay.map(display => {
							if (display.cond && !display.cond(currentPhoto))
								return null;

							return (
								<div key={display.name} className="grid grid-cols-[70px_1fr] gap-3">
									<div className="text-neutral-400 text-right">
										{display.name}
									</div>
									<div
										dangerouslySetInnerHTML={{
											__html: display.value(currentPhoto)
										}}
									></div>
								</div>
							);
						})}
				</div>
			</Modal>
		</>
	);
}
