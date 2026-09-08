<script lang="ts">
	import AnnouncementForm from '$lib/components/admin/announcement-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
</script>

<svelte:head><title>Yeni Duyuru | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/announcements" label="Duyurular" class="mb-2" />
	<h1 class="display mb-6 text-2xl">Yeni Duyuru</h1>
	<AnnouncementForm mode="create" />
</div>
