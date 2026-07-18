<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';

	let {
		title,
		description = site.description,
		image = `${site.url}/og.jpg`
	}: { title?: string; description?: string; image?: string } = $props();

	const fullTitle = $derived(title ? `${title} | ${site.fullName}` : site.fullName);
	const canonical = $derived(`${site.url}${page.url.pathname}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={site.fullName} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={image} />
	<meta property="og:locale" content="tr_TR" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>
