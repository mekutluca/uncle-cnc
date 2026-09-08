import WrenchIcon from '@lucide/svelte/icons/wrench';
import TagIcon from '@lucide/svelte/icons/tag';
import ImagesIcon from '@lucide/svelte/icons/images';
import Building2Icon from '@lucide/svelte/icons/building-2';
import InboxIcon from '@lucide/svelte/icons/inbox';
import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
import ChartColumnIcon from '@lucide/svelte/icons/chart-column';
import type { AdminRoute } from '$lib/types';

/** Panel kenar çubuğu kayıtları — yeni yönetim sayfaları buraya eklenir. */
export const adminRoutes: AdminRoute[] = [
	{ href: '/admin/submissions', label: 'Talepler', icon: InboxIcon, group: 'Yönetim' },
	{ href: '/admin/announcements', label: 'Duyurular', icon: MegaphoneIcon, group: 'Yönetim' },
	{ href: '/admin/machines', label: 'Satılık Ürünler', icon: WrenchIcon, group: 'Yönetim' },
	{ href: '/admin/categories', label: 'Kategoriler', icon: TagIcon, group: 'Yönetim' },
	{ href: '/admin/gallery', label: 'Galeri', icon: ImagesIcon, group: 'Yönetim' },
	{ href: '/admin/references', label: 'Referanslar', icon: Building2Icon, group: 'Yönetim' },
	{ href: '/admin/stats', label: 'İstatistikler', icon: ChartColumnIcon, group: 'Yönetim' }
];
