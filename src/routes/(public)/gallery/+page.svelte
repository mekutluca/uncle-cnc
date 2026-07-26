<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { serviceBySlug } from '$lib/data/services';

	let { data } = $props();
</script>

<Seo title="Galeri" description="Tamamlanan bakım, revizyon, servis ve montaj işlerimizden görüntüler." />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Galeri"
		title="İşlerimizden kareler"
		description="Beğendiğiniz işin benzerini tezgâhınız için talep edebilirsiniz — görselin altındaki bağlantı sizi ilgili hizmet formuna götürür."
	/>
	{#await data.items}
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each { length: 8 }, i (i)}
				<div class="flex flex-col">
					<Skeleton class="aspect-[4/3] w-full" />
					<Skeleton class="mt-3 h-4 w-4/5" />
					<Skeleton class="mt-2 h-3 w-3/5" />
				</div>
			{/each}
		</div>
	{:then items}
		<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each items as item (item.id)}
				{@const service = item.service_slug ? serviceBySlug(item.service_slug) : undefined}
				<figure class="group flex flex-col">
					{#if item.photoUrl}
						<div class="border-border relative aspect-[4/3] overflow-hidden rounded-md border">
							<img
								src={item.photoUrl}
								alt={item.description}
								loading="lazy"
								class="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
							/>
							<span
								class="bg-background/85 absolute bottom-2 left-2 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
							>
								{item.label}
							</span>
						</div>
					{:else}
						<Placeholder label={item.label} class="text-muted-foreground" />
					{/if}
					<figcaption class="mt-3">
						<p class="text-sm font-medium">{item.description}</p>
						{#if service}
							<a
								href="/services/{service.slug}"
								class="text-primary mt-1.5 inline-flex items-center gap-1.5 btn-label"
							>
								{service.title} talebi oluştur
								<ArrowRightIcon class="size-3 transition-transform group-hover:translate-x-0.5" />
							</a>
						{/if}
					</figcaption>
				</figure>
			{/each}
		</div>
	{/await}
</section>
