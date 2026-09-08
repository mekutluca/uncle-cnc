<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { CURRENCIES } from '$lib/data/machine-options';
	import * as m from '$lib/paraglide/messages';
	import { labelClass, selectClass } from './field-styles';
</script>

<fieldset class="grid gap-4 sm:grid-cols-3">
	<legend class="eyebrow mb-3">{m.forms_price_range_legend()}</legend>
	<div class="grid gap-1.5">
		<label class={labelClass} for="fiyat_min">{m.forms_price_min_label()}</label>
		<Input
			id="fiyat_min"
			name="fiyat_min"
			type="number"
			min="0"
			dir="ltr"
			placeholder={m.forms_price_min_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="fiyat_max">{m.forms_price_max_label()}</label>
		<Input
			id="fiyat_max"
			name="fiyat_max"
			type="number"
			min="0"
			dir="ltr"
			placeholder={m.forms_price_max_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="para_birimi">{m.forms_currency_label()}</label>
		<select id="para_birimi" name="para_birimi" class={selectClass}>
			{#each CURRENCIES as currency (currency)}
				<option value={currency}>{currency}</option>
			{/each}
		</select>
	</div>
</fieldset>
