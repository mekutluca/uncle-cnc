<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { Service } from '$lib/types';
	import ContactFields from './ContactFields.svelte';
	import MachineTypeSizeFields from './MachineTypeSizeFields.svelte';
	import ModelYearFields from './ModelYearFields.svelte';
	import NetlifyForm from './NetlifyForm.svelte';
	import PhotoUploadField from './PhotoUploadField.svelte';
	import PriceRangeFields from './PriceRangeFields.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { labelClass } from './field-styles';

	let { service }: { service: Service } = $props();

	const isTrading = $derived(service.fields.modelYear === 'range-by-intent');

	let intent = $state<'almak' | 'satmak'>('almak');
	let relatedListing = $state('');

	// Sayfa prerender edildiği için query parametreleri yalnızca tarayıcıda okunur:
	// /services/machine-trading?request=buy|sell&listing=<slug>
	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const request = params.get('request');
		if (request === 'sell') intent = 'satmak';
		relatedListing = params.get('listing') ?? '';
	});

	const showPhotos = $derived(
		service.fields.photos === true || (service.fields.photos === 'sell-only' && intent === 'satmak')
	);

	const hasUpload = $derived(service.fields.photos !== false);
</script>

<div class="plate">
	<PlateHeader title="Talep Formu" code={service.code} />

	<NetlifyForm name={service.formName} upload={hasUpload}>
		{#if isTrading}
			<fieldset>
				<legend class="eyebrow mb-3">İşlem Türü</legend>
				<div class="grid grid-cols-2 gap-2" role="radiogroup" aria-label="İşlem türü">
					{#each [{ value: 'almak', label: 'Almak istiyorum' }, { value: 'satmak', label: 'Satmak istiyorum' }] as option (option.value)}
						<label
							class="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-md border font-mono text-[12px] font-medium uppercase tracking-[0.12em] transition-colors
								{intent === option.value
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-input bg-card hover:bg-accent'}"
						>
							<input
								type="radio"
								name="islem_turu"
								value={option.value}
								bind:group={intent}
								class="sr-only"
							/>
							{option.label}
						</label>
					{/each}
				</div>
			</fieldset>
		{/if}

		{#if relatedListing}
			<input type="hidden" name="ilgili_ilan" value={relatedListing} />
			<p class="border-safety bg-safety/10 rounded-md border-l-2 px-3 py-2 text-sm">
				İlgilendiğiniz ilan: <span class="font-mono">{relatedListing}</span>
			</p>
		{/if}

		<ContactFields />

		{#if service.fields.machine}
			<MachineTypeSizeFields
				legend={isTrading ? (intent === 'almak' ? 'İstenen Makine' : 'Satılacak Makine') : 'Makine Bilgileri'}
			/>
		{/if}

		{#if service.fields.modelYear === 'single'}
			<ModelYearFields mode="single" />
		{:else if isTrading}
			<ModelYearFields mode={intent === 'almak' ? 'range' : 'single'} />
		{/if}

		{#if service.fields.priceRange}
			<PriceRangeFields />
		{/if}

		{#if service.fields.faultDescription}
			<div class="grid gap-1.5">
				<label class={labelClass} for="ariza_tanimi">Arıza Tanımı *</label>
				<Textarea
					id="ariza_tanimi"
					name="ariza_tanimi"
					required
					rows={4}
					placeholder="Alarm numarası, arızanın nasıl oluştuğu ve gözlemleriniz…"
				/>
			</div>
		{/if}

		{#if showPhotos}
			<PhotoUploadField />
		{/if}

		<div class="grid gap-1.5">
			<label class={labelClass} for="notlar">Belirtmek İstediğiniz Diğer Hususlar</label>
			<Textarea id="notlar" name="notlar" rows={3} placeholder="Eklemek istedikleriniz…" />
		</div>

		<Button
			type="submit"
			size="lg"
			class="btn-label"
		>
			Talebi Gönder
		</Button>
		<p class="text-muted-foreground text-xs">
			* işaretli alanlar zorunludur. Talebiniz doğrudan ekibimize iletilir; en kısa sürede size dönüş yapılır.
		</p>
	</NetlifyForm>
</div>
