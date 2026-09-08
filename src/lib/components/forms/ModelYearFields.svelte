<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { CURRENT_YEAR, MIN_MODEL_YEAR } from '$lib/data/machine-options';
	import * as m from '$lib/paraglide/messages';
	import { labelClass } from './field-styles';

	let { mode }: { mode: 'single' | 'range' } = $props();
</script>

{#if mode === 'single'}
	<div class="grid gap-1.5">
		<label class={labelClass} for="model_yili">{m.forms_model_year_label()}</label>
		<Input
			id="model_yili"
			name="model_yili"
			type="number"
			min={MIN_MODEL_YEAR}
			max={CURRENT_YEAR}
			dir="ltr"
			placeholder={m.forms_model_year_placeholder()}
		/>
	</div>
{:else}
	<div class="grid gap-4 sm:grid-cols-2">
		<div class="grid gap-1.5">
			<label class={labelClass} for="model_yili_min">{m.forms_model_year_min_label()}</label>
			<Input
				id="model_yili_min"
				name="model_yili_min"
				type="number"
				min={MIN_MODEL_YEAR}
				max={CURRENT_YEAR}
				dir="ltr"
				placeholder={m.forms_model_year_min_placeholder()}
			/>
		</div>
		<div class="grid gap-1.5">
			<label class={labelClass} for="model_yili_max">{m.forms_model_year_max_label()}</label>
			<Input
				id="model_yili_max"
				name="model_yili_max"
				type="number"
				min={MIN_MODEL_YEAR}
				max={CURRENT_YEAR}
				dir="ltr"
				placeholder={m.forms_model_year_max_placeholder()}
			/>
		</div>
	</div>
{/if}
