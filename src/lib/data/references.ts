/** Referans firmalar — müşteriden logo ve isimler geldikçe güncellenir. */
export type Reference = { name: string; sector?: string };

export const references: Reference[] = [
	{ name: 'Referans 1', sector: 'Otomotiv yan sanayi' },
	{ name: 'Referans 2', sector: 'Kalıp imalatı' },
	{ name: 'Referans 3', sector: 'Havacılık' },
	{ name: 'Referans 4', sector: 'Genel imalat' },
	{ name: 'Referans 5', sector: 'Savunma sanayi' },
	{ name: 'Referans 6', sector: 'Medikal' }
];
