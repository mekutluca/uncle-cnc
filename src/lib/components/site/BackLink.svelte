<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let { href, label, class: className }: { href: string; label: string; class?: string } = $props();
</script>

<Button variant="ghost" size="sm" {href} class={cn('-ms-2', className)}>
	<ChevronLeftIcon data-icon="inline-start" />
	{label}
</Button>
