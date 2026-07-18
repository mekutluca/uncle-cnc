<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { gallery } from '$lib/data/gallery';
	import { serviceBySlug } from '$lib/data/services';
</script>

<Seo title="Galeri" description="Tamamlanan bakım, revizyon, servis ve montaj işlerimizden görüntüler." />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Galeri"
		title="İşlerimizden kareler"
		description="Beğendiğiniz işin benzerini tezgâhınız için talep edebilirsiniz — görselin altındaki bağlantı sizi ilgili hizmet formuna götürür."
	/>
	<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
		{#each gallery as item, i (i)}
			{@const service = serviceBySlug(item.serviceSlug)}
			<figure class="group flex flex-col">
				<Placeholder label={item.label} class="text-muted-foreground" />
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
</section>
