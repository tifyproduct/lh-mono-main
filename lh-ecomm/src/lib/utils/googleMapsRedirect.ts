const googleMapsRedirect = (city: string) => {
	const url = `https://www.google.com/maps?q=Luxehouze%20${city}`;

	window.open(url, '_blank');
};

export default googleMapsRedirect;
