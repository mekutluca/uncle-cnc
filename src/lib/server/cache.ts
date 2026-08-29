/** Herkese açık liste/detay sayfaları için önbellek politikası — tek doğruluk kaynağı.
 * s-maxage yalnızca paylaşılan önbellekler (ileride öne konabilecek bir CDN) içindir;
 * tarayıcılar bunu yok sayar ve her ziyarette sunucudan taze veri alır. */
export const PUBLIC_CDN_CACHE_HEADERS = {
	'cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
};
