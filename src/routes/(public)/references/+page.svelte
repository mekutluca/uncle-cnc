<script lang="ts">
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { references } from '$lib/data/references';
</script>

<Seo title="Referanslar" description="Tezgâhlarını bize emanet eden firmalar ve çalıştığımız sektörler." />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="Referanslar"
		title="Bize emanet edilen tezgâhlar"
		description="Otomotivden havacılığa farklı sektörlerden firmalar, tezgâhlarının bakımını ve servisini bize emanet ediyor."
	/>
	<ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each references as reference (reference.name)}
			<li class="border-border bg-card flex flex-col justify-between rounded-md border p-6">
				<span class="font-mono text-sm font-semibold uppercase tracking-[0.14em]">{reference.name}</span>
				{#if reference.sector}
					<div class="mt-6">
						<span class="dim-line text-safety mb-3 w-12" aria-hidden="true"></span>
						<p class="text-muted-foreground text-sm">{reference.sector}</p>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</section>
