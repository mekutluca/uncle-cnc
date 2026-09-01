<script lang="ts">
	import { page } from '$app/state';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import { site } from '$lib/data/site';
</script>

<!-- Halka açık layout'un içinde çizilir: header ve footer yerinde kalır. -->
<section class="mx-auto max-w-2xl px-4 py-24 sm:px-6">
	<ErrorState status={page.status} message={page.error?.message}>
		<p class="mt-6 text-sm text-muted-foreground">
			Yardıma mı ihtiyacınız var? Bizi arayın:
			<a href={site.phoneHref} class="ml-1 font-mono font-semibold text-primary">{site.phone}</a>
		</p>
	</ErrorState>
</section>
