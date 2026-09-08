<script lang="ts">
	import CategoryForm from '$lib/components/admin/category-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
</script>

<svelte:head><title>Yeni Kategori | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<div class="mb-4">
		<BackLink href="/admin/categories" label="Kategoriler" />
	</div>
	<h1 class="display mb-6 text-2xl">Yeni Kategori</h1>
	<CategoryForm mode="create" />
</div>
