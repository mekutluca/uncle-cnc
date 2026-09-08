<script lang="ts">
	import GalleryItemForm from '$lib/components/admin/gallery-item-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<svelte:head><title>Galeri Öğesi Düzenle | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/gallery" label="Galeri" class="mb-2" />
	{#await data.item}
		<Skeleton class="mb-6 h-8 w-72" />
		<div class="grid gap-6">
			<Skeleton class="h-64 w-full" />
			<Skeleton class="h-64 w-full" />
		</div>
	{:then item}
		<h1 class="display mb-6 text-2xl">{item.description}</h1>
		{#key item.id}
			<GalleryItemForm mode="edit" {item} />
		{/key}
	{:catch}
		<Empty.Root class="py-16">
			<Empty.Header>
				<Empty.Title>Galeri öğesi bulunamadı</Empty.Title>
				<Empty.Description>Öğe silinmiş olabilir. Listeye dönüp tekrar deneyin.</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/await}
</div>
