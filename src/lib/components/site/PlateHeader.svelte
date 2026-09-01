<script lang="ts">
	let {
		title,
		code,
		codeLabel = 'FORM NO'
	}: { title: string; code?: string; codeLabel?: string } = $props();
</script>

<div class="plate-header">
	<span class="font-mono text-xs font-semibold tracking-[0.2em] uppercase">{title}</span>
	{#if code}
		<span class="font-mono text-xs tracking-[0.2em] text-muted-foreground">{codeLabel}: {code}</span
		>
	{/if}
</div>
