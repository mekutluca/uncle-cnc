/** Herkese açık liste/detay sayfaları için CDN önbellek politikası — tek doğruluk kaynağı. */
export const PUBLIC_CDN_CACHE_HEADERS = {
	'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600'
};
