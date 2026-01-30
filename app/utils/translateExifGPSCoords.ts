export default function translateExifGPSCoords(GPSLongitude: string, GPSLatitude: string) {
	const longiLatiRegex = /(\d+)deg (\d+)' (\d+)\.(\d+)"/;
	const longiExec = longiLatiRegex.exec(GPSLongitude);
	const latiExec = longiLatiRegex.exec(GPSLatitude);

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
