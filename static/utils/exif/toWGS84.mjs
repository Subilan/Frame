export default function toWGS84(latitudeArray, longitudeArray) {
	let lat = latitudeArray[0];
	let lng = longitudeArray[0];

	lat += latitudeArray[1] * (1 / 60);
	lng += longitudeArray[1] * (1 / 60);

	const latSec = Number(`${latitudeArray[2]}.${latitudeArray[3]}`);
	const lonSec = Number(`${longitudeArray[2]}.${longitudeArray[3]}`);

	lat += latSec * (1 / 3600);
	lng += lonSec * (1 / 3600);

	return [lng, lat];
}