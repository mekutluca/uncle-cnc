<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Button } from '$lib/components/ui/button';
	import Seo from '$lib/components/site/Seo.svelte';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';
</script>

<Seo title={m.thanks_seo_title()} description={m.thanks_seo_description()} />

<section class="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
	<span
		class="flex size-14 items-center justify-center rounded-full bg-safety text-safety-foreground"
	>
		<CheckIcon class="size-7" strokeWidth={2.5} />
	</span>
	<h1 class="display mt-8 text-3xl sm:text-4xl">{m.thanks_title()}</h1>
	<p class="mt-4 text-lg leading-relaxed text-muted-foreground">
		{m.thanks_body()}
	</p>
	<a href={site.phoneHref} dir="ltr" class="mt-3 font-mono text-lg font-semibold text-primary">
		{site.phone}
	</a>
	<div class="mt-10 flex gap-3">
		<Button href="/" variant="outline" class="btn-label">{m.thanks_home_button()}</Button>
		<Button href="/machines" class="btn-label">{m.thanks_machines_button()}</Button>
	</div>
</section>
