const SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', TRY: 'TL' };

export function formatPrice(price: number | null, currency: string): string | null {
	if (price === null) return null;
	return `${new Intl.NumberFormat('tr-TR').format(price)} ${SYMBOLS[currency] ?? currency}`;
}
