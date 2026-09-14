<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/logo-mark.png';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" type="image/png" href={favicon} /></svelte:head>

{@render children()}
