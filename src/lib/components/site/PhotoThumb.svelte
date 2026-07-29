<script lang="ts">
	import ImageOffIcon from '@lucide/svelte/icons/image-off';
	import { fallbackToFull } from '$lib/utils/photo-fallback';

	/** Küçük fotoğraf önizlemesi; fotoğraf yoksa simgeli yer tutucu gösterir.
	 * `src` küçük varyant URL'i olabilir — yüklenemezse `fallback` (tam boyut) denenir. */
	let {
		src = null,
		fallback = null,
		alt = '',
		class: className = 'size-11'
	}: { src?: string | null; fallback?: string | null; alt?: string; class?: string } = $props();
</script>

{#if src}
	<img
		{src}
		{alt}
		onerror={(e) => fallbackToFull(e, fallback)}
		class="shrink-0 rounded-sm border border-border object-cover {className}"
	/>
{:else}
	<span
		class="flex shrink-0 items-center justify-center rounded-sm border border-border bg-muted text-muted-foreground {className}"
	>
		<ImageOffIcon class="size-4" />
	</span>
{/if}
