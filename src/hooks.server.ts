import { createServerClient } from '@supabase/ssr';
import { type Handle, type HandleServerError, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { defaultErrorMessage } from '$lib/utils/errors';

/** Supabase oturum istemcisi yalnızca /admin alt ağacı için kurulur. Halka açık
 *  (prerender edilen) sayfalar ve /machines SSR'ı bu hook'tan etkilenmez. */
const supabase: Handle = async ({ event, resolve }) => {
	if (!event.route.id?.startsWith('/admin')) return resolve(event);

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) return { session: null, user: null };

		// getUser JWT'yi Supabase'e doğrulatır. Sahte çerezle oturum açılamaz.
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) return { session: null, user: null };

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const routeId = event.route.id;
	if (!routeId?.startsWith('/admin')) return resolve(event);

	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	if (routeId.startsWith('/admin/(authed)') && !session) redirect(303, '/admin/login');
	if (routeId.startsWith('/admin/login') && session) redirect(303, '/admin');

	return resolve(event);
};

export const handle = sequence(supabase, authGuard);

// Yalnızca beklenmeyen hatalar (fırlatılan istisnalar, eşleşmeyen rotalar) buraya
// düşer. `error()` çağrıları kendi Türkçe mesajını korur. Gerçek hata sunucu
// logunda kalır, tarayıcıya genel mesaj gider: yığın izi ve Supabase ayrıntıları
// hata sayfasına ulaşmaz.
export const handleError: HandleServerError = ({ error, event, status, message }) => {
	if (status !== 404) {
		console.error(`[${status}] ${event.request.method} ${event.url.pathname}: ${message}`, error);
	}
	return { message: defaultErrorMessage(status) };
};
