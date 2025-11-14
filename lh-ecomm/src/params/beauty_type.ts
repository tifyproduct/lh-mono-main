export function match(param: string): boolean {
	return [
		'skin-type',
		'make-up',
		'skincare',
		'hair-care',
		'bath-body-1',
		'fragrance-1',
		'gift-set-1'
	].includes(param);
}
