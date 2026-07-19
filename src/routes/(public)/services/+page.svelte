<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { services } from '$lib/data/services';
</script>

<Seo
	title="Hizmetler"
	description="Ekspertiz, danışmanlık, bakım, servis ve makine ticareti — CNC tezgâhınız için beş hizmet tek çatı altında. Talep formunu doldurun, ekibimiz size dönsün."
/>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Hizmetler / 01–05"
		title="Hizmet talebi oluşturun"
		description="Size uygun hizmeti seçin; her hizmetin sayfasında o işe özel talep formu bulunur. Formunuz doğrudan ekibimize iletilir."
	/>
	<div class="grid gap-5 lg:grid-cols-2">
		{#each services as service (service.slug)}
			<a
				href="/services/{service.slug}"
				class="group border-border bg-card hover:border-foreground flex flex-col rounded-md border p-7 transition-colors"
			>
				<div class="flex items-center justify-between">
					<span class="text-muted-foreground font-mono text-[11px] tracking-[0.18em]">FORM NO: {service.code}</span>
					<ArrowRightIcon class="text-primary size-4 transition-transform group-hover:translate-x-1" />
				</div>
				<h2 class="display mt-4 text-2xl">{service.title}</h2>
				<p class="text-muted-foreground mt-3 leading-relaxed">{service.intro}</p>
			</a>
		{/each}
	</div>
</section>
