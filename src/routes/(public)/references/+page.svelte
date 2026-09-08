<script lang="ts">
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
</script>

<Seo title={m.references_page_seo_title()} description={m.references_page_seo_description()} />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow={m.references_page_eyebrow()}
		title={m.references_page_title()}
		description={m.references_page_description()}
	/>
	{#await data.references}
		<ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each { length: 6 }, i (i)}
				<li class="rounded-md border border-border bg-card p-6">
					<Skeleton class="h-4 w-40" />
					<Skeleton class="mt-8 h-3 w-28" />
				</li>
			{/each}
		</ul>
	{:then references}
		<ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each references as reference (reference.id)}
				<li class="flex flex-col justify-between rounded-md border border-border bg-card p-6">
					<div>
						{#if reference.logoUrl}
							<div class="mb-4 flex h-14 items-center">
								<img
									src={reference.logoUrl}
									alt={m.references_page_logo_alt({ name: reference.name })}
									loading="lazy"
									class="max-h-full max-w-[70%] object-contain"
								/>
							</div>
						{/if}
						<span class="font-mono text-sm font-semibold tracking-[0.14em] uppercase">
							{reference.name}
						</span>
					</div>
					{#if reference.sector}
						<div class="mt-6">
							<span class="dim-line mb-3 w-12 text-safety" aria-hidden="true"></span>
							<p class="text-sm text-muted-foreground">{reference.sector}</p>
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/await}
</section>
