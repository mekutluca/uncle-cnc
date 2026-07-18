<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { CURRENCIES } from '$lib/data/machine-options';
	import { labelClass, selectClass } from './field-styles';
</script>

<fieldset class="grid gap-4 sm:grid-cols-3">
	<legend class="eyebrow mb-3">Fiyat Aralığı</legend>
	<div class="grid gap-1.5">
		<label class={labelClass} for="fiyat_min">En Az</label>
		<Input id="fiyat_min" name="fiyat_min" type="number" min="0" placeholder="Örn. 50.000" />
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="fiyat_max">En Çok</label>
		<Input id="fiyat_max" name="fiyat_max" type="number" min="0" placeholder="Örn. 150.000" />
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="para_birimi">Para Birimi</label>
		<select id="para_birimi" name="para_birimi" class={selectClass}>
			{#each CURRENCIES as currency (currency)}
				<option value={currency}>{currency}</option>
			{/each}
		</select>
	</div>
</fieldset>
