import type { FeatureFlag } from '$lib/types/featureFlag';
import { writable } from 'svelte/store';

const envFeatureFlag = import.meta.env.VITE_FEATURE_FLAG;
const parsedEnvFeatureFlag: FeatureFlag = JSON.parse(envFeatureFlag);

// Create a writable store with an initial value
export const featureFlagStore = writable<FeatureFlag>(parsedEnvFeatureFlag);
