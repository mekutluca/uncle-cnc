<script lang="ts">
	import AnnouncementForm from '$lib/components/admin/announcement-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();
</script>

<svelte:head><title>Duyuru Düzenle | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/announcements" label="Duyurular" class="mb-2" />
	{#await data.announcement}
		<Skeleton class="mb-6 h-8 w-72" />
		<div class="grid gap-6">
			<Skeleton class="h-64 w-full" />
			<Skeleton class="h-48 w-full" />
			<Skeleton class="h-48 w-full" />
		</div>
	{:then announcement}
		<h1 class="display mb-6 text-2xl">{announcement.title}</h1>
		{#key announcement.id}
			<AnnouncementForm mode="edit" {announcement} />
		{/key}
	{:catch}
		<Empty.Root class="py-16">
			<Empty.Header>
				<Empty.Title>Duyuru bulunamadı</Empty.Title>
				<Empty.Description
					>Duyuru silinmiş olabilir. Listeye dönüp tekrar deneyin.</Empty.Description
				>
			</Empty.Header>
		</Empty.Root>
	{/await}
</div>
