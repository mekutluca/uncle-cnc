<script lang="ts">
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import MachineForm from '$lib/components/admin/machine-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<svelte:head><title>İlan Düzenle | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/machines" label="Satılık Ürünler" class="mb-2" />
	{#await data.machine}
		<Skeleton class="mb-6 h-8 w-72" />
		<div class="grid gap-6">
			<Skeleton class="h-96 w-full" />
			<Skeleton class="h-40 w-full" />
			<Skeleton class="h-48 w-full" />
		</div>
	{:then machine}
		<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
			<h1 class="display text-2xl">{machine.title}</h1>
			{#if machine.status !== 'hidden'}
				<Button
					variant="outline"
					size="sm"
					href="/machines/{machine.slug}"
					target="_blank"
					class="btn-label"
				>
					<ExternalLinkIcon class="size-3.5" />
					İlanı Gör
				</Button>
			{/if}
		</div>
		{#key machine.id}
			<MachineForm mode="edit" {machine} categories={data.categories} />
		{/key}
	{:catch}
		<Empty.Root class="py-16">
			<Empty.Header>
				<Empty.Title>İlan bulunamadı</Empty.Title>
				<Empty.Description>İlan silinmiş olabilir. Listeye dönüp tekrar deneyin.</Empty.Description>
			</Empty.Header>
		</Empty.Root>
	{/await}
</div>
