import { getTextDirection } from '$lib/paraglide/runtime';

export function isRtl(locale: string): boolean {
	return getTextDirection(locale) === 'rtl';
}
