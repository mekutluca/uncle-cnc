<script lang="ts">
	import ReferenceForm from '$lib/components/admin/reference-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
</script>

<svelte:head><title>Yeni Referans | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/references" label="Referanslar" class="mb-2" />
	<h1 class="display mb-6 text-2xl">Yeni Referans</h1>
	<ReferenceForm mode="create" />
</div>
