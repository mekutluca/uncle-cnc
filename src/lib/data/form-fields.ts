/** Form ve alan adlarının insan-okur karşılıkları — e-posta bildirimi ve
 * yönetim panelindeki "Talepler" görünümü bu haritaları paylaşır.
 * FIELD_LABELS'ın anahtar sırası aynı zamanda görüntüleme sırasıdır. */

export const FORM_LABELS: Record<string, string> = {
	contact: 'İletişim',
	appraisal: 'Ekspertiz',
	consulting: 'Danışmanlık',
	maintenance: 'Bakım',
	repair: 'Servis',
	'machine-trading': 'Makine Ticareti'
};

const FIELD_LABELS: Record<string, string> = {
	islem_turu: 'İşlem Türü',
	ilgili_ilan: 'İlgili İlan',
	ad_soyad: 'Ad Soyad',
	firma: 'Firma',
	telefon: 'Telefon',
	eposta: 'E-posta',
	adres: 'Adres',
	makine_cinsi: 'Makine Cinsi',
	makine_boyutu: 'Makine Boyutu',
	model_yili: 'Model Yılı',
	model_yili_min: 'Model Yılı (En Az)',
	model_yili_max: 'Model Yılı (En Çok)',
	fiyat_min: 'Fiyat (En Az)',
	fiyat_max: 'Fiyat (En Çok)',
	para_birimi: 'Para Birimi',
	ariza_tanimi: 'Arıza Tanımı',
	mesaj: 'Mesaj',
	notlar: 'Notlar'
};

/** Gönderim verisini görüntüleme sırasına dizer; haritada olmayan alanlar sona eklenir. */
export function orderedEntries(data: Record<string, string>): [string, string][] {
	const known = Object.keys(FIELD_LABELS).filter((key) => key in data);
	const unknown = Object.keys(data).filter((key) => !(key in FIELD_LABELS));
	return [...known, ...unknown].map((key) => [FIELD_LABELS[key] ?? key, data[key]]);
}
