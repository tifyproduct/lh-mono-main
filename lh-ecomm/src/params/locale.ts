import { LANG } from '../lib/constants.util';

export function match(param: string) {
	return [LANG.id, LANG.en].includes(param);
}
