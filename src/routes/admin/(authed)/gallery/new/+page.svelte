<script lang="ts">
	import GalleryItemForm from '$lib/components/admin/gallery-item-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
</script>

<svelte:head><title>Yeni Galeri Öğesi | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<div class="mb-4">
		<BackLink href="/admin/gallery" label="Galeri" />
	</div>
	<h1 class="display mb-6 text-2xl">Yeni Galeri Öğesi</h1>
	<GalleryItemForm mode="create" />
</div>
