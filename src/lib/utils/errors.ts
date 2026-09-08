import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
import LockIcon from '@lucide/svelte/icons/lock';
import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
import type { ErrorCopy, ErrorKind } from '$lib/types';

/** 401 "forbidden" sayılır: oturumsuz ziyaretçiyi hook zaten login'e yönlendirir,
 *  sayfaya ulaşan bir 401 yetki sorunudur. */
export function errorKind(status: number): ErrorKind {
	if (status === 404) return 'notFound';
	if (status === 401 || status === 403) return 'forbidden';
	return 'server';
}

/**
 * HTTP durum kodu için genel Türkçe açıklama. Hem `handleError` hook'ları
 * (SvelteKit'in İngilizce "Not Found" / "Internal Error" metinleri sayfaya
 * ulaşmasın) hem de mesajsız bir `error()` çağrısında hata sayfası kullanır.
 */
export function defaultErrorMessage(status: number): string {
	switch (errorKind(status)) {
		case 'notFound':
			return 'Aradığınız adres taşınmış ya da hiç var olmamış olabilir.';
		case 'forbidden':
			return 'Bu sayfayı görüntülemek için gerekli yetkiye sahip değilsiniz.';
		default:
			return 'Lütfen tekrar deneyin. Sorun sürerse bizimle iletişime geçin.';
	}
}

/** `tab` sekme başlığı, `title` sayfa manşeti (404, sitenin koordinat/crosshair diliyle konuşur). */
export const errorCopy: Record<ErrorKind, ErrorCopy> = {
	notFound: { icon: CircleAlertIcon, tab: 'Sayfa bulunamadı', title: 'Bu koordinatta sayfa yok' },
	forbidden: { icon: LockIcon, tab: 'Erişim yok', title: 'Bu alana erişim yetkiniz yok' },
	server: { icon: TriangleAlertIcon, tab: 'Bir hata oluştu', title: 'Bir şeyler ters gitti' }
};
