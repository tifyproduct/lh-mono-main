import { STORE } from '../lib/constants.util';

export function match(param: string) {
	return [STORE.id, STORE.sg, STORE.beauty].includes(param);
}
