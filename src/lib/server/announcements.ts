import { ANNOUNCEMENT_LIMITS, addDaysToDayKey, istanbulDayStart } from '$lib/utils/announcements';
import type { AnnouncementFields } from '$lib/types';

const {
	title: TITLE_MAX,
	body: BODY_MAX,
	linkUrl: LINK_URL_MAX,
	linkLabel: LINK_LABEL_MAX,
	popupDaysMin: POPUP_DAYS_MIN,
	popupDaysMax: POPUP_DAYS_MAX,
	popupDaysDefault: POPUP_DAYS_DEFAULT
} = ANNOUNCEMENT_LIMITS;

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;

function normalizeBody(raw: string): string {
	return raw
		.replace(/\r\n?/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

/** Site içi yol (`/machines/...`) olduğu gibi kalır, dış adres https ile tamamlanıp doğrulanır. */
function parseLinkUrl(raw: string): string | null | undefined {
	const value = raw.trim();
	if (!value) return null;
	if (value.length > LINK_URL_MAX) return undefined;
	if (value.startsWith('/')) return value.startsWith('//') ? undefined : value;
	const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
	try {
		const url = new URL(withScheme);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
		return url.href.length > LINK_URL_MAX ? undefined : url.href;
	} catch {
		return undefined;
	}
}

/** Form alanlarını doğrular. Hata durumunda kullanıcıya gösterilecek metin döner. */
export function parseAnnouncementFields(formData: FormData): AnnouncementFields | string {
	const title = String(formData.get('title') ?? '').trim();
	if (!title) return 'Başlık zorunludur.';
	if (title.length > TITLE_MAX) return `Başlık en çok ${TITLE_MAX} karakter olabilir.`;

	const body = normalizeBody(String(formData.get('body') ?? ''));
	if (!body) return 'Metin zorunludur.';
	if (body.length > BODY_MAX) return `Metin en çok ${BODY_MAX} karakter olabilir.`;

	const link_url = parseLinkUrl(String(formData.get('link_url') ?? ''));
	if (link_url === undefined) return 'Bağlantı geçerli bir adres olmalı (https://… ya da /…).';

	let link_label: string | null = null;
	if (link_url) {
		link_label = String(formData.get('link_label') ?? '').trim() || null;
		if (link_label && link_label.length > LINK_LABEL_MAX)
			return `Bağlantı yazısı en çok ${LINK_LABEL_MAX} karakter olabilir.`;
	}

	const startsOn = String(formData.get('starts_on') ?? '').trim();
	if (!DAY_KEY.test(startsOn)) return 'İlk gün zorunludur.';
	const endsOn = String(formData.get('ends_on') ?? '').trim();
	if (endsOn && !DAY_KEY.test(endsOn)) return 'Son gün geçersiz.';
	if (endsOn && endsOn < startsOn) return 'Son gün ilk günden önce olamaz.';

	const published = formData.get('published') === 'true';
	const popup = formData.get('popup') === 'true';
	const popupDaysRaw = String(formData.get('popup_days') ?? '').trim();
	const popup_days = popupDaysRaw ? Number(popupDaysRaw) : POPUP_DAYS_DEFAULT;
	if (!Number.isInteger(popup_days) || popup_days < POPUP_DAYS_MIN || popup_days > POPUP_DAYS_MAX)
		return `Açılır mesaj süresi ${POPUP_DAYS_MIN}–${POPUP_DAYS_MAX} gün arasında olmalı.`;

	return {
		title,
		body,
		link_url,
		link_label,
		starts_at: istanbulDayStart(startsOn),
		// Panelde girilen son gün kapsayıcıdır, ertesi günün başlangıcı dışlayıcı sınır olur.
		ends_at: endsOn ? istanbulDayStart(addDaysToDayKey(endsOn, 1)) : null,
		published,
		popup,
		popup_days
	};
}

/** Duyuru fotoğraflarının depo klasörü: announcements/{id} — makine fotoğraflarıyla aynı bucket. */
export const announcementsFolder = (id: string) => `announcements/${id}`;
