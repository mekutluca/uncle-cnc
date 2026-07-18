import type { Service } from '$lib/types';

/** Beş hizmet dikeyi — sıra ve tanıtım metinleri müşterinin PDF'inden. */
export const services: Service[] = [
	{
		slug: 'appraisal',
		formName: 'appraisal',
		code: 'EKS-01',
		title: 'Ekspertiz',
		short: 'Almadan veya satmadan önce makinenizin gerçek durumunu köklü tecrübemizle raporluyoruz.',
		intro:
			'Almak veya satmak istediğiniz makinenizi köklü tecrübemizle inceleyerek gerekli tüm bilgileri size sunuyoruz. Bakım veya servis ekspertizi uygulamamızla doğru tespit ile doğru işlemlerin makinenize uygulanmasına yardımcı oluyoruz. Hemen iletişime geçmek için formu doldurun.',
		fields: { machine: true, modelYear: 'single', priceRange: false, photos: false, faultDescription: false }
	},
	{
		slug: 'consulting',
		formName: 'consulting',
		code: 'DAN-02',
		title: 'Danışmanlık',
		short: 'Makine alımından sektöre girişe, aklınıza takılan her konuda yanınızdayız.',
		intro:
			'Makine almak, sektöre girmek ve dahası — aklınıza takılan her türlü konuda danışmanlık hizmeti vermekteyiz. Bilgilerinizi aşağıya girerek süreci başlatabilirsiniz.',
		fields: { machine: false, modelYear: 'none', priceRange: false, photos: false, faultDescription: false }
	},
	{
		slug: 'maintenance',
		formName: 'maintenance',
		code: 'BAK-03',
		title: 'Bakım',
		short: '32 başlıkta profesyonel tezgâh bakımı, ayrıntılı görsellerle raporlama.',
		intro:
			'32 başlıkta tezgâh bakımınızı profesyonel olarak tamamlıyoruz. Ayrıntılı görsellerle rapor hazırlayarak bilgilendirme yapıyoruz. Bakım teklifimiz için aşağıdaki formu doldurmanız yeterlidir.',
		fields: { machine: true, modelYear: 'single', priceRange: false, photos: true, faultDescription: false }
	},
	{
		slug: 'repair',
		formName: 'repair',
		code: 'SRV-04',
		title: 'Servis',
		short: 'Arıza, değişim ve tamir işleriniz yetkin ekibimizle en hızlı şekilde teslim.',
		intro:
			'Yetkin ve donanımlı personeller ile arıza, değişim, tamir işlerinizi profesyonel olarak tamamlıyor, en hızlı şekilde teslim ediyoruz. En hızlı çözüm için formu doldurun.',
		fields: { machine: true, modelYear: 'single', priceRange: false, photos: true, faultDescription: true }
	},
	{
		slug: 'machine-trading',
		formName: 'machine-trading',
		code: 'TIC-05',
		title: 'Makine Ticareti',
		short: 'İster değerleme yaptırın, ister değerinde alın veya satın — iki tarafta da kazançlı çıkın.',
		intro:
			'Makineniz için isterseniz değerleme yapıyoruz, isterseniz değerinde alıp satıyoruz. Doğru yönlendirme ile alırken de satarken de kazançlı çıkıyorsunuz. Hemen kazanmak için formu doldurun.',
		fields: { machine: true, modelYear: 'range-by-intent', priceRange: true, photos: 'sell-only', faultDescription: false }
	}
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
