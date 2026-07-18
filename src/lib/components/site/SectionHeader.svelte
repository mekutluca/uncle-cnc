<script lang="ts">
	let {
		eyebrow,
		title,
		description
	}: { eyebrow: string; title: string; description?: string } = $props();
</script>

<header class="mb-10 max-w-2xl sm:mb-14">
	<div class="mb-4 flex items-center gap-3">
		<span class="crosshair text-safety" aria-hidden="true"></span>
		<span class="eyebrow">{eyebrow}</span>
	</div>
	<h2 class="display text-3xl sm:text-4xl">{title}</h2>
	{#if description}
		<p class="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">{description}</p>
	{/if}
</header>
