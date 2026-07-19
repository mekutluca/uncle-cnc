import WrenchIcon from '@lucide/svelte/icons/wrench';
import type { AdminRoute } from '$lib/types';

/** Panel kenar çubuğu kayıtları — yeni yönetim sayfaları buraya eklenir. */
export const adminRoutes: AdminRoute[] = [
	{ href: '/admin/machines', label: 'Makineler', icon: WrenchIcon, group: 'Yönetim' }
];
