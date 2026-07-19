<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<Toaster richColors position="top-center" />

{@render children()}
