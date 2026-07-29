<script lang="ts">
	import Header from '$lib/components/site/Header.svelte';
	import Footer from '$lib/components/site/Footer.svelte';

	let { children } = $props();
</script>

<a
	href="#icerik"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-safety focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-steel"
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
