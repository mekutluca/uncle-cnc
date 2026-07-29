<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import HeroDrawing from '$lib/components/site/HeroDrawing.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { services } from '$lib/data/services';
	import { site } from '$lib/data/site';

	let { data } = $props();

	const specs = [
		{ value: '±0.01 MM', label: 'Hassasiyet standardı' },
		{ value: '32 BAŞLIK', label: 'Bakım kontrol listesi' },
		{ value: '5 HİZMET', label: 'Tek çatı altında' },
		{ value: 'INT’L', label: 'Yurt içi + yurt dışı servis' }
	];
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
				Her makine<br />
				<span class="text-safety">çalışır.</span>
			</h1>
			<p class="mt-4 font-mono text-sm tracking-[0.14em] text-safety">{site.tagline}</p>
			<p class="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
				CNC tezgâhlarınızın ekspertizi, bakımı, tamiri ve ticareti tek çatı altında. Arızayı doğru
				tespit eder, doğru işlemi uygular, makinenizi en hızlı şekilde üretime döndürürüz.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button size="lg" href="/services" class="btn-label">Hizmet Talebi Oluştur</Button>
				<Button size="lg" variant="outline" href="/machines" class="btn-label">
					Satılık Makineler
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
		{#each specs as spec (spec.label)}
			<div>
				<p class="font-mono text-lg font-semibold tracking-[0.08em]">{spec.value}</p>
				<span class="dim-line my-3 w-16 text-safety" aria-hidden="true"></span>
				<p class="text-sm text-muted-foreground">{spec.label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- HİZMETLER -->
<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
	<SectionHeader
		eyebrow="Hizmetler / 01–05"
		title="Beş hizmet, tek sorumlu"
		description="Ekspertizden makine ticaretine — tezgâhınızın tüm yaşam döngüsünü üstleniyoruz. Her hizmetin kendi talep formu vardır; doldurun, ekibimiz size dönsün."
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
					Talep oluştur
					<ArrowRightIcon class="size-3.5 transition-transform group-hover:translate-x-1" />
				</span>
			</a>
		{/each}
		<div class="dark flex flex-col justify-between rounded-md bg-background p-6 text-foreground">
			<div>
				<span class="font-mono text-[11px] tracking-[0.18em] text-safety">SATIŞTA</span>
				<h3 class="display mt-3 text-xl">Satılık Makineler</h3>
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
					Ekspertizi yapılmış, çalışır durumda ikinci el CNC tezgâhları. İlanları inceleyin, bilgi
					isteyin.
				</p>
			</div>
			<Button href="/machines" class="btn-label mt-5 w-fit">İlanlara Göz At</Button>
		</div>
	</div>
</section>

<!-- GALERİ ÖNİZLEME -->
<section class="border-y border-border bg-card">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
		<SectionHeader
			eyebrow="Galeri"
			title="Atölyeden kareler"
			description="Tamamlanan bakım, revizyon ve servis işlerimizden görüntüler."
		/>
		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{#each ['REVİZYON', 'BAKIM', 'SERVİS', 'MONTAJ'] as label (label)}
				<Placeholder {label} ratio="4/3" class="text-muted-foreground" />
			{/each}
		</div>
		<div class="mt-8">
			<Button variant="outline" href="/gallery" class="btn-label">Tüm Galeri</Button>
		</div>
	</div>
</section>

<!-- REFERANSLAR -->
<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
	<SectionHeader eyebrow="Referanslar" title="Bize emanet edilen tezgâhlar" />
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
							alt="{reference.name} logosu"
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
		<Button variant="outline" href="/references" class="btn-label">Tüm Referanslar</Button>
	</div>
</section>

<!-- CTA BANDI -->
<section class="dark bg-background text-foreground">
	<div
		class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6"
	>
		<div class="max-w-xl">
			<h2 class="display text-3xl sm:text-4xl">Tezgâhınız mı durdu?</h2>
			<p class="mt-4 text-lg text-muted-foreground">
				Formu doldurun, arızanızı en hızlı şekilde çözelim — ya da bizi doğrudan arayın:
				<a href={site.phoneHref} class="font-mono text-base text-safety hover:underline">
					{site.phone}
				</a>
			</p>
		</div>
		<Button size="lg" href="/services/repair" class="btn-label">Servis Talebi Oluştur</Button>
	</div>
</section>
