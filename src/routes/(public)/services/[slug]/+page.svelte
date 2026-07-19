<script lang="ts">
	import Seo from '$lib/components/site/Seo.svelte';
	import ServiceForm from '$lib/components/forms/ServiceForm.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { services } from '$lib/data/services';
	import { site } from '$lib/data/site';

	let { data } = $props();
	const service = $derived(data.service);
	const otherServices = $derived(services.filter((s) => s.slug !== service.slug));

	/* Bakım hizmetindeki 32 başlığın ana grupları — tam liste müşteriden gelince açılır. */
	const maintenanceGroups = [
		{ title: 'Mekanik kontroller', detail: 'Eksen kızakları, bilyalı vidalar, rulmanlar, kayış-kasnak sistemleri ve tabla hizalamaları kontrol edilir.' },
		{ title: 'Elektrik ve kontrol sistemi', detail: 'Pano bağlantıları, servo sürücüler, enkoder geri beslemeleri ve kontrol ünitesi parametreleri gözden geçirilir.' },
		{ title: 'Yağlama ve hidrolik', detail: 'Merkezi yağlama hatları, hidrolik ünite basınçları ve soğutma sıvısı sistemi bakımı yapılır.' },
		{ title: 'Hassasiyet ölçümleri', detail: 'Eksen geometrileri, mil salgısı ve tekrarlanabilirlik ölçülür; sonuçlar raporlanır.' },
		{ title: 'Raporlama', detail: 'Tüm başlıklar ayrıntılı görsellerle belgelenir, öneri listesiyle birlikte teslim edilir.' }
	];
</script>

<Seo title={service.title} description={service.intro} />

<section class="dark bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
		<p class="eyebrow mb-4 flex items-center gap-3">
			<span class="crosshair text-safety" aria-hidden="true"></span>
			Hizmet Kartı — {service.code}
		</p>
		<h1 class="display max-w-3xl text-4xl sm:text-5xl">{service.title}</h1>
		<p class="text-muted-foreground mt-5 max-w-3xl text-lg leading-relaxed">{service.intro}</p>
	</div>
</section>

<section class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
	<div>
		<ServiceForm {service} />

		{#if service.slug === 'maintenance'}
			<div class="mt-10">
				<h2 class="eyebrow mb-4">32 başlıkta neler kontrol edilir?</h2>
				<Accordion.Root type="single" class="border-border rounded-md border px-4">
					{#each maintenanceGroups as group, i (group.title)}
						<Accordion.Item value={group.title}>
							<Accordion.Trigger class="font-medium">
								<span class="flex items-baseline gap-3">
									<span class="text-muted-foreground font-mono text-[11px] tracking-[0.14em]">
										{String(i + 1).padStart(2, '0')}
									</span>
									{group.title}
								</span>
							</Accordion.Trigger>
							<Accordion.Content class="text-muted-foreground">{group.detail}</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		{/if}
	</div>

	<aside class="flex flex-col gap-6 lg:mt-0">
		<div class="border-border bg-card rounded-md border p-6">
			<h2 class="eyebrow mb-4">Hemen ulaşın</h2>
			<p class="text-sm leading-relaxed">
				Form yerine telefonla da talep oluşturabilirsiniz. Acil arızalarda arayın:
			</p>
			<a
				href={site.phoneHref}
				class="text-primary mt-3 block font-mono text-lg font-semibold tracking-[0.06em]"
			>
				{site.phone}
			</a>
			<a href="mailto:{site.email}" class="text-muted-foreground mt-1 block font-mono text-sm">
				{site.email}
			</a>
		</div>

		<nav class="border-border bg-card rounded-md border p-6" aria-label="Diğer hizmetler">
			<h2 class="eyebrow mb-4">Diğer hizmetler</h2>
			<ul class="grid gap-2.5">
				{#each otherServices as other (other.slug)}
					<li>
						<a href="/services/{other.slug}" class="hover:text-primary flex items-baseline gap-3 text-sm font-medium transition-colors">
							<span class="text-muted-foreground font-mono text-[10px] tracking-[0.12em]">{other.code}</span>
							{other.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
</section>
