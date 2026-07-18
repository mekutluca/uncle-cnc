/** Firma bilgileri — müşteriden gelen gerçek bilgilerle güncellenecek tek yer. */
export const site = {
	name: 'MC ICS',
	fullName: 'MC ICS — International CNC Service',
	tagline: '.every machine can work',
	description:
		'CNC tezgâhlarınız için ekspertiz, danışmanlık, bakım, servis ve makine ticareti. Her makine çalışır — biz çalıştırırız.',
	phone: '+90 500 000 00 00', // TODO: gerçek telefon
	email: 'info@mcics.com.tr', // TODO: gerçek e-posta
	address: 'Organize Sanayi Bölgesi, İstanbul', // TODO: gerçek adres
	mapsEmbedUrl:
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48173.5!2d29.1!3d40.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zSXN0YW5idWw!5e0!3m2!1str!2str!4v1700000000000', // TODO: gerçek konum embed'i
	url: 'https://mcics.netlify.app' // TODO: gerçek alan adı
};

export const nav = [
	{ href: '/', label: 'Ana Sayfa' },
	{ href: '/services', label: 'Hizmetler', children: true },
	{ href: '/machines', label: 'Satılık Makineler' },
	{ href: '/gallery', label: 'Galeri' },
	{ href: '/references', label: 'Referanslar' },
	{ href: '/about', label: 'Hakkımızda' },
	{ href: '/contact', label: 'İletişim' }
] as const;
