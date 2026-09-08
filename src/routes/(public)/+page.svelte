<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import HeroDrawing from '$lib/components/site/HeroDrawing.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import AnnouncementLane from '$lib/components/site/AnnouncementLane.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { services } from '$lib/data/services';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const galleryLabels = $derived([
		m.home_gallery_label_revision(),
		m.home_gallery_label_maintenance(),
		m.home_gallery_label_service(),
		m.home_gallery_label_installation()
	]);
</script>

<Seo />

<!-- HERO -->
<section class="dark relative overflow-hidden bg-background text-foreground">
	<div
		class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24"
	>
		<div>
			<p lang="en" class="eyebrow mb-5 flex items-center gap-3">
				<span class="crosshair text-safety" aria-hidden="true"></span>
				International CNC Service
			</p>
			<h1 class="display text-4xl sm:text-5xl xl:text-6xl">
				{m.home_hero_title_line1()}<br />
				<span class="text-safety">{m.home_hero_title_line2()}</span>
			</h1>
			<p class="mt-4 font-mono text-sm tracking-[0.14em] text-safety">{site.tagline}</p>
			<p class="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
				{m.home_hero_body()}
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button size="lg" href="/services" class="btn-label">{m.home_hero_cta_service()}</Button>
				<Button size="lg" variant="outline" href="/machines" class="btn-label">
					{m.home_hero_cta_machines()}
				</Button>
			</div>
		</div>
		<div class="text-foreground/80 select-none">
			<HeroDrawing />
		</div>
	</div>
</section>

<!-- SPEC STRIP -->
<section class="border-b border-border bg-card">
	<div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
		{#await data.stats}
			{#each { length: 4 }, i (i)}
				<div>
					<Skeleton class="h-6 w-24" />
					<span class="dim-line my-3 w-16 text-safety" aria-hidden="true"></span>
					<Skeleton class="h-4 w-32" />
				</div>
			{/each}
		{:then stats}
			{#each stats as stat (stat.id)}
				<div>
					<p class="font-mono text-lg font-semibold tracking-[0.08em]">{stat.value}</p>
					<span class="dim-line my-3 w-16 text-safety" aria-hidden="true"></span>
					<p class="text-sm text-muted-foreground">{stat.label}</p>
				</div>
			{/each}
		{/await}
	</div>
</section>

<!-- DUYURULAR (yalnızca yayında duyuru varsa) -->
{#if data.announcements.length > 0}
	<section class="border-b border-border">
		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
			<SectionHeader
				eyebrow={m.home_announcements_eyebrow({
					count: String(data.announcements.length).padStart(2, '0')
				})}
				title={m.home_announcements_title()}
			/>
			<div class="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.announcements as announcement (announcement.id)}
					<AnnouncementLane {announcement} variant="compact" />
				{/each}
			</div>
			<div class="mt-8">
				<Button variant="outline" href="/announcements" class="btn-label"
					>{m.home_announcements_cta()}</Button
				>
			</div>
		</div>
	</section>
{/if}

<!-- HİZMETLER -->
<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
	<SectionHeader
		eyebrow={m.home_services_eyebrow()}
		title={m.home_services_title()}
		description={m.home_services_description()}
	/>
	<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each services as service (service.slug)}
			<a
				href="/services/{service.slug}"
				class="group relative flex flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-foreground"
			>
				<span class="font-mono text-[11px] tracking-[0.18em] text-muted-foreground"
					>{service.code}</span
				>
				<h3 class="display mt-3 text-xl">{service.title}</h3>
				<p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{service.short}</p>
				<span class="btn-label mt-5 inline-flex items-center gap-2 text-primary">
					{m.home_services_cta()}
					<ArrowRightIcon
						class="size-3.5 rtl:-scale-x-100 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
					/>
				</span>
			</a>
		{/each}
		<div class="dark flex flex-col justify-between rounded-md bg-background p-6 text-foreground">
			<div>
				<span class="font-mono text-[11px] tracking-[0.18em] text-safety"
					>{m.home_machines_badge()}</span
				>
				<h3 class="display mt-3 text-xl">{m.home_machines_title()}</h3>
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
					{m.home_machines_description()}
				</p>
			</div>
			<Button href="/machines" class="btn-label mt-5 w-fit">{m.home_machines_cta()}</Button>
		</div>
	</div>
</section>

<!-- GALERİ ÖNİZLEME -->
<section class="border-y border-border bg-card">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
		<SectionHeader
			eyebrow={m.home_gallery_eyebrow()}
			title={m.home_gallery_title()}
			description={m.home_gallery_description()}
		/>
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{#each galleryLabels as label (label)}
				<Placeholder {label} ratio="4/3" class="text-muted-foreground" />
			{/each}
		</div>
		<div class="mt-8">
			<Button variant="outline" href="/gallery" class="btn-label">{m.home_gallery_cta()}</Button>
		</div>
	</div>
</section>

<!-- REFERANSLAR -->
<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
	<SectionHeader eyebrow={m.home_references_eyebrow()} title={m.home_references_title()} />
	{#await data.references}
		<ul
			class="grid grid-cols-2 gap-px overflow-hidden rounded-md border sm:grid-cols-3 lg:grid-cols-6"
		>
			{#each { length: 6 }, i (i)}
				<li class="flex h-24 items-center justify-center bg-card px-4">
					<Skeleton class="h-4 w-20" />
				</li>
			{/each}
		</ul>
	{:then references}
		<ul
			class="grid grid-cols-2 gap-px overflow-hidden rounded-md border sm:grid-cols-3 lg:grid-cols-6"
		>
			{#each references.slice(0, 6) as reference (reference.id)}
				<li class="flex h-24 items-center justify-center bg-card px-4">
					{#if reference.logoUrl}
						<img
							src={reference.logoUrl}
							alt={m.home_references_logo_alt({ name: reference.name })}
							loading="lazy"
							class="max-h-12 max-w-full object-contain"
						/>
					{:else}
						<span
							class="text-center font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase"
						>
							{reference.name}
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/await}
	<div class="mt-8">
		<Button variant="outline" href="/references" class="btn-label">{m.home_references_cta()}</Button
		>
	</div>
</section>

<!-- CTA BANDI -->
<section class="dark bg-background text-foreground">
	<div
		class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6"
	>
		<div class="max-w-xl">
			<h2 class="display text-3xl sm:text-4xl">{m.home_cta_title()}</h2>
			<p class="mt-4 text-lg text-muted-foreground">
				{m.home_cta_body()}
				<a
					href={site.phoneHref}
					dir="ltr"
					class="font-mono text-base text-safety hover:underline"
				>
					{site.phone}
				</a>
			</p>
		</div>
		<Button size="lg" href="/services/repair" class="btn-label">{m.home_cta_button()}</Button>
	</div>
</section>
