<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			title: 'Doğru tespit',
			detail:
				'Her iş ekspertizle başlar. Arızanın veya ihtiyacın kaynağını ölçerek belirler, tahminle parça değiştirmeyiz.'
		},
		{
			title: 'Şeffaf raporlama',
			detail:
				'Yaptığımız her işlemi ayrıntılı görsellerle belgeler, ne yapıldığını ve neden yapıldığını raporla teslim ederiz.'
		},
		{
			title: 'Hız',
			detail:
				'Duran tezgâh para kaybettirir. Yedek parça ağımız ve deneyimli ekibimizle makinenizi en kısa sürede üretime döndürürüz.'
		}
	];
</script>

<Seo title="Hakkımızda" description="MC ICS — International CNC Service: her makine çalışır. Kim olduğumuz ve nasıl çalıştığımız." />

<section class="dark bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
		<p class="eyebrow mb-4 flex items-center gap-3">
			<span class="crosshair text-safety" aria-hidden="true"></span>
			Hakkımızda
		</p>
		<h1 class="display max-w-3xl text-4xl sm:text-5xl">
			Her makine çalışır.<br />
			<span class="text-safety">Biz çalıştırırız.</span>
		</h1>
		<p class="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
			{site.fullName}, CNC tezgâhlarının ekspertizi, bakımı, tamiri, danışmanlığı ve ticareti üzerine
			uzmanlaşmış bir servis firmasıdır. Yurt içinde ve yurt dışında, markadan bağımsız olarak dik
			işleme, torna, 5 eksen ve daha fazlasına hizmet veriyoruz.
		</p>
	</div>
</section>

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader eyebrow="Çalışma Prensipleri" title="Nasıl çalışırız" />
	<div class="grid gap-5 md:grid-cols-3">
		{#each principles as principle, i (principle.title)}
			<div class="border-border bg-card rounded-md border p-6">
				<span class="text-muted-foreground font-mono text-[11px] tracking-[0.18em]">
					{String(i + 1).padStart(2, '0')}
				</span>
				<h2 class="display mt-3 text-xl">{principle.title}</h2>
				<p class="text-muted-foreground mt-3 text-sm leading-relaxed">{principle.detail}</p>
			</div>
		{/each}
	</div>
	<div class="mt-12">
		<Button size="lg" href="/services" class="font-mono text-[12px] font-semibold uppercase tracking-[0.18em]">
			Hizmet Talebi Oluştur
		</Button>
	</div>
</section>
