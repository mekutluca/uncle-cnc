<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { formatPrice } from '$lib/utils/machine-format';

	let { data } = $props();
</script>

<Seo
	title="Satılık Makineler"
	description="Ekspertizi yapılmış, çalışır durumda ikinci el CNC tezgâhları: dik işleme, torna, 5 eksen ve daha fazlası."
/>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Satılık Makineler"
		title="Satıştaki tezgâhlar"
		description="Tüm makinelerin ekspertizi tarafımızca yapılmıştır. Bilgi veya teklif için ilan sayfasındaki formu kullanın; makinenizi satmak isterseniz makine ticareti formundan bize ulaşın."
	/>

	{#if data.machines.length === 0}
		<div class="border-border bg-card rounded-md border p-10 text-center">
			<p class="font-mono text-sm uppercase tracking-[0.14em]">Şu anda satışta makine yok</p>
			<p class="text-muted-foreground mt-3 text-sm">
				Aradığınız makineyi
				<a href="/services/machine-trading?request=buy" class="text-primary font-medium hover:underline">
					alım talebi formuyla
				</a>
				bize iletin — uygun makine bulunduğunda size haber verelim.
			</p>
		</div>
	{:else}
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.machines as machine (machine.id)}
				{@const price = formatPrice(machine.price, machine.currency)}
				<a
					href="/machines/{machine.slug}"
					class="group border-border bg-card hover:border-foreground flex flex-col overflow-hidden rounded-md border transition-colors"
				>
					{#if machine.photoUrls[0]}
						<div class="relative aspect-[4/3] overflow-hidden">
							<img
								src={machine.photoUrls[0]}
								alt={machine.title}
								loading="lazy"
								class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
							/>
							{#if machine.status === 'sold'}
								<Badge class="absolute left-3 top-3" variant="destructive">Satıldı</Badge>
							{/if}
						</div>
					{:else}
						<Placeholder label={machine.machine_type} ratio="4/3" class="text-muted-foreground rounded-none border-0 border-b" />
					{/if}
					<div class="flex flex-1 flex-col p-5">
						<span class="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.16em]">
							{machine.machine_type}
						</span>
						<h2 class="mt-2 text-lg font-semibold leading-snug">{machine.title}</h2>
						<p class="text-primary mt-auto pt-4 font-mono text-base font-semibold">
							{price ?? 'Fiyat için sorunuz'}
						</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>
