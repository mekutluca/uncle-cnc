<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { CURRENT_YEAR, MIN_MODEL_YEAR } from '$lib/data/machine-options';
	import { labelClass } from './field-styles';

	let { mode }: { mode: 'single' | 'range' } = $props();
</script>

{#if mode === 'single'}
	<div class="grid gap-1.5">
		<label class={labelClass} for="model_yili">Model Yılı</label>
		<Input
			id="model_yili"
			name="model_yili"
			type="number"
			min={MIN_MODEL_YEAR}
			max={CURRENT_YEAR}
			placeholder="Örn. 2015"
		/>
	</div>
{:else}
	<div class="grid gap-4 sm:grid-cols-2">
		<div class="grid gap-1.5">
			<label class={labelClass} for="model_yili_min">Model Yılı (En Az)</label>
			<Input
				id="model_yili_min"
				name="model_yili_min"
				type="number"
				min={MIN_MODEL_YEAR}
				max={CURRENT_YEAR}
				placeholder="Örn. 2010"
			/>
		</div>
		<div class="grid gap-1.5">
			<label class={labelClass} for="model_yili_max">Model Yılı (En Çok)</label>
			<Input
				id="model_yili_max"
				name="model_yili_max"
				type="number"
				min={MIN_MODEL_YEAR}
				max={CURRENT_YEAR}
				placeholder="Örn. 2022"
			/>
		</div>
	</div>
{/if}
