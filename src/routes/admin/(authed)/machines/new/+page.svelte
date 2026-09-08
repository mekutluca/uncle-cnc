<script lang="ts">
	import MachineForm from '$lib/components/admin/machine-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';

	let { data } = $props();
</script>

<svelte:head><title>Yeni İlan | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<BackLink href="/admin/machines" label="Satılık Ürünler" class="mb-2" />
	<h1 class="display mb-6 text-2xl">Yeni İlan</h1>
	<MachineForm mode="create" categories={data.categories} />
</div>
