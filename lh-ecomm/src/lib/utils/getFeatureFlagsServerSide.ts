import type { FeatureFlag } from '$lib/types/featureFlag';

export function getFeatureFlagsServerSide(): FeatureFlag {
	const envFeatureFlag = import.meta.env.VITE_FEATURE_FLAG;
	return JSON.parse(envFeatureFlag || '{}');
}
