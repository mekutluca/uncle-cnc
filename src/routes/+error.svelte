<script lang="ts">
	import { page } from '$app/state';
	import Header from '$lib/components/site/Header.svelte';
	import Footer from '$lib/components/site/Footer.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import ErrorFrame from '$lib/components/admin/error-frame.svelte';

	let isAdmin = $derived(page.url.pathname.startsWith('/admin'));
</script>

<!--
	Son basamak: rota eşleşmeleri [...path] yakalayıcılara, sayfa hataları grup
	+error.svelte'lerine düşer. Buraya yalnızca bir grup layout'unun kendisi
	çöktüğünde (ör. admin/+layout.ts) ulaşılır. Çerçeve yine de bölüme uyar.
-->
{#if isAdmin}
	<ErrorFrame status={page.status} message={page.error?.message} />
{:else}
	<div class="flex min-h-screen flex-col">
		<Header />
		<main class="flex flex-1 items-center justify-center px-4 py-24 sm:px-6">
			<ErrorState status={page.status} message={page.error?.message} />
		</main>
		<Footer />
	</div>
{/if}
