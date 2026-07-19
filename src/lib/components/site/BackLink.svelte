<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';

	let { href, label }: { href: string; label: string } = $props();
</script>

<a
	{href}
	class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors"
>
	<ArrowLeftIcon class="size-3.5" />
	{label}
</a>
