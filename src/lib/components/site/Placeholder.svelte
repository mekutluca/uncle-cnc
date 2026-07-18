<script lang="ts">
	/** Müşteriden görsel gelene kadar kullanılan, teknik tarama desenli yer tutucu. */
	let {
		label = 'GÖRSEL',
		ratio = '4/3',
		class: className = ''
	}: { label?: string; ratio?: string; class?: string } = $props();
</script>

<div
	class="border-border relative overflow-hidden rounded-md border {className}"
	style="aspect-ratio: {ratio}; background:
		repeating-linear-gradient(45deg, transparent, transparent 7px, color-mix(in srgb, currentColor 12%, transparent) 7px, color-mix(in srgb, currentColor 12%, transparent) 8px);"
>
	<span
		class="bg-background/85 absolute bottom-2 left-2 rounded-sm px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
	>
		{label}
	</span>
</div>
