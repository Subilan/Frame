export default function translateExifCoords(GPSLongitude, GPSLatitude) {
	const longiLatiRegex = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;
	const longiExec = longiLatiRegex.exec(GPSLongitude ? GPSLongitude.value : '');
	const latiExec = longiLatiRegex.exec(GPSLatitude ? GPSLatitude.value : '');

	if (longiExec !== null && latiExec !== null) {
		return {
			lng: [1, 2, 3, 4].map(i => Number(longiExec[i])),
			lat: [1, 2, 3, 4].map(i => Number(latiExec[i]))
		};
	}

	return {
		lng: [],
		lat: []
	};
}
