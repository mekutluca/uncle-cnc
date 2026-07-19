const TR_MAP: Record<string, string> = {
	ç: 'c',
	ğ: 'g',
	ı: 'i',
	i: 'i',
	ö: 'o',
	ş: 's',
	ü: 'u',
	Ç: 'c',
	Ğ: 'g',
	I: 'i',
	İ: 'i',
	Ö: 'o',
	Ş: 's',
	Ü: 'u'
};

/** Türkçe karakterleri sadeleştirip URL dostu kısa ad üretir. */
export function slugify(text: string): string {
	return text
		.split('')
		.map((ch) => TR_MAP[ch] ?? ch)
		.join('')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
