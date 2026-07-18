<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import { site } from '$lib/data/site';
</script>

<Seo title="Talebiniz alındı" description="Form gönderiminiz başarıyla alındı." />

<section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
	<span class="bg-safety text-steel flex size-14 items-center justify-center rounded-full">
		<CheckIcon class="size-7" strokeWidth={2.5} />
	</span>
	<h1 class="display mt-8 text-3xl sm:text-4xl">Talebiniz alındı</h1>
	<p class="text-muted-foreground mt-4 text-lg leading-relaxed">
		Formunuz ekibimize iletildi; en kısa sürede size dönüş yapacağız. Acil durumlar için bizi
		doğrudan arayabilirsiniz:
	</p>
	<a href="tel:{site.phone.replaceAll(' ', '')}" class="text-primary mt-3 font-mono text-lg font-semibold">
		{site.phone}
	</a>
	<div class="mt-10 flex gap-3">
		<Button href="/" variant="outline" class="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
			Ana Sayfa
		</Button>
		<Button href="/machines" class="font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
			Satılık Makineler
		</Button>
	</div>
</section>
