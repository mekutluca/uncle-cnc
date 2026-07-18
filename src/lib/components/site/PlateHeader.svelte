<script lang="ts">
	let { title, code }: { title: string; code?: string } = $props();
</script>

<div class="plate-header">
	<span class="font-mono text-xs font-semibold uppercase tracking-[0.2em]">{title}</span>
	{#if code}
		<span class="text-muted-foreground font-mono text-xs tracking-[0.2em]">FORM NO: {code}</span>
	{/if}
</div>
