import type { Machine } from '$lib/types';

/** Admin panel etiketleri — Türkçe sabit kalır, admin i18n kapsam dışıdır. */
export const CURRENCY_LABEL: Record<Machine['currency'], string> = {
	EUR: '€',
	USD: '$',
	TRY: 'TL'
};

/** Admin panel etiketleri — Türkçe sabit kalır, admin i18n kapsam dışıdır. */
export const STATUS_LABEL: Record<Machine['status'], string> = {
	available: 'Satışta',
	sold: 'Satıldı',
	hidden: 'Gizli'
};

/** `locale` verilmezse admin'in beklediği tr-TR biçimlendirmesi korunur. */
export function formatPrice(
	price: number | null,
	currency: string,
	locale = 'tr-TR'
): string | null {
	if (price === null) return null;
	const symbol =
		currency in CURRENCY_LABEL ? CURRENCY_LABEL[currency as Machine['currency']] : currency;
	return `${new Intl.NumberFormat(locale).format(price)} ${symbol}`;
}
