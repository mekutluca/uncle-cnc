<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	let { href, label }: { href: string; label: string } = $props();
</script>

<a
	{href}
	class="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground"
>
	<ArrowLeftIcon class="size-3.5" />
	{label}
</a>
