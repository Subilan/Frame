export default function formatDate(dateLike: string | Date, format: 'ym' | 'ymd' | 'detail') {
	if (typeof dateLike === 'string') dateLike = new Date(dateLike);

	const ym = `${dateLike.getFullYear()} 年 ${dateLike.getMonth() + 1} 月`;
	const ymd = `${dateLike.getFullYear()} 年 ${dateLike.getMonth() + 1} 月 ${dateLike.getDate()} 日`;
	const hms = `${dateLike.getHours()} 时 ${dateLike.getMinutes()} 分 ${dateLike.getSeconds()} 秒`;
	switch (format) {
		case 'ym':
			return ym;

		case 'ymd':
			return ymd;

		case 'detail':
			return ymd + ' ' + hms;
	}
}
