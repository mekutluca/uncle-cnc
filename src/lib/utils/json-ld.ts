/** schema.org nesnesini `<svelte:head>` içine `{@html}` ile basılacak betik etiketine çevirir.
 *  `<` kaçışı sayesinde veri içindeki bir kapanış etiketi betiği erken kapatamaz. */
export const jsonLdScript = (data: Record<string, unknown>): string =>
	`<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
