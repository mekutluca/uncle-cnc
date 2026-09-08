<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { services } from '$lib/data/services';
	import * as m from '$lib/paraglide/messages';
</script>

<Seo title={m.services_page_seo_title()} description={m.services_page_seo_description()} />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow={m.services_page_eyebrow()}
		title={m.services_page_title()}
		description={m.services_page_description()}
	/>
	<div class="grid gap-5 lg:grid-cols-2">
		{#each services as service (service.slug)}
			<a
				href="/services/{service.slug}"
				class="group flex flex-col rounded-md border border-border bg-card p-7 transition-colors hover:border-foreground"
			>
				<div class="flex items-center justify-between">
					<span class="font-mono text-[11px] tracking-[0.18em] text-muted-foreground"
						>{m.services_page_form_no({ code: service.code })}</span
					>
					<ArrowRightIcon
						class="size-4 text-primary transition-transform group-hover:translate-x-1"
					/>
				</div>
				<h2 class="display mt-4 text-2xl">{service.title}</h2>
				<p class="mt-3 leading-relaxed text-muted-foreground">{service.intro}</p>
			</a>
		{/each}
	</div>
</section>
