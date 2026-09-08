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
