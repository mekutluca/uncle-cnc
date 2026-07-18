<script lang="ts">
	import { page } from '$app/state';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { nav, site } from '$lib/data/site';
	import { services } from '$lib/data/services';

	let sheetOpen = $state(false);

	const isActive = (href: string) =>
		href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<header class="border-border bg-card/95 sticky top-0 z-50 border-b backdrop-blur">
	<div class="bg-safety h-0.5" aria-hidden="true"></div>
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
		<a href="/" class="flex items-center gap-3" aria-label="{site.fullName} — ana sayfa">
			<span class="crosshair text-safety shrink-0" aria-hidden="true"></span>
			<span class="leading-none">
				<span class="display block text-xl">{site.name}</span>
				<span class="text-muted-foreground mt-1 block font-mono text-[9px] uppercase tracking-[0.24em]">
					International CNC Service
				</span>
			</span>
		</a>

		<nav class="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
			{#each nav as item (item.href)}
				{#if 'children' in item && item.children}
					<div class="group relative">
						<a
							href={item.href}
							class="hover:bg-accent flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium
								{isActive(item.href) ? 'text-primary' : ''}"
							aria-current={isActive(item.href) ? 'page' : undefined}
						>
							{item.label}
						</a>
						<div
							class="invisible absolute left-0 top-full pt-2 opacity-0 transition-opacity
								group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
						>
							<div class="border-border bg-card w-64 rounded-md border p-1.5 shadow-lg">
								{#each services as service (service.slug)}
									<a
										href="/services/{service.slug}"
										class="hover:bg-accent flex items-baseline gap-3 rounded-sm px-3 py-2.5 text-sm font-medium"
									>
										<span class="text-muted-foreground font-mono text-[10px] tracking-[0.12em]">{service.code}</span>
										{service.title}
									</a>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<a
						href={item.href}
						class="hover:bg-accent flex h-9 items-center rounded-md px-3 text-sm font-medium
							{isActive(item.href) ? 'text-primary' : ''}"
						aria-current={isActive(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/if}
			{/each}
		</nav>

		<div class="flex items-center gap-2">
			<Button href="/services" class="hidden font-mono text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline-flex">
				Hizmet Talebi
			</Button>

			<Sheet.Root bind:open={sheetOpen}>
				<Sheet.Trigger class="lg:hidden">
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon" aria-label="Menüyü aç">
							<MenuIcon />
						</Button>
					{/snippet}
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-80">
					<nav class="mt-10 grid gap-1 px-4" aria-label="Mobil menü">
						{#each nav as item (item.href)}
							<a
								href={item.href}
								onclick={() => (sheetOpen = false)}
								class="hover:bg-accent rounded-md px-3 py-2.5 text-base font-medium
									{isActive(item.href) ? 'text-primary' : ''}"
							>
								{item.label}
							</a>
							{#if 'children' in item && item.children}
								<div class="mb-2 grid gap-0.5 pl-4">
									{#each services as service (service.slug)}
										<a
											href="/services/{service.slug}"
											onclick={() => (sheetOpen = false)}
											class="hover:bg-accent text-muted-foreground flex items-baseline gap-2 rounded-md px-3 py-2 text-sm"
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
