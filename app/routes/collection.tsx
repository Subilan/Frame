import { Fragment, useEffect, useState } from 'react';
import { data, useParams } from 'react-router';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/photoswipe.css';
// @ts-ignore
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';
import Card from '~/components/Card';
import useFiletree, { getFiletree } from '~/hooks/useFiletree';
import useCollection from '~/hooks/useCollection';
import useCaptions from '~/hooks/useCaptions';
import InfoIcon from 'lucide-static/icons/info.svg?raw';
import Modal from '~/components/Modal';
import type { Exif } from '~/data/exifs';
import './collection.css';

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

export default function Collection() {
	const routeName = useParams()['*'];

	if (!routeName) {
		throw data('Not Found', { status: 404 });
	}

	const collection = useCollection(routeName);

	if (!collection) {
		throw data('Not Found', { status: 404 });
	}

	const filetree = useFiletree(routeName);
	const captions = useCaptions(routeName);

	useEffect(() => {
		if (collection.parent) {
			return;
		}

		let lightbox = new PhotoSwipeLightbox({
			gallery: '#gallery',
			children: 'a',
			showHideAnimationType: 'zoom',
			pswpModule: () => import('photoswipe'),
			closeTitle: '关闭',
			zoomTitle: '缩放',
			arrowPrevTitle: '上一张',
			arrowNextTitle: '下一张',
			errorMsg: '加载这张照片时出现了问题'
		});

		lightbox.on('uiRegister', () => {
			lightbox.pswp?.ui?.registerElement({
				name: 'info-button',
				order: 8,
				isButton: true,
				html: `<div class="lightbox-custom-button">${InfoIcon}</div>`,
				onClick(e, element, pswp) {
					fetch('/exifs_indexed.json')
						.then(r => r.json())
						.then(j => {
							const ossName = element.getAttribute('data-oss-name');
							if (ossName !== null) {
								const exif = j[ossName];
								if (exif !== undefined && exif.exif !== undefined) {
									setCurrentExif(exif.exif);
									setExifModalOpen(true);
								}
							}
						});

					fetch('/regeo.json')
						.then(r => r.json())
						.then(j => {
							const ossName = element.getAttribute('data-oss-name');
							if (ossName !== null) {
								const geo = j[ossName];

								if (geo !== undefined) {
									const c = geo.addressComponent;
									setCurrentExifGPSAddr(c.province + c.city + c.district);
								}
							}
						});
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

		return () => {
			lightbox.destroy();
		};
	}, [routeName]);

	const [exifModalOpen, setExifModalOpen] = useState(false);
	const [currentExif, setCurrentExif] = useState<Exif | undefined>();
	const [currentExifGPSAddr, setCurrentExifGPSAddr] = useState<string | undefined>();

	return (
		<>
			{/* 标题部分 */}
			<div className="max-w-[1200px] mx-auto my-16">
				<section className="mb-10 flex flex-col gap-5 items-center text-center">
					<div className="flex flex-col gap-3 items-center">
						<h1 className="font-bold text-5xl">{collection.title}</h1>
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
					<p className="text-neutral-400 max-w-[350px]">{collection.description}</p>
				</section>
			</div>

			{/* 照片部分 */}
			{!collection.parent && (
				<div className="w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 pswp-gallery" id="gallery">
					{filetree?.files.map((f, i) => (
						<a
							data-cropped={true}
							data-oss-name={f.name}
							data-pswp-height={f.height}
							data-pswp-width={f.width}
							href={`${f.url}`}
							key={`gallery-${i}`}
							target="_blank"
							className="relative hover:opacity-80 active:opacity-50"
						>
							<img
								loading="lazy"
								src={`${f.url}?x-oss-process=image/resize,h_500`}
								className="object-cover object-center h-[250px] xl:h-[350px] w-full"
							/>
							{captions[f.name] && (
								<>
									<div className="absolute right-4 bottom-4 bg-black/60 z-10 rounded-lg px-3 font-bold">
										ALT
									</div>
									<div className="pswp-caption-content">
										{captions[f.name].title && (
											<strong>{captions[f.name].title}</strong>
										)}
										<div className="whitespace-pre-wrap">
											{captions[f.name].content.trimEnd()}
										</div>
									</div>
								</>
							)}
						</a>
					))}
				</div>
			)}

			{/* 子相册卡片 */}
			{collection.parent && (
				<div className="max-w-[1200px] mx-5 xl:mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
					{collection.children.map(c => {
						const path = `${collection.name}/${c.name}`;
						const filetreeLength = getFiletree(path)?.files.length;

						if (filetreeLength) {
							return (
								<Card.Medium
									key={path}
									bg={c.image + '?x-oss-process=resize,h_500'}
									to={`/collection/${path}`}
									title={c.title}
									count={filetreeLength}
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
