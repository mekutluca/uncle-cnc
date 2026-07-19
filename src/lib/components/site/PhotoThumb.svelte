<script lang="ts">
	import ImageOffIcon from '@lucide/svelte/icons/image-off';

	/** Küçük fotoğraf önizlemesi; fotoğraf yoksa simgeli yer tutucu gösterir. */
	let {
		src = null,
		alt = '',
		class: className = 'size-11'
	}: { src?: string | null; alt?: string; class?: string } = $props();
</script>

{#if src}
	<img {src} {alt} class="border-border shrink-0 rounded-sm border object-cover {className}" />
{:else}
	<span
		class="border-border bg-muted text-muted-foreground flex shrink-0 items-center justify-center rounded-sm border {className}"
	>
		<ImageOffIcon class="size-4" />
	</span>
{/if}
