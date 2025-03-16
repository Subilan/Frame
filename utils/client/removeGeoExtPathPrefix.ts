export default function removeGeoExtPathPrefix(ext_path: string, name: string) {
	return ext_path.replace(name, '').replace(', ', '');
}
