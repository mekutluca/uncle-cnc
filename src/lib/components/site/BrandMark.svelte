<script lang="ts">
	import { site } from '$lib/data/site';
	import logoMark from '$lib/assets/logo-mark.png';

	let {
		subtitle = '',
		size = 'lg',
		subtitleClass = 'text-muted-foreground',
		subtitleLang = undefined
	}: {
		subtitle?: string;
		size?: 'sm' | 'md' | 'lg';
		subtitleClass?: string;
		/** Dil kodu (ör. 'en') — İngilizce alt başlıkların Türkçe kurallarla (İ) büyütülmesini önler. */
		subtitleLang?: string;
	} = $props();

	const nameSize = $derived({ sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size]);
	const subtitleSize = $derived(size === 'sm' ? 'text-[8px]' : 'text-[9px]');
	const markSize = $derived({ sm: 'size-7', md: 'size-8', lg: 'size-9' }[size]);
</script>

<span class="flex items-center gap-3">
	<img
		src={logoMark}
		alt=""
		class="{markSize} shrink-0 rounded-md object-cover"
		aria-hidden="true"
	/>
	<span class="leading-none">
		<span class="display block {nameSize}">{site.name}</span>
		{#if subtitle}
			<span
				lang={subtitleLang}
				class="mt-1 block font-mono {subtitleSize} tracking-[0.24em] uppercase {subtitleClass}"
			>
				{subtitle}
			</span>
		{/if}
	</span>
</span>
