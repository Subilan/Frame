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
import type { Exif } from '~/data/exifs';
import type { Route } from './+types/collection';
import type { CollectionItem, CollectionMeta } from '~/data/types';
import { DataPath, SlashSubstitute } from '~/consts';
import { ArrowLeftIcon } from 'lucide-react';
import parseExifTime from '~/data/utils/parseExifTime';
import { CSSTransition } from 'react-transition-group';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import Dropdown from '~/components/Dropdown';

const exifDisplay: {
	cond?: (exif: Exif, ...extra: any[]) => boolean;
	name: string;
	value: (exif: Exif, ...extra: any[]) => string;
}[] = [
	{
		name: '文件大小',
		value(exif) {
			return `${(Number(exif.FileSize.value) / 1024 / 1024).toFixed(1)} MB`;
		}
	},
	{
		name: '尺寸',
		value(exif) {
			const w = exif.ImageWidth.value;
			const h = exif.ImageHeight.value;

			return exif.Orientation.value === '6' ? `${h}px×${w}px` : `${w}px×${h}px`;
		}
	},
	{
		name: '拍摄设备',
		value(exif) {
			return exif.Model.value;
		}
	},
	{
		name: '拍摄时间',
		value(exif) {
			const pattern = /^(\d+):(\d+):(\d+) ([\d:]+)$/;
			const execResult = pattern.exec(exif.DateTime.value);

			return execResult === null
				? 'Unknown'
				: `${execResult[1]}-${execResult[2]}-${execResult[3]} ${execResult[4]} UTC+8`;
		}
	},
	{
		name: 'GPS',
		cond(exif) {
			return exif.GPSLongitude !== undefined && exif.GPSLatitude !== undefined;
		},
		value(exif) {
			return `${exif.GPSLongitude!.value.replace('deg', '°')} E<br/>${exif.GPSLatitude!.value.replace('deg', '°')} N`;
		}
	},
	{
		name: 'GPS 地址',
		cond(exif, ...extra) {
			return (
				exif.GPSLongitude !== undefined &&
				exif.GPSLatitude !== undefined &&
				extra[0] !== '中华人民共和国'
			);
		},
		value(_, ...extra) {
			return extra[0];
		}
	},
	{
		name: '海拔高度',
		cond(exif) {
			return exif.GPSAltitude !== undefined && exif.GPSAltitudeRef !== undefined;
		},
		value(exif) {
			return (
				(exif.GPSAltitudeRef!.value === '0' ? '' : '-') +
				(eval(exif.GPSAltitude!.value) as Number).toFixed(1) +
				'm'
			);
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
		filetree: filetree && ((await filetree.json()) as CollectionItem[])
	};
}

export default function Collection({ loaderData }: Route.ComponentProps) {
	const { meta, filetree } = loaderData;

	const location = useLocation();
	const imageName = useMemo(() => location.hash.substring(1), [location]);

	const [lightbox, setLightbox] = useState<PhotoSwipeLightbox>();

	useEffect(() => {
		if (lightbox && imageName && filetree) {
			console.log(imageName);
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

						if (current?.exif) {
							setCurrentExif(current.exif);
							setCurrentExifGPSAddr(current.addr);
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
	const [currentExif, setCurrentExif] = useState<Exif>();
	const [currentExifGPSAddr, setCurrentExifGPSAddr] = useState<string>();

	const navigate = useNavigate();

	const [date, setDate] = useState<Date>();

	const photoRefs = useRef<Record<string, HTMLImageElement>>({});

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				const entry = entries
					.map(entry => ({
						intersecting: entry.isIntersecting,
						exif: (entry.target as HTMLImageElement).dataset.exif as string | undefined
					}))
					.filter(e => e.intersecting && e.exif)[0];
				if (!entry) return;
				const exifData = JSON.parse(entry.exif!) as Exif;
				setDate(parseExifTime(exifData.DateTime.value));
			},
			{ threshold: 0.1 }
		);

		Object.values(photoRefs.current).forEach(ref => {
			ref.dataset.key = ref.getAttribute('data-oss-name') ?? undefined;
			observer.observe(ref);
		});

		return () => observer.disconnect();
	}, [meta]);

	const [sortBy, setSortBy] = useState('date');
	const [orderBy, setOrderBy] = useState('asc');

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
						{date && (
							<h2 className="text-xl">
								{date.getFullYear()} 年 {date.getMonth()} 月 {date.getDate()} 日
							</h2>
						)}
						<div className="flex-1" />
						<Dropdown
							title="排序"
							value={sortBy}
							setValue={setSortBy}
							items={[{ label: '拍摄时间', value: 'date' }]}
						/>
						<Dropdown
							title="顺序"
							value={orderBy}
							setValue={setOrderBy}
							items={[
								{ label: '升序', value: 'asc' },
								{ label: '降序', value: 'desc' }
							]}
						/>
					</div>
					<div
						className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 pswp-gallery"
						id="gallery"
					>
						{filetree
							.sort((a, b) => {
								if (sortBy === 'date') {
									const [aTime, bTime] = [
										a.exif?.DateTime.value,
										b.exif?.DateTime.value
									];

									if (!aTime || !bTime) return 0;

									const [aDate, bDate] = [
										parseExifTime(aTime),
										parseExifTime(bTime)
									];

									if (!aDate || !bDate) return 0;

									return orderBy === 'asc' ? +aDate - +bDate : +bDate - +aDate;
								}

								return 0;
							})
							.map(f => (
								<a
									data-cropped={true}
									data-oss-name={f.name}
									data-pswp-height={f.exif?.ImageHeight.value}
									data-pswp-width={f.exif?.ImageWidth.value}
									href={`${f.url}`}
									key={f.name}
									target="_blank"
									className="relative hover:opacity-80 active:opacity-50"
								>
									<img
										ref={el => {
											if (el) {
												el.dataset.exif = f.exif
													? JSON.stringify(f.exif)
													: undefined;
												photoRefs.current[f.name] = el;
											} else {
												delete photoRefs.current[f.name];
											}
										}}
										data-oss-name={f.name}
										loading="lazy"
										src={`${f.url}?x-oss-process=image/resize,h_500`}
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
							))}
					</div>
				</div>
			)}

			{/* 子相册卡片 */}
			{meta.parent && meta.children && (
				<div className="max-w-[1200px] mx-5 xl:mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
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
					{currentExif &&
						exifDisplay.map(display => {
							if (display.cond && !display.cond(currentExif, currentExifGPSAddr))
								return null;

							return (
								<div key={display.name} className="grid grid-cols-[70px_1fr] gap-3">
									<div className="text-neutral-400 text-right">
										{display.name}
									</div>
									<div
										dangerouslySetInnerHTML={{
											__html: display.value(currentExif, currentExifGPSAddr)
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
