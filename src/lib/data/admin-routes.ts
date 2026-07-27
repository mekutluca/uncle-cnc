import WrenchIcon from '@lucide/svelte/icons/wrench';
import ImagesIcon from '@lucide/svelte/icons/images';
import Building2Icon from '@lucide/svelte/icons/building-2';
import type { AdminRoute } from '$lib/types';

/** Panel kenar çubuğu kayıtları — yeni yönetim sayfaları buraya eklenir. */
export const adminRoutes: AdminRoute[] = [
	{ href: '/admin/machines', label: 'Makineler', icon: WrenchIcon, group: 'Yönetim' },
	{ href: '/admin/gallery', label: 'Galeri', icon: ImagesIcon, group: 'Yönetim' },
	{ href: '/admin/references', label: 'Referanslar', icon: Building2Icon, group: 'Yönetim' }
];
