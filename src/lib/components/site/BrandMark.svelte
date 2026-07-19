<script lang="ts">
	import { site } from '$lib/data/site';

	let {
		subtitle = '',
		size = 'lg',
		subtitleClass = 'text-muted-foreground'
	}: { subtitle?: string; size?: 'sm' | 'md' | 'lg'; subtitleClass?: string } = $props();

	const nameSize = $derived({ sm: 'text-base', md: 'text-lg', lg: 'text-xl' }[size]);
	const subtitleSize = $derived(size === 'sm' ? 'text-[8px]' : 'text-[9px]');
</script>

<span class="flex items-center gap-3">
	<span class="crosshair text-safety shrink-0" aria-hidden="true"></span>
	<span class="leading-none">
		<span class="display block {nameSize}">{site.name}</span>
		{#if subtitle}
			<span class="mt-1 block font-mono {subtitleSize} uppercase tracking-[0.24em] {subtitleClass}">
				{subtitle}
			</span>
		{/if}
	</span>
</span>
