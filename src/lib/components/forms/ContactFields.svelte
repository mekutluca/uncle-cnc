<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as m from '$lib/paraglide/messages';
	import { labelClass } from './field-styles';
</script>

<fieldset class="grid gap-4 sm:grid-cols-2">
	<legend class="eyebrow mb-3">{m.forms_contact_legend()}</legend>
	<div class="grid gap-1.5">
		<label class={labelClass} for="ad_soyad">{m.forms_contact_name_label()}</label>
		<Input
			id="ad_soyad"
			name="ad_soyad"
			required
			autocomplete="name"
			placeholder={m.forms_contact_name_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="firma">{m.forms_contact_company_label()}</label>
		<Input
			id="firma"
			name="firma"
			autocomplete="organization"
			placeholder={m.forms_contact_company_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="telefon">{m.forms_contact_phone_label()}</label>
		<Input
			id="telefon"
			name="telefon"
			type="tel"
			required
			autocomplete="tel"
			dir="ltr"
			placeholder={m.forms_contact_phone_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="eposta">{m.forms_contact_email_label()}</label>
		<Input
			id="eposta"
			name="eposta"
			type="email"
			required
			autocomplete="email"
			dir="ltr"
			placeholder={m.forms_contact_email_placeholder()}
		/>
	</div>
	<div class="grid gap-1.5 sm:col-span-2">
		<label class={labelClass} for="adres">{m.forms_contact_address_label()}</label>
		<Input
			id="adres"
			name="adres"
			autocomplete="street-address"
			placeholder={m.forms_contact_address_placeholder()}
		/>
	</div>
</fieldset>
