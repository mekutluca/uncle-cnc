<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';

	const principles = $derived([
		{
			title: m.about_principles_accuracy_title(),
			detail: m.about_principles_accuracy_detail()
		},
		{
			title: m.about_principles_reporting_title(),
			detail: m.about_principles_reporting_detail()
		},
		{
			title: m.about_principles_speed_title(),
			detail: m.about_principles_speed_detail()
		}
	]);
</script>

<Seo title={m.about_seo_title()} description={m.about_seo_description()} />

<section class="dark bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
		<p class="eyebrow mb-4 flex items-center gap-3">
			<span class="crosshair text-safety" aria-hidden="true"></span>
			{m.about_eyebrow()}
		</p>
		<h1 class="display max-w-3xl text-4xl sm:text-5xl">
			{m.about_hero_title_line1()}<br />
			<span class="text-safety">{m.about_hero_title_line2()}</span>
		</h1>
		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
			{m.about_intro({ fullName: site.fullName })}
		</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader eyebrow={m.about_principles_eyebrow()} title={m.about_principles_title()} />
	<div class="grid gap-5 md:grid-cols-3">
		{#each principles as principle, i (principle.title)}
			<div class="rounded-md border border-border bg-card p-6">
				<span class="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
					{String(i + 1).padStart(2, '0')}
				</span>
				<h2 class="display mt-3 text-xl">{principle.title}</h2>
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{principle.detail}</p>
			</div>
		{/each}
	</div>
	<div class="mt-12">
		<Button size="lg" href="/services" class="btn-label">{m.about_cta_button()}</Button>
	</div>
</section>
