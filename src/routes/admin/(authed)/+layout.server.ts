import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.session) redirect(303, '/admin/login');

	// Paylaşılan Supabase projesinde oturum açmış olmak yetmez: yazma izinleri
	// uc_admins üyeliğine bağlıdır. Üye olmayan bir hesap panele girebilseydi
	// tüm yazma işlemleri RLS'te sessizce boşa düşerdi (0 satır, hata yok).
	const { data: isAdmin } = await locals.supabase.rpc('uc_is_admin');
	if (!isAdmin) error(403, 'Bu hesap yönetim paneline yetkili değil.');
};
