<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { formatPrice } from '$lib/utils/machine-format';
	import { localeTag } from '$lib/utils/locale-format';
	import { site } from '$lib/data/site';
	import { getLocale } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
	const machine = $derived(data.machine);
	const categoryTitle = $derived(data.categoryTitle);
	const price = $derived(formatPrice(machine.price, machine.currency, localeTag(getLocale())));
	const specEntries = $derived(Object.entries(machine.specs ?? {}));
</script>

<Seo
	title={machine.title}
	description={machine.description ?? machine.title}
	image={machine.photoUrls[0]}
/>

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
	<BackLink href="/machines" label={m.machine_detail_back_link()} />

	<div class="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
		<div class="grid gap-4">
			{#if machine.photoUrls.length === 0}
				<Placeholder label={machine.machine_type} ratio="4/3" class="text-muted-foreground" />
			{:else}
				<img
					src={machine.photoUrls[0]}
					alt={machine.title}
					class="aspect-[4/3] w-full rounded-md border border-border object-cover"
				/>
				{#if machine.photoUrls.length > 1}
					<div class="grid grid-cols-3 gap-4">
						{#each machine.photoUrls.slice(1) as url, i (url)}
							<img
								src={url}
								alt={m.machine_detail_photo_alt({ title: machine.title, index: i + 2 })}
								loading="lazy"
								class="aspect-[4/3] w-full rounded-md border border-border object-cover"
							/>
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<div>
			<div class="flex items-center gap-3">
				<span class="font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
					{#if categoryTitle}{categoryTitle} ·
					{/if}{machine.machine_type}
				</span>
				{#if machine.status === 'sold'}
					<Badge variant="destructive">{m.machine_detail_sold_badge()}</Badge>
				{/if}
			</div>
			<h1 class="display mt-3 text-3xl sm:text-4xl">{machine.title}</h1>
			<p class="mt-4 font-mono text-2xl font-semibold text-primary" dir="ltr">
				{price ?? m.machine_detail_price_fallback()}
			</p>

			{#if machine.description}
				<p class="mt-5 leading-relaxed text-muted-foreground">{machine.description}</p>
			{/if}

			{#if specEntries.length > 0}
				<div class="plate mt-7">
					<PlateHeader title={m.machine_detail_specs_title()} />
					<dl class="divide-y divide-border">
						{#each specEntries as [key, value] (key)}
							<div class="flex items-baseline justify-between gap-4 px-5 py-3">
								<dt class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
									{key}
								</dt>
								<dd class="font-mono text-sm font-medium">{value}</dd>
							</div>
						{/each}
					</dl>
				</div>
			{/if}

			{#if machine.status !== 'sold'}
				<div class="mt-7 flex flex-wrap gap-3">
					<Button
						size="lg"
						href="/services/machine-trading?request=buy&listing={machine.slug}"
						class="btn-label"
					>
						{m.machine_detail_cta()}
					</Button>
					<Button size="lg" variant="outline" href={site.phoneHref} class="btn-label" dir="ltr">
						{site.phone}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</section>
