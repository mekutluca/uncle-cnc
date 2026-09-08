<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import { site } from '$lib/data/site';
</script>

<Seo title="Talebiniz alındı" description="Form gönderiminiz başarıyla alındı." />

<section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
	<span class="flex size-14 items-center justify-center rounded-full bg-safety text-steel">
		<CheckIcon class="size-7" strokeWidth={2.5} />
	</span>
	<h1 class="display mt-8 text-3xl sm:text-4xl">Talebiniz alındı</h1>
	<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
		Formunuz ekibimize iletildi. En kısa sürede size dönüş yapacağız. Acil durumlar için bizi
		doğrudan arayabilirsiniz:
	</p>
	<a href={site.phoneHref} class="mt-3 font-mono text-lg font-semibold text-primary">
		{site.phone}
	</a>
	<div class="mt-10 flex gap-3">
		<Button href="/" variant="outline" class="btn-label">Ana Sayfa</Button>
		<Button href="/machines" class="btn-label">Satılık Ürünler</Button>
	</div>
</section>
