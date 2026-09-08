import { json } from '@sveltejs/kit';
import { listAnnouncements, withAnnouncementUrls } from '$lib/server/supabase';
import { pickPopup } from '$lib/utils/announcements';
import type { PopupAnnouncement } from '$lib/types';
import type { RequestHandler } from './$types';

export const prerender = false;

/** Ziyaretçiye açılır mesaj olarak gösterilecek tek duyuru (yoksa null).
 * Prerender edilmiş sayfalar da tarayıcıdan bu ucu çağırır. */
export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({ 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
	const picked = pickPopup(await listAnnouncements());
	if (!picked) return json(null);
	const { id, title, body, link_url, link_label, starts_at, photoUrl, thumbUrl } =
		withAnnouncementUrls(picked);
	const payload: PopupAnnouncement = {
		id,
		title,
		body,
		link_url,
		link_label,
		starts_at,
		photoUrl,
		thumbUrl
	};
	return json(payload);
};
