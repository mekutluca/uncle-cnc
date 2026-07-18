<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { labelClass } from './field-styles';
</script>

<fieldset class="grid gap-4 sm:grid-cols-2">
	<legend class="eyebrow mb-3">İletişim Bilgileri</legend>
	<div class="grid gap-1.5">
		<label class={labelClass} for="ad_soyad">Ad Soyad *</label>
		<Input id="ad_soyad" name="ad_soyad" required autocomplete="name" placeholder="Adınız Soyadınız" />
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="firma">Firma</label>
		<Input id="firma" name="firma" autocomplete="organization" placeholder="Firma adı" />
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="telefon">Telefon *</label>
		<Input
			id="telefon"
			name="telefon"
			type="tel"
			required
			autocomplete="tel"
			placeholder="05xx xxx xx xx"
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="eposta">E-posta *</label>
		<Input
			id="eposta"
			name="eposta"
			type="email"
			required
			autocomplete="email"
			placeholder="ornek@firma.com"
		/>
	</div>
	<div class="grid gap-1.5 sm:col-span-2">
		<label class={labelClass} for="adres">Adres</label>
		<Input id="adres" name="adres" autocomplete="street-address" placeholder="İl / ilçe / adres" />
	</div>
</fieldset>
