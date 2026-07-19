<script lang="ts">
	import MenuIcon from '@lucide/svelte/icons/menu';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import { onMount } from 'svelte';
	import { goto, invalidate, afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { adminRoutes } from '$lib/data/admin-routes';
	import type { AdminRoute } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';
	import { site } from '$lib/data/site';

	let { children, data } = $props();
	let { supabase, session } = $derived(data);

	let mobileOpen = $state(false);
	let mainEl = $state<HTMLElement | null>(null);

	async function logout() {
		await supabase.auth.signOut();
	}

	onMount(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange(async (_, newSession) => {
			if (newSession === null) {
				await goto('/admin/login');
			}

			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	});

	afterNavigate((navigation) => {
		mobileOpen = false;
		// İçerik iç içe overflow-auto <main> içinde kayıyor; gezinmede sıfırla.
		if (mainEl && navigation.from?.url.pathname !== navigation.to?.url.pathname) {
			mainEl.scrollTop = 0;
		}
	});

	function groupRoutes(routes: AdminRoute[]): Record<string, AdminRoute[]> {
		return routes.reduce(
			(groups, route) => {
				(groups[route.group] ??= []).push(route);
				return groups;
			},
			{} as Record<string, AdminRoute[]>
		);
	}

	let groupedRoutes = $derived(groupRoutes(adminRoutes));

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}
</script>

{#snippet nav()}
	{#each Object.entries(groupedRoutes) as [groupName, routes], groupIndex (groupName)}
		{#if groupIndex > 0}
			<Separator class="my-3" />
		{/if}
		<p class="eyebrow mb-2 px-3">{groupName}</p>
		<ul class="space-y-1">
			{#each routes as route (route.href)}
				<li>
					<a
						href={route.href}
						class={cn(
							'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
							isActive(route.href)
								? 'bg-accent font-medium text-accent-foreground'
								: 'text-foreground hover:bg-muted'
						)}
					>
						<route.icon size={16} />
						<span class="flex-1">{route.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/each}
{/snippet}

<div class="fixed inset-0 flex flex-col">
	<header class="bg-card flex h-14 flex-none items-center border-b px-4">
		<div class="bg-safety absolute inset-x-0 top-0 h-0.5" aria-hidden="true"></div>
		<div class="flex-none lg:hidden">
			<Button variant="ghost" size="icon" onclick={() => (mobileOpen = true)} aria-label="Menü">
				<MenuIcon class="size-5" />
			</Button>
		</div>
		<div class="flex-1">
			<a class="flex items-center gap-3 px-2" href="/admin">
				<span class="crosshair text-safety shrink-0" aria-hidden="true"></span>
				<span class="leading-none">
					<span class="display block text-base">{site.name}</span>
					<span class="text-muted-foreground mt-0.5 block font-mono text-[8px] uppercase tracking-[0.24em]">
						Yönetim Paneli
					</span>
				</span>
			</a>
		</div>
		<div class="flex flex-none items-center gap-1">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="ghost" size="icon" aria-label="Menü" {...props}>
							<EllipsisIcon class="size-5" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item onclick={() => window.open('/', '_blank')}>
						<ExternalLinkIcon size={14} />
						Siteyi Görüntüle
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={logout}>
						<LogOutIcon size={14} />
						Çıkış Yap
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<div class="flex flex-1 overflow-hidden">
		<aside class="bg-card hidden w-64 flex-col border-e p-4 lg:flex">
			<nav class="flex-1">
				{@render nav()}
			</nav>
			<p class="text-muted-foreground mt-auto font-mono text-[10px] tracking-[0.14em]">
				REV {__APP_VERSION__}
			</p>
		</aside>

		<Sheet.Root bind:open={mobileOpen}>
			<Sheet.Content side="left" class="w-64 p-4">
				<Sheet.Header class="sr-only">
					<Sheet.Title>Menü</Sheet.Title>
					<Sheet.Description>Gezinme menüsü</Sheet.Description>
				</Sheet.Header>
				<nav class="mt-4 flex-1">
					{@render nav()}
				</nav>
				<p class="text-muted-foreground font-mono text-[10px] tracking-[0.14em]">
					REV {__APP_VERSION__}
				</p>
			</Sheet.Content>
		</Sheet.Root>

		<main bind:this={mainEl} class="bg-muted/30 flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
