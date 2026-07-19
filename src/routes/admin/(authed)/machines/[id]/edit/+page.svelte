<script lang="ts">
	import ExternalLinkIcon from '@lucide/svelte/icons/external-link';
	import MachineForm from '$lib/components/admin/machine-form.svelte';
	import BackLink from '$lib/components/site/BackLink.svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<svelte:head><title>{data.machine.title} | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<div class="mb-4 flex items-center justify-between">
		<BackLink href="/admin/machines" label="Makineler" />
		{#if data.machine.status !== 'hidden'}
			<Button
				variant="outline"
				size="sm"
				href="/machines/{data.machine.slug}"
				target="_blank"
				class="btn-label"
			>
				<ExternalLinkIcon class="size-3.5" />
				İlanı Gör
			</Button>
		{/if}
	</div>
	<h1 class="display mb-6 text-2xl">{data.machine.title}</h1>
	{#key data.machine.id}
		<MachineForm mode="edit" machine={data.machine} />
	{/key}
</div>
