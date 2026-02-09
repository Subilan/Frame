export default function formatDate(dateLike: string | Date, format: 'ymd' | 'detail') {
	if (typeof dateLike === 'string') dateLike = new Date(dateLike);

	const ymd = `${dateLike.getFullYear()} 年 ${dateLike.getMonth()} 月 ${dateLike.getDate()} 日`;
	const hms = `${dateLike.getHours()} 时 ${dateLike.getMinutes()} 分 ${dateLike.getSeconds()} 秒`;
	switch (format) {
		case 'ymd':
			return ymd;

		case 'detail':
			return ymd + ' ' + hms;
	}
}
