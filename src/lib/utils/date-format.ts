/** tr-TR tarih + saat gösterimi — yönetim paneli liste ve detay sayfaları için. */
export function formatDateTime(iso: string, dateStyle: 'medium' | 'long' = 'medium'): string {
	return new Date(iso).toLocaleString('tr-TR', { dateStyle, timeStyle: 'short' });
}
