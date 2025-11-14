import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from '../../../tailwind.config';

const getTailwindConfig = () => {
	const config = resolveConfig(tailwindConfig);

	return config;
};

export default getTailwindConfig;
