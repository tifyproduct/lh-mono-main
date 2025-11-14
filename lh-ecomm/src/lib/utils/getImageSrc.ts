const getImageSrc = (imagePath: string): string => {
	const cdnBaseUrl = 'https://cdn.frostycle.com/';
	return `${cdnBaseUrl}${imagePath}`;
};

export default getImageSrc;
