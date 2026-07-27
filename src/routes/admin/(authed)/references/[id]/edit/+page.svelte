<script lang="ts">
	import ReferenceForm from '$lib/components/admin/reference-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<svelte:head><title>Referans Düzenle | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	{#await data.reference}
		<div class="mb-4">
			<BackLink href="/admin/references" label="Referanslar" />
		</div>
		<Skeleton class="mb-6 h-8 w-72" />
		<div class="grid gap-6">
			<Skeleton class="h-48 w-full" />
			<Skeleton class="h-64 w-full" />
		</div>
	{:then reference}
		<div class="mb-4">
			<BackLink href="/admin/references" label="Referanslar" />
		</div>
		<h1 class="display mb-6 text-2xl">{reference.name}</h1>
		{#key reference.id}
			<ReferenceForm mode="edit" {reference} />
		{/key}
	{:catch}
		<div class="mb-4">
			<BackLink href="/admin/references" label="Referanslar" />
		</div>
		<Empty.Root class="py-16">
			<Empty.Header>
				<Empty.Title>Referans bulunamadı</Empty.Title>
				<Empty.Description>Kayıt silinmiş olabilir. Listeye dönüp tekrar deneyin.</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/await}
</div>
