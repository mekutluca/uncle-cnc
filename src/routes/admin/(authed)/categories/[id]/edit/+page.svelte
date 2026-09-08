<script lang="ts">
	import CategoryForm from '$lib/components/admin/category-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<svelte:head><title>Kategori Düzenle | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/categories" label="Kategoriler" class="mb-2" />
	{#await data.category}
		<Skeleton class="mb-6 h-8 w-72" />
		<Skeleton class="h-48 w-full" />
	{:then category}
		<h1 class="display mb-6 text-2xl">{category.title}</h1>
		{#key category.id}
			<CategoryForm mode="edit" {category} />
		{/key}
	{:catch}
		<Empty.Root class="py-16">
			<Empty.Header>
				<Empty.Title>Kategori bulunamadı</Empty.Title>
				<Empty.Description>Kayıt silinmiş olabilir. Listeye dönüp tekrar deneyin.</Empty.Description
				>
			</Empty.Header>
		</Empty.Root>
	{/await}
</div>
