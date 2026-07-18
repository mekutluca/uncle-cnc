import type { GalleryItem } from '$lib/types';

/**
 * Galeri öğeleri — müşteriden görseller geldikçe `src/lib/assets/gallery/` klasörüne
 * eklenip buraya işlenir. `serviceSlug`, PDF'teki isteğe göre görselden ilgili hizmet
 * formuna yönlendirme sağlar.
 */
export const gallery: GalleryItem[] = [
	{ label: 'REVİZYON', description: 'Dik işleme merkezi komple revizyon', serviceSlug: 'maintenance' },
	{ label: 'SERVİS', description: 'Fanuc kontrol arıza müdahalesi', serviceSlug: 'repair' },
	{ label: 'BAKIM', description: '32 başlık periyodik bakım', serviceSlug: 'maintenance' },
	{ label: 'EKSPERTİZ', description: 'Alım öncesi ekspertiz raporu', serviceSlug: 'appraisal' },
	{ label: 'MONTAJ', description: 'Tezgâh taşıma ve devreye alma', serviceSlug: 'repair' },
	{ label: 'TİCARET', description: 'Satışa hazırlanan tezgâh', serviceSlug: 'machine-trading' },
	{ label: 'SERVİS', description: 'Mil (spindle) değişimi', serviceSlug: 'repair' },
	{ label: 'BAKIM', description: 'Eksen kızak ve vida bakımı', serviceSlug: 'maintenance' }
];
