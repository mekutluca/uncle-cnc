/**
 * Galeri öğeleri — müşteriden görseller geldikçe `src/lib/assets/gallery/` klasörüne
 * eklenip buraya işlenir. `serviceSlug`, PDF'teki isteğe göre görselden ilgili hizmet
 * formuna yönlendirme sağlar.
 */
export type GalleryItem = {
	label: string;
	description: string;
	serviceSlug: string;
	/** 'enhanced' görsel yolu; boşsa yer tutucu gösterilir */
	image?: string;
	ratio?: string;
};

export const gallery: GalleryItem[] = [
	{ label: 'REVİZYON', description: 'Dik işleme merkezi komple revizyon', serviceSlug: 'maintenance', ratio: '4/3' },
	{ label: 'SERVİS', description: 'Fanuc kontrol arıza müdahalesi', serviceSlug: 'repair', ratio: '4/3' },
	{ label: 'BAKIM', description: '32 başlık periyodik bakım', serviceSlug: 'maintenance', ratio: '4/3' },
	{ label: 'EKSPERTİZ', description: 'Alım öncesi ekspertiz raporu', serviceSlug: 'appraisal', ratio: '4/3' },
	{ label: 'MONTAJ', description: 'Tezgâh taşıma ve devreye alma', serviceSlug: 'repair', ratio: '4/3' },
	{ label: 'TİCARET', description: 'Satışa hazırlanan tezgâh', serviceSlug: 'machine-trading', ratio: '4/3' },
	{ label: 'SERVİS', description: 'Mil (spindle) değişimi', serviceSlug: 'repair', ratio: '4/3' },
	{ label: 'BAKIM', description: 'Eksen kızak ve vida bakımı', serviceSlug: 'maintenance', ratio: '4/3' }
];
