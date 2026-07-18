<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { MACHINE_TYPES, SIZE_OPTIONS, type MachineType } from '$lib/data/machine-options';
	import { labelClass, selectClass } from './field-styles';

	let { legend = 'Makine Bilgileri' }: { legend?: string } = $props();

	let machineType = $state<MachineType | ''>('');
	const sizeMode = $derived(machineType === '' ? null : SIZE_OPTIONS[machineType]);
</script>

<fieldset class="grid gap-4 sm:grid-cols-2">
	<legend class="eyebrow mb-3">{legend}</legend>
	<div class="grid gap-1.5">
		<label class={labelClass} for="makine_cinsi">Makine Cinsi *</label>
		<select id="makine_cinsi" name="makine_cinsi" required class={selectClass} bind:value={machineType}>
			<option value="" disabled>Seçiniz</option>
			{#each MACHINE_TYPES as type (type)}
				<option value={type}>{type}</option>
			{/each}
		</select>
	</div>
	{#if sizeMode !== null}
		<div class="grid gap-1.5">
			<label class={labelClass} for="makine_boyutu">Makine Boyutu</label>
			{#if sizeMode === 'text'}
				<Input id="makine_boyutu" name="makine_boyutu" placeholder="Örn. tabla / iş boyutu (mm)" />
			{:else}
				<select id="makine_boyutu" name="makine_boyutu" class={selectClass}>
					<option value="" selected>Seçiniz</option>
					{#each sizeMode as size (size)}
						<option value={size}>{size}</option>
					{/each}
				</select>
			{/if}
		</div>
	{/if}
</fieldset>
