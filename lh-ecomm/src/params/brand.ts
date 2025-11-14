import { EXCLUSIVE_BRANDS } from '../lib/constants.util';

export function match(param: string): boolean {
	return EXCLUSIVE_BRANDS.includes(param);
}
