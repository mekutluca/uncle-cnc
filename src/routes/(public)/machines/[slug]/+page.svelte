<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { formatPrice } from '$lib/utils/machine-format';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const machine = $derived(data.machine);
	const price = $derived(formatPrice(machine.price, machine.currency));
	const specEntries = $derived(Object.entries(machine.specs ?? {}));
</script>

<Seo title={machine.title} description={machine.description ?? machine.title} image={machine.photoUrls[0]} />

<section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
	<BackLink href="/machines" label="Tüm ilanlar" />

	<div class="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
		<div class="grid gap-4">
			{#if machine.photoUrls.length === 0}
				<Placeholder label={machine.machine_type} ratio="4/3" class="text-muted-foreground" />
			{:else}
				<img
					src={machine.photoUrls[0]}
					alt={machine.title}
					class="border-border aspect-[4/3] w-full rounded-md border object-cover"
				/>
				{#if machine.photoUrls.length > 1}
					<div class="grid grid-cols-3 gap-4">
						{#each machine.photoUrls.slice(1) as url, i (url)}
							<img
								src={url}
								alt="{machine.title} — fotoğraf {i + 2}"
								loading="lazy"
								class="border-border aspect-[4/3] w-full rounded-md border object-cover"
							/>
						{/each}
					</div>
				{/if}
			{/if}
		</div>

		<div>
			<div class="flex items-center gap-3">
				<span class="text-muted-foreground font-mono text-[11px] uppercase tracking-[0.16em]">
					{machine.machine_type}
				</span>
				{#if machine.status === 'sold'}
					<Badge variant="destructive">Satıldı</Badge>
				{/if}
			</div>
			<h1 class="display mt-3 text-3xl sm:text-4xl">{machine.title}</h1>
			<p class="text-primary mt-4 font-mono text-2xl font-semibold">{price ?? 'Fiyat için sorunuz'}</p>

			{#if machine.description}
				<p class="text-muted-foreground mt-5 leading-relaxed">{machine.description}</p>
			{/if}

			{#if specEntries.length > 0}
				<div class="plate mt-7">
					<PlateHeader title="Teknik Özellikler" />
					<dl class="divide-border divide-y">
						{#each specEntries as [key, value] (key)}
							<div class="flex items-baseline justify-between gap-4 px-5 py-3">
								<dt class="text-muted-foreground font-mono text-[11px] uppercase tracking-[0.14em]">{key}</dt>
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
						Bilgi / Teklif İste
					</Button>
					<Button
						size="lg"
						variant="outline"
						href={site.phoneHref}
						class="btn-label"
					>
						{site.phone}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</section>
