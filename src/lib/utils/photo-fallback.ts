/**
 * `img` onerror işleyicisi: küçük varyantı olmayan (eski) fotoğraflarda tam
 * boyuta düşer. Sonsuz döngüye girmemek için aynı URL'e ikinci kez geçmez.
 */
export function fallbackToFull(event: Event, fullUrl: string | null | undefined): void {
	const img = event.currentTarget as HTMLImageElement;
	if (fullUrl && img.src !== fullUrl) img.src = fullUrl;
}
