<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { formatPrice } from '$lib/utils/machine-format';

	import { fallbackToFull } from '$lib/utils/photo-fallback';

	let { data } = $props();
</script>

<Seo
	title="Satılık Ürünler"
	description="Ekspertizi yapılmış, satışa hazır ikinci el CNC tezgâhları ve diğer ekipmanlar. Kategoriye göre gruplanmış tüm ilanlarımızı inceleyin."
/>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Satılık Ürünler"
		title="Satıştaki ürünler"
		description="Tüm ürünlerin ekspertizi tarafımızca yapılmıştır. Bilgi veya teklif için ilan sayfasındaki formu kullanın. Bir ürününüzü satmak isterseniz makine ticareti formundan bize ulaşın."
	/>

	{#await Promise.all([data.machines, data.categories])}
		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each { length: 6 }, i (i)}
				<div class="flex flex-col overflow-hidden rounded-md border border-border bg-card">
					<Skeleton class="aspect-[4/3] w-full rounded-none" />
					<div class="flex flex-1 flex-col p-5">
						<Skeleton class="h-3 w-24" />
						<Skeleton class="mt-2 h-5 w-3/4" />
						<Skeleton class="mt-6 h-5 w-28" />
					</div>
				</div>
			{/each}
		</div>
	{:then [machines, categories]}
		{#if machines.length === 0}
			<div class="rounded-md border border-border bg-card p-10 text-center">
				<p class="font-mono text-sm tracking-[0.14em] uppercase">Şu anda satışta ürün yok</p>
				<p class="mt-3 text-sm text-muted-foreground">
					Aradığınız ürünü
					<a
						href="/services/machine-trading?request=buy"
						class="font-medium text-primary hover:underline"
					>
						alım talebi formuyla
					</a>
					bize iletin — uygun ürün bulunduğunda size haber verelim.
				</p>
			</div>
		{:else}
			{@const groups = categories
				.map((category) => ({
					category,
					items: machines.filter((machine) => machine.category_id === category.id)
				}))
				.filter((group) => group.items.length > 0)}
			<div class="grid gap-14">
				{#each groups as group (group.category.id)}
					<div>
						<h2 class="eyebrow mb-5">{group.category.title}</h2>
						<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{#each group.items as machine (machine.id)}
								{@const price = formatPrice(machine.price, machine.currency)}
								<a
									href="/machines/{machine.slug}"
									class="group flex flex-col overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-foreground"
								>
									{#if machine.photoUrls[0]}
										<div class="relative aspect-[4/3] overflow-hidden">
											<img
												src={machine.thumbUrls[0]}
												onerror={(e) => fallbackToFull(e, machine.photoUrls[0])}
												alt={machine.title}
												loading="lazy"
												class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
											/>
											{#if machine.status === 'sold'}
												<Badge class="absolute top-3 left-3" variant="destructive">Satıldı</Badge>
											{/if}
										</div>
									{:else}
										<Placeholder
											label={machine.machine_type}
											ratio="4/3"
											class="rounded-none border-0 border-b text-muted-foreground"
										/>
									{/if}
									<div class="flex flex-1 flex-col p-5">
										<span
											class="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase"
										>
											{machine.machine_type}
										</span>
										<h3 class="mt-2 text-lg leading-snug font-semibold">{machine.title}</h3>
										<p class="mt-auto pt-4 font-mono text-base font-semibold text-primary">
											{price ?? 'Fiyat için sorunuz'}
										</p>
									</div>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/await}
</section>
