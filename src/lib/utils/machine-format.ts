import type { Machine } from '$lib/types';

export const CURRENCY_LABEL: Record<Machine['currency'], string> = {
	EUR: '€',
	USD: '$',
	TRY: 'TL'
};

export const STATUS_LABEL: Record<Machine['status'], string> = {
	available: 'Satışta',
	sold: 'Satıldı',
	hidden: 'Gizli'
};

export function formatPrice(price: number | null, currency: string): string | null {
	if (price === null) return null;
	const symbol =
		currency in CURRENCY_LABEL ? CURRENCY_LABEL[currency as Machine['currency']] : currency;
	return `${new Intl.NumberFormat('tr-TR').format(price)} ${symbol}`;
}
