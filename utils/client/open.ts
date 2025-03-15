export default function (url: string, newWindow = true) {
	return newWindow ? window.open(url) : location.href = url;
}
