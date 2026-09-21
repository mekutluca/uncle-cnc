/** Paraglide locale → BCP-47 tag for Intl formatting on the public site.
 *  Arabic/Persian force Latin digits (`-u-nu-latn`) so numbers stay visually
 *  consistent with LTR-pinned prices/phone numbers inside RTL layouts. */
const LOCALE_TAGS: Record<string, string> = {
	tr: 'tr-TR',
	en: 'en-US',
	ar: 'ar-SA-u-nu-latn',
	de: 'de-DE',
	fa: 'fa-IR-u-nu-latn'
};

export function localeTag(locale: string): string {
	return LOCALE_TAGS[locale] ?? LOCALE_TAGS.tr;
}

/** Dosya boyutu, ondalık MB olarak (ör. "26,5 MB"). `tag` verilmezse tr-TR. */
export function formatMegabytes(bytes: number, tag = LOCALE_TAGS.tr): string {
	const megabytes = new Intl.NumberFormat(tag, { maximumFractionDigits: 1 }).format(
		bytes / 1_000_000
	);
	return `${megabytes} MB`;
}
