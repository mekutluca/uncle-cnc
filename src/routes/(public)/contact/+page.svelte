<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import RequestForm from '$lib/components/forms/RequestForm.svelte';
	import ContactFields from '$lib/components/forms/ContactFields.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';
</script>

<Seo title={m.contact_page_seo_title()} description={m.contact_page_seo_description()} />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow={m.contact_page_eyebrow()}
		title={m.contact_page_title()}
		description={m.contact_page_description()}
	/>

	<div class="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
		<div class="flex flex-col gap-6">
			<div class="rounded-md border border-border bg-card p-6">
				<h2 class="eyebrow mb-4">{m.contact_page_info_heading()}</h2>
				<ul class="grid gap-3 text-sm">
					<li>
						<span class={labelClass}>{m.contact_page_phone_label()}</span>
						<a
							href={site.phoneHref}
							dir="ltr"
							class="mt-1 block font-mono text-lg font-semibold text-primary"
						>
							{site.phone}
						</a>
					</li>
					<li>
						<span class={labelClass}>{m.contact_page_email_label()}</span>
						<a href="mailto:{site.email}" dir="ltr" class="mt-1 block font-mono">{site.email}</a>
					</li>
					<li>
						<span class={labelClass}>{m.contact_page_address_label()}</span>
						<p class="mt-1">{site.address}</p>
					</li>
				</ul>
			</div>
			<iframe
				src={site.mapsEmbedUrl}
				title={m.contact_page_map_title()}
				class="min-h-64 w-full flex-1 rounded-md border border-border"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allowfullscreen
			></iframe>
		</div>

		<div class="plate h-fit">
			<PlateHeader title={m.contact_page_form_title()} code="ILT-00" />
			<RequestForm name="contact">
				<ContactFields />
				<div class="grid gap-1.5">
					<label class={labelClass} for="mesaj">{m.contact_page_message_label()}</label>
					<Textarea
						id="mesaj"
						name="mesaj"
						required
						rows={5}
						placeholder={m.contact_page_message_placeholder()}
					/>
				</div>
				<Button type="submit" size="lg" class="btn-label">{m.contact_page_submit_button()}</Button>
			</RequestForm>
		</div>
	</div>
</section>
