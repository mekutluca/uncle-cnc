<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/data/site';
	import { getLocale } from '$lib/paraglide/runtime';
	import { jsonLdScript } from '$lib/utils/json-ld';

	let {
		title,
		description = site.description,
		image = `${site.url}/og.jpg`,
		jsonLd
	}: {
		title?: string;
		description?: string;
		image?: string;
		/** Sayfaya özel schema.org nesnesi (ör. ilan sayfasında Product). */
		jsonLd?: Record<string, unknown>;
	} = $props();

	const fullTitle = $derived(title ? `${title} | ${site.fullName}` : site.fullName);
	const canonical = $derived(`${site.url}${page.url.pathname}`);

	const OG_LOCALE: Record<string, string> = {
		tr: 'tr_TR',
		en: 'en_US',
		ar: 'ar_SA',
		de: 'de_DE',
		fa: 'fa_IR'
	};
	const ogLocale = $derived(OG_LOCALE[getLocale()] ?? 'tr_TR');

	/** Firma kimliği her sayfada aynıdır. Google işletme sonuçları bu bloğu okur. */
	const business = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': `${site.url}/#business`,
		name: site.name,
		alternateName: site.fullName,
		url: site.url,
		image: `${site.url}/og.jpg`,
		telephone: site.phone.replaceAll(' ', ''),
		email: site.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: '100. Yıl Bulvarı 55/A, Ostim OSB',
			addressLocality: 'Yenimahalle',
			addressRegion: 'Ankara',
			addressCountry: 'TR'
		}
	};
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
	<meta property="og:locale" content={ogLocale} />
	<meta name="twitter:card" content="summary_large_image" />
	{@html jsonLdScript({ ...business, description })}
	{#if jsonLd}
		{@html jsonLdScript(jsonLd)}
	{/if}
</svelte:head>
