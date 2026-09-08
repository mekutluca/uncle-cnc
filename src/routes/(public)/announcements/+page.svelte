<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import AnnouncementLane from '$lib/components/site/AnnouncementLane.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();
</script>

<Seo
	title="Duyurular"
	description="Uncle CNC'den stok, kapanış ve hizmet duyuruları. Yeni gelen makineler ve atölye haberleri."
/>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Duyurular"
		title="Atölyeden haberler"
		description="Stoğa giren makineler, kapalı olduğumuz günler ve yeni hizmetler. Yenisi geldikçe burada."
	/>
	{#await data.announcements}
		<div class="grid gap-5">
			{#each { length: 3 }, i (i)}
				<div class="flex overflow-hidden rounded-md border border-border bg-card">
					<div class="w-16 border-e border-border bg-secondary sm:w-20"></div>
					<div class="flex-1 p-6">
						<Skeleton class="h-6 w-2/3" />
						<Skeleton class="mt-4 h-4 w-full" />
						<Skeleton class="mt-2 h-4 w-5/6" />
					</div>
				</div>
			{/each}
		</div>
	{:then announcements}
		{#if announcements.length === 0}
			<div class="rounded-md border border-dashed border-border bg-card px-6 py-16 text-center">
				<span class="crosshair mx-auto block text-safety" aria-hidden="true"></span>
				<p class="display mt-5 text-xl">Şu an duyuru yok</p>
				<p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
					Stok ve atölye haberleri burada yayınlanır. Tezgâhınızla ilgili bir ihtiyacınız varsa
					hizmet talebi oluşturun ya da bizi arayın:
					<a href={site.phoneHref} class="font-mono text-foreground hover:underline">{site.phone}</a
					>
				</p>
				<div class="mt-6">
					<Button href="/services" class="btn-label">Hizmet Talebi Oluştur</Button>
				</div>
			</div>
		{:else}
			<div class="grid gap-5">
				{#each announcements as announcement (announcement.id)}
					<AnnouncementLane {announcement} />
				{/each}
			</div>
		{/if}
	{/await}
</section>
