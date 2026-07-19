<script lang="ts">
	import Header from '$lib/components/site/Header.svelte';
	import Footer from '$lib/components/site/Footer.svelte';

	let { children } = $props();
</script>

<a
	href="#icerik"
	class="focus:bg-safety focus:text-steel sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
>
	İçeriğe atla
</a>

<div class="flex min-h-screen flex-col">
	<Header />

	<main id="icerik" class="flex-1">
		{@render children()}
	</main>

	<Footer />
</div>
