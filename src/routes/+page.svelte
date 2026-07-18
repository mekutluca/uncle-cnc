<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import HeroDrawing from '$lib/components/site/HeroDrawing.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import { services } from '$lib/data/services';
	import { references } from '$lib/data/references';
	import { site } from '$lib/data/site';

	const specs = [
		{ value: '±0.01 MM', label: 'Hassasiyet standardı' },
		{ value: '32 BAŞLIK', label: 'Bakım kontrol listesi' },
		{ value: '5 HİZMET', label: 'Tek çatı altında' },
		{ value: 'INT’L', label: 'Yurt içi + yurt dışı servis' }
	];
</script>

<Seo />

<!-- HERO -->
<section class="dark bg-background text-foreground relative overflow-hidden">
	<div class="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
		<div>
			<p class="eyebrow mb-5 flex items-center gap-3">
				<span class="crosshair text-safety" aria-hidden="true"></span>
				International CNC Service
			</p>
			<h1 class="display text-4xl sm:text-5xl xl:text-6xl">
				Her makine<br />
				<span class="text-safety">çalışır.</span>
			</h1>
			<p class="text-safety mt-4 font-mono text-sm tracking-[0.14em]">{site.tagline}</p>
			<p class="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed">
				CNC tezgâhlarınızın ekspertizi, bakımı, tamiri ve ticareti tek çatı altında. Arızayı doğru
				tespit eder, doğru işlemi uygular, makinenizi en hızlı şekilde üretime döndürürüz.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button size="lg" href="/services" class="btn-label">
					Hizmet Talebi Oluştur
				</Button>
				<Button
					size="lg"
					variant="outline"
					href="/machines"
					class="btn-label"
				>
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
<section class="border-border bg-card border-b">
	<div class="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
		{#each specs as spec (spec.label)}
			<div>
				<p class="font-mono text-lg font-semibold tracking-[0.08em]">{spec.value}</p>
				<span class="dim-line text-safety my-3 w-16" aria-hidden="true"></span>
				<p class="text-muted-foreground text-sm">{spec.label}</p>
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
				class="group border-border bg-card hover:border-foreground relative flex flex-col rounded-md border p-6 transition-colors"
			>
				<span class="text-muted-foreground font-mono text-[11px] tracking-[0.18em]">{service.code}</span>
				<h3 class="display mt-3 text-xl">{service.title}</h3>
				<p class="text-muted-foreground mt-3 flex-1 text-sm leading-relaxed">{service.short}</p>
				<span class="text-primary mt-5 inline-flex items-center gap-2 btn-label">
					Talep oluştur
					<ArrowRightIcon class="size-3.5 transition-transform group-hover:translate-x-1" />
				</span>
			</a>
		{/each}
		<div class="dark bg-background text-foreground flex flex-col justify-between rounded-md p-6">
			<div>
				<span class="text-safety font-mono text-[11px] tracking-[0.18em]">SATIŞTA</span>
				<h3 class="display mt-3 text-xl">Satılık Makineler</h3>
				<p class="text-muted-foreground mt-3 text-sm leading-relaxed">
					Ekspertizi yapılmış, çalışır durumda ikinci el CNC tezgâhları. İlanları inceleyin, bilgi
					isteyin.
				</p>
			</div>
			<Button href="/machines" class="mt-5 w-fit btn-label">
				İlanlara Göz At
			</Button>
		</div>
	</div>
</section>

<!-- GALERİ ÖNİZLEME -->
<section class="border-border bg-card border-y">
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
			<Button variant="outline" href="/gallery" class="btn-label">
				Tüm Galeri
			</Button>
		</div>
	</div>
</section>

<!-- REFERANSLAR -->
<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6">
	<SectionHeader eyebrow="Referanslar" title="Bize emanet edilen tezgâhlar" />
	<ul class="grid grid-cols-2 gap-px overflow-hidden rounded-md border sm:grid-cols-3 lg:grid-cols-6">
		{#each references as reference (reference.name)}
			<li class="bg-card flex h-24 items-center justify-center px-4">
				<span class="text-muted-foreground text-center font-mono text-[11px] uppercase tracking-[0.14em]">
					{reference.name}
				</span>
			</li>
		{/each}
	</ul>
	<div class="mt-8">
		<Button variant="outline" href="/references" class="btn-label">
			Tüm Referanslar
		</Button>
	</div>
</section>

<!-- CTA BANDI -->
<section class="dark bg-background text-foreground">
	<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6">
		<div class="max-w-xl">
			<h2 class="display text-3xl sm:text-4xl">Tezgâhınız mı durdu?</h2>
			<p class="text-muted-foreground mt-4 text-lg">
				Formu doldurun, arızanızı en hızlı şekilde çözelim — ya da bizi doğrudan arayın:
				<a href={site.phoneHref} class="text-safety font-mono text-base hover:underline">
					{site.phone}
				</a>
			</p>
		</div>
		<Button size="lg" href="/services/repair" class="btn-label">
			Servis Talebi Oluştur
		</Button>
	</div>
</section>
