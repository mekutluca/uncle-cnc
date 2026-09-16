<script lang="ts">
	import { page } from '$app/state';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import logoLockup from '$lib/assets/logo-lockup.png';
	import LanguageSwitcher from './LanguageSwitcher.svelte';
	import * as m from '$lib/paraglide/messages';
	import { nav, site } from '$lib/data/site';
	import { services } from '$lib/data/services';

	let sheetOpen = $state(false);

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
	<div class="h-0.5 bg-safety" aria-hidden="true"></div>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
		<a href="/" aria-label="{site.fullName} {m.header_home_aria_suffix()}">
			<img src={logoLockup} alt="" class="h-10 w-auto rounded-md sm:h-11" />
		</a>

		<nav class="hidden items-center gap-1 lg:flex" aria-label={m.header_nav_main_aria()}>
			{#each nav.filter((item) => item.href !== '/') as item (item.href)}
				{#if 'children' in item && item.children}
					<div class="group relative">
						<a
							href={item.href}
							class="flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium hover:bg-accent
								{isActive(item.href) ? 'text-primary' : ''}"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
						<div
							class="invisible absolute start-0 top-full pt-2 opacity-0 transition-opacity
								group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
						>
							<div class="w-64 rounded-md border border-border bg-card p-1.5 shadow-lg">
								{#each services as service (service.slug)}
									<a
										href="/services/{service.slug}"
										class="flex items-baseline gap-3 rounded-sm px-3 py-2.5 text-sm font-medium hover:bg-accent"
									>
										<span class="font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
											>{service.code}</span
										>
										{service.title}
									</a>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<a
						href={item.href}
						class="flex h-9 items-center rounded-md px-3 text-sm font-medium hover:bg-accent
							{isActive(item.href) ? 'text-primary' : ''}"
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/if}
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<LanguageSwitcher />

			<Button href="/services" class="btn-label hidden sm:inline-flex"
				>{m.header_request_service()}</Button
			>

			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger class="lg:hidden">
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon" aria-label={m.header_menu_open_aria()}>
							<MenuIcon />
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-80">
					<nav class="mt-10 grid gap-1 px-4" aria-label={m.header_nav_mobile_aria()}>
						{#each nav as item (item.href)}
							<a
								href={item.href}
								onclick={() => (sheetOpen = false)}
								class="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent
									{isActive(item.href) ? 'text-primary' : ''}"
							>
								{item.label}
							</a>
							{#if 'children' in item && item.children}
								<div class="mb-2 grid gap-0.5 ps-4">
									{#each services as service (service.slug)}
										<a
											href="/services/{service.slug}"
											onclick={() => (sheetOpen = false)}
											class="flex items-baseline gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
										>
											<span class="font-mono text-[10px] tracking-[0.12em]">{service.code}</span>
											{service.title}
										</a>
									{/each}
								</div>
							{/if}
						{/each}
					</nav>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>
</header>
