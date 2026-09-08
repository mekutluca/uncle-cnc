import type {
	Announcement,
	AnnouncementPopupWindow,
	AnnouncementState,
	AnnouncementWindow
} from '$lib/types';

/** Form ve sunucu doğrulamasının ortak sınırları (DB check kısıtlarıyla aynı). */
export const ANNOUNCEMENT_LIMITS = {
	title: 120,
	body: 1000,
	linkUrl: 500,
	linkLabel: 60,
	popupDaysMin: 1,
	popupDaysMax: 90,
	popupDaysDefault: 7
} as const;

const DAY_MS = 86_400_000;
/** Türkiye sabit UTC+3 kullanır, yaz saati yoktur. */
const TR_OFFSET = '+03:00';
const TR_ZONE = 'Europe/Istanbul';

/* ---------- Gün anahtarları (YYYY-MM-DD, İstanbul günü) ---------- */

/** Gün anahtarını o günün İstanbul'daki başlangıç anına (ISO) çevirir. */
export function istanbulDayStart(dayKey: string): string {
	return new Date(`${dayKey}T00:00:00${TR_OFFSET}`).toISOString();
}

/** Bir anın İstanbul'daki gün anahtarı. */
export function istanbulDayKey(date: Date | string | number): string {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: TR_ZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date(date));
}

export function addDaysToDayKey(dayKey: string, days: number): string {
	return istanbulDayKey(new Date(`${dayKey}T12:00:00${TR_OFFSET}`).getTime() + days * DAY_MS);
}

/** Dışlayıcı `ends_at` anından panelde gösterilen kapsayıcı son günü türetir. */
export function lastDayKey(endsAt: string): string {
	return istanbulDayKey(Date.parse(endsAt) - 1);
}

/** Gün anahtarının öğle anı: gün biçimlendirmede saat dilimi kaymasına karşı güvenli. */
const dayKeyNoon = (dayKey: string) => `${dayKey}T12:00:00${TR_OFFSET}`;

/* ---------- Yayın durumu ---------- */

export function isLive(a: AnnouncementWindow, now: number = Date.now()): boolean {
	if (!a.published) return false;
	if (Date.parse(a.starts_at) > now) return false;
	return !a.ends_at || Date.parse(a.ends_at) > now;
}

export function announcementStateOf(
	a: AnnouncementWindow,
	now: number = Date.now()
): AnnouncementState {
	if (!a.published) return 'draft';
	if (Date.parse(a.starts_at) > now) return 'scheduled';
	if (a.ends_at && Date.parse(a.ends_at) <= now) return 'ended';
	return 'live';
}

export const announcementStateLabel: Record<AnnouncementState, string> = {
	draft: 'Yayında değil',
	scheduled: 'Planlandı',
	live: 'Yayında',
	ended: 'Süresi doldu'
};

/* ---------- Açılır mesaj penceresi ---------- */

/** Açılır mesajın bittiği an (ms). Kapalıysa null. Son günü aşamaz. */
export function popupEndsAt(a: AnnouncementPopupWindow): number | null {
	if (!a.popup) return null;
	const byDays = Date.parse(a.starts_at) + a.popup_days * DAY_MS;
	return a.ends_at ? Math.min(byDays, Date.parse(a.ends_at)) : byDays;
}

export function isPopupOpen(a: AnnouncementPopupWindow, now: number = Date.now()): boolean {
	const end = popupEndsAt(a);
	return end !== null && isLive(a, now) && now < end;
}

/** Açılır mesajın kalan gün sayısı (yukarı yuvarlanır). Açık değilse 0. */
export function popupDaysLeft(a: AnnouncementPopupWindow, now: number = Date.now()): number {
	const end = popupEndsAt(a);
	if (end === null || end <= now) return 0;
	return Math.ceil((end - now) / DAY_MS);
}

/** Açılır mesaj olarak gösterilecek tek duyuru: en yeni başlangıçlı açık pencere. */
export function pickPopup<T extends AnnouncementPopupWindow & Pick<Announcement, 'created_at'>>(
	list: T[],
	now: number = Date.now()
): T | null {
	return (
		[...list]
			.sort(
				(a, b) =>
					Date.parse(b.starts_at) - Date.parse(a.starts_at) ||
					Date.parse(b.created_at) - Date.parse(a.created_at)
			)
			.find((a) => isPopupOpen(a, now)) ?? null
	);
}

/* ---------- Metin ve tarih gösterimi ---------- */

/** Boş satır paragraf açar. Tek satır sonları paragraf içinde kalır. */
export function splitParagraphs(body: string): string[] {
	return body
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);
}

/** Uzun gövdeyi kart/açılır mesaj için kısaltır: ilk paragraf, en çok `max` karakter. */
export function excerpt(body: string, max = 180): string {
	const first = splitParagraphs(body)[0] ?? '';
	if (first.length <= max) return first;
	const cut = first.slice(0, max);
	return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 20)).trimEnd()}…`;
}

/** Tarih plakası parçaları: gün ("12") ve kısa ay ("EYL"). */
export function datePlate(iso: string): { day: string; month: string } {
	const date = new Date(iso);
	return {
		day: date.toLocaleDateString('tr-TR', { day: 'numeric', timeZone: TR_ZONE }),
		month: date
			.toLocaleDateString('tr-TR', { month: 'short', timeZone: TR_ZONE })
			.replace('.', '')
			.toLocaleUpperCase('tr-TR')
	};
}

/** "12 Eylül 2026" */
export function formatDayLong(iso: string): string {
	return new Date(iso).toLocaleDateString('tr-TR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		timeZone: TR_ZONE
	});
}

/** "12 Eyl 2026" */
export function formatDayMedium(iso: string): string {
	return new Date(iso)
		.toLocaleDateString('tr-TR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			timeZone: TR_ZONE
		})
		.replace('.', '');
}

/** Gün anahtarının orta uzunlukta gösterimi ("12 Eyl 2026"). */
export function formatDayKeyMedium(dayKey: string): string {
	return formatDayMedium(dayKeyNoon(dayKey));
}

/** Kapsayıcı son günün uzun gösterimi ("15 Eylül 2026"). */
export function formatLastDayLong(endsAt: string): string {
	return formatDayLong(dayKeyNoon(lastDayKey(endsAt)));
}

/** Panel listesi: "12 Eyl 2026 · süresiz" ya da "12 Eyl 2026 · 15 Eyl 2026". */
export function formatWindow(a: Pick<Announcement, 'starts_at' | 'ends_at'>): string {
	const from = formatDayMedium(a.starts_at);
	if (!a.ends_at) return `${from} · süresiz`;
	return `${from} · ${formatDayKeyMedium(lastDayKey(a.ends_at))}`;
}
