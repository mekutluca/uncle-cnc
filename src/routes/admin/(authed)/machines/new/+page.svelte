<script lang="ts">
	import MachineForm from '$lib/components/admin/machine-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
</script>

<svelte:head><title>Yeni Makine | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<div class="mb-4">
		<BackLink href="/admin/machines" label="Makineler" />
	</div>
	<h1 class="display mb-6 text-2xl">Yeni Makine</h1>
	<MachineForm mode="create" />
</div>
