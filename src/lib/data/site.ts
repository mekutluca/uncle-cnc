/** Firma bilgileri — müşteriden gelen gerçek bilgilerle güncellenecek tek yer. */
export const site = {
	name: 'Uncle CNC',
	fullName: 'Uncle CNC — International CNC Service',
	tagline: '.every machine can work',
	description:
		'CNC tezgâhlarınız için ekspertiz, danışmanlık, bakım, servis ve makine ticareti. Her makine çalışır — biz çalıştırırız.',
	phone: '+90 506 577 18 37',
	get phoneHref() {
		return `tel:${this.phone.replaceAll(' ', '')}`;
	},
	email: 'info@unclecnc.com',
	address: '100. Yıl Bulvarı 55/A, Ostim OSB, Yenimahalle/Ankara',
	mapsEmbedUrl:
		'https://www.google.com/maps?q=100.%20Y%C4%B1l%20Bulvar%C4%B1%2055%2FA%2C%20Ostim%20OSB%2C%20Yenimahalle%2FAnkara&output=embed',
	url: 'https://unclecnc.com'
};

export const nav = [
	{ href: '/', label: 'Ana Sayfa' },
	{ href: '/services', label: 'Hizmetler', children: true },
	{ href: '/machines', label: 'Satılık Ürünler' },
	{ href: '/gallery', label: 'Galeri' },
	{ href: '/references', label: 'Referanslar' },
	{ href: '/about', label: 'Hakkımızda' },
	{ href: '/contact', label: 'İletişim' }
] as const;
