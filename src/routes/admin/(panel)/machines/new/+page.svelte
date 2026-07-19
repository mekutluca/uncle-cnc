<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import MachineForm from '$lib/components/admin/machine-form.svelte';
</script>

<svelte:head><title>Yeni Makine | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<a
		href="/admin/machines"
		class="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors"
	>
		<ArrowLeftIcon class="size-3.5" />
		Makineler
	</a>
	<h1 class="display mb-6 text-2xl">Yeni Makine</h1>
	<MachineForm mode="create" />
</div>
