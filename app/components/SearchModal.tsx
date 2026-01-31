import { useCallback, useEffect, useRef, useState } from 'react';
import Modal, { type ModalControl } from '~/components/Modal';

export default function SearchModal({ open, setOpen }: ModalControl) {
	const [searchValue, setSearchValue] = useState('');
	const [searchResult, setSearchResult] = useState<any[]>([]);
	const [searchTimeoutId, setSearchTimeoutId] = useState<number | undefined>();
	const [sequentialSearchData, setSequentialSearchData] = useState<any[] | undefined>();

	const fetchSequentialSearchData = useCallback(async () => {
		const data = await fetch('/sequential_search.json');
		setSequentialSearchData(await data.json());
	}, []);

	useEffect(() => {
		fetchSequentialSearchData();
	}, []);

	useEffect(() => {
		if (!open) {
			setSearchResult([]);
			setSearchValue('');
		}
	}, [open]);

	const searchAndSet = useCallback(
		(keyword: string) => {
			if (!sequentialSearchData) {
				setSearchResult([]);
				return;
			}
			const result = [];
			for (let searchData of sequentialSearchData) {
				if (searchData.keywords.some((x: string) => x?.includes(keyword))) {
					result.push(searchData);
				}
			}
			setSearchResult(result);
			console.log(result, result.length);
		},
		[sequentialSearchData]
	);

	useEffect(() => {
		if (searchTimeoutId) {
			window.clearTimeout(searchTimeoutId);
		}
		if (searchValue.trim().length === 0) {
			setSearchResult([]);
			return;
		}
		setSearchTimeoutId(
			window.setTimeout(() => {
				searchAndSet(searchValue);
			}, 200)
		);
	}, [searchValue]);

	return (
		<Modal
			width="500px"
			open={open}
			setOpen={setOpen}
			overlayChildren={
				<div className="flex flex-col gap-5 absolute bottom-0 w-dvw p-5">
					<h3 className="text-3xl">{searchResult.length} 个结果</h3>
					{searchResult.length > 0 && (
						<div className="flex items-center flex-nowrap overflow-x-auto gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
							{searchResult.map(result => (
								<img
									key={result.url}
									src={`${result.url}?x-oss-process=resize,h_200`}
									loading="lazy"
									onClick={e => e.stopPropagation()}
									width={'300px'}
									height={'200px'}
									className="object-cover min-w-[300px] h-[200px] rounded-3xl relative shadow-2xl bg-neutral-800"
								></img>
							))}
						</div>
					)}
				</div>
			}
		>
			<div className="flex flex-col gap-3">
				<h2 className="text-2xl">搜索</h2>
				<p className="text-neutral-400">
					支持搜索地理位置和日期。
				</p>
				<input
					placeholder="键入关键词进行搜索"
					autoFocus
					onInput={e => setSearchValue((e.target as HTMLInputElement).value)}
					className="border-b-2 pb-1 border-neutral-500 hover:border-neutral-400 focus:border-neutral-300 transition-all outline-0"
				/>
			</div>
		</Modal>
	);
}
