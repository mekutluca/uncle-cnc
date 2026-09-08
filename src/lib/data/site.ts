import * as m from '$lib/paraglide/messages';

/** Firma bilgileri — müşteriden gelen gerçek bilgilerle güncellenecek tek yer. */
export const site = {
	name: 'Uncle CNC',
	fullName: 'Uncle CNC — International CNC Service',
	tagline: '.every machine can work',
	/** Getter: aktif Paraglide diline göre yeniden hesaplanır (bkz. `phoneHref` ile aynı desen). */
	get description() {
		return m.common_site_description();
	},
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

/** `label` getter'dır: dil değişince Header/Footer yeniden render olduğunda güncel çeviriyi döner. */
export const nav = [
	{
		href: '/',
		get label() {
			return m.nav_home();
		}
	},
	{
		href: '/services',
		get label() {
			return m.nav_services();
		},
		children: true
	},
	{
		href: '/machines',
		get label() {
			return m.nav_machines();
		}
	},
	{
		href: '/gallery',
		get label() {
			return m.nav_gallery();
		}
	},
	{
		href: '/references',
		get label() {
			return m.nav_references();
		}
	},
	{
		href: '/announcements',
		get label() {
			return m.nav_announcements();
		}
	},
	{
		href: '/about',
		get label() {
			return m.nav_about();
		}
	},
	{
		href: '/contact',
		get label() {
			return m.nav_contact();
		}
	}
] as const;
