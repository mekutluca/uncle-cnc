<script lang="ts">
	import type { Snippet } from 'svelte';
	import HouseIcon from '@lucide/svelte/icons/house';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import { Button } from '$lib/components/ui/button';
	import { site } from '$lib/data/site';
	import { defaultErrorMessage, errorCopy, errorKind } from '$lib/utils/errors';

	/**
	 * Hem sitede hem panelde kullanılan ortak hata gövdesi; çerçeveyi (header/footer,
	 * panel kabuğu, çelik zemin) çağıran +error.svelte sağlar.
	 */
	let {
		status,
		message,
		size = 'lg',
		homeHref = '/',
		homeLabel = 'Ana Sayfa',
		/** `auto`: 5xx'te "Tekrar Dene", diğerlerinde "Geri Dön". */
		secondary = 'auto',
		children,
		actions
	}: {
		status: number;
		message?: string;
		size?: 'lg' | 'md';
		homeHref?: string;
		homeLabel?: string;
		secondary?: 'auto' | 'none';
		/** Açıklama ile butonlar arasına ek içerik (ör. telefon). */
		children?: Snippet;
		/** Varsayılan butonların yanına ek eylemler (ör. çıkış). */
		actions?: Snippet;
	} = $props();

	let kind = $derived(errorKind(status));
	let copy = $derived(errorCopy[kind]);
	let description = $derived(message || defaultErrorMessage(status));
	let lg = $derived(size === 'lg');
</script>

<svelte:head><title>{copy.tab} | {site.fullName}</title></svelte:head>

<div class="flex flex-col items-center text-center">
	<span
		class="flex items-center justify-center rounded-full bg-safety text-steel {lg
			? 'size-14'
			: 'size-11'}"
	>
		<copy.icon class={lg ? 'size-7' : 'size-5'} strokeWidth={2.25} />
	</span>

	<div class="mt-8 flex items-center gap-3">
		<span class="crosshair text-safety" aria-hidden="true"></span>
		<span class="eyebrow">Hata / {status}</span>
	</div>
	<h1 class="display mt-3 {lg ? 'text-3xl sm:text-4xl' : 'text-2xl'}">{copy.title}</h1>
	<p class="mt-4 max-w-md leading-relaxed text-muted-foreground {lg ? 'text-lg' : 'text-base'}">
		{description}
	</p>

	{@render children?.()}

	<div class="mt-10 flex flex-wrap justify-center gap-3">
		<Button href={homeHref} class="btn-label">
			<HouseIcon data-icon="inline-start" />
			{homeLabel}
		</Button>
		{#if secondary === 'auto'}
			{#if kind === 'server'}
				<Button variant="outline" class="btn-label" onclick={() => location.reload()}>
					<RotateCwIcon data-icon="inline-start" />
					Tekrar Dene
				</Button>
			{:else}
				<Button variant="outline" class="btn-label" onclick={() => history.back()}>
					<ArrowLeftIcon data-icon="inline-start" />
					Geri Dön
				</Button>
			{/if}
		{/if}
		{@render actions?.()}
	</div>
</div>
