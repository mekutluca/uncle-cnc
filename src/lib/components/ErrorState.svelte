<script lang="ts">
	import type { Snippet } from 'svelte';
	import HouseIcon from '@lucide/svelte/icons/house';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
	import { Button } from '$lib/components/ui/button';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';
	import {
		defaultErrorMessage,
		errorCopy,
		errorKind,
		publicErrorCopy,
		publicErrorMessage
	} from '$lib/utils/errors';

	/**
	 * Hem sitede hem panelde kullanılan ortak hata gövdesi. Çerçeveyi (header/footer,
	 * panel kabuğu, çelik zemin) çağıran +error.svelte sağlar.
	 *
	 * `localized`: yalnızca public site çağıranları geçirir — panel her zaman Türkçe
	 * kalır (aksi halde tarayıcıdaki bir dil çerezi panelin diline sızabilirdi).
	 */
	let {
		status,
		message,
		size = 'lg',
		homeHref = '/',
		homeLabel,
		/** `auto`: 5xx'te "Tekrar Dene", diğerlerinde "Geri Dön". */
		secondary = 'auto',
		localized = false,
		children,
		actions
	}: {
		status: number;
		message?: string;
		size?: 'lg' | 'md';
		homeHref?: string;
		homeLabel?: string;
		secondary?: 'auto' | 'none';
		localized?: boolean;
		/** Açıklama ile butonlar arasına ek içerik (ör. telefon). */
		children?: Snippet;
		/** Varsayılan butonların yanına ek eylemler (ör. çıkış). */
		actions?: Snippet;
	} = $props();

	let kind = $derived(errorKind(status));
	let copy = $derived(localized ? publicErrorCopy(kind) : errorCopy[kind]);
	let description = $derived(
		message || (localized ? publicErrorMessage(status) : defaultErrorMessage(status))
	);
	let resolvedHomeLabel = $derived(homeLabel ?? (localized ? m.errors_home() : 'Ana Sayfa'));
	let lg = $derived(size === 'lg');
</script>

<svelte:head><title>{copy.tab} | {site.fullName}</title></svelte:head>

<div class="flex flex-col items-center text-center">
	<span
		class="flex items-center justify-center rounded-full bg-safety text-safety-foreground {lg
			? 'size-14'
			: 'size-11'}"
	>
		<copy.icon class={lg ? 'size-7' : 'size-5'} strokeWidth={2.25} />
	</span>

	<div class="mt-8 flex items-center gap-3">
		<span class="crosshair text-safety" aria-hidden="true"></span>
		<span class="eyebrow">{localized ? m.errors_eyebrow({ status }) : `Hata / ${status}`}</span>
	</div>
	<h1 class="display mt-3 {lg ? 'text-3xl sm:text-4xl' : 'text-2xl'}">{copy.title}</h1>
	<p class="mt-4 max-w-md leading-relaxed text-muted-foreground {lg ? 'text-lg' : 'text-base'}">
		{description}
	</p>

	{@render children?.()}

	<div class="mt-10 flex flex-wrap justify-center gap-3">
		<Button href={homeHref} class="btn-label">
			<HouseIcon data-icon="inline-start" />
			{resolvedHomeLabel}
		</Button>
		{#if secondary === 'auto'}
			{#if kind === 'server'}
				<Button variant="outline" class="btn-label" onclick={() => location.reload()}>
					<RotateCwIcon data-icon="inline-start" />
					{localized ? m.errors_retry() : 'Tekrar Dene'}
				</Button>
			{:else}
				<Button variant="outline" class="btn-label" onclick={() => history.back()}>
					<ArrowLeftIcon data-icon="inline-start" />
					{localized ? m.errors_go_back() : 'Geri Dön'}
				</Button>
			{/if}
		{/if}
		{@render actions?.()}
	</div>
</div>
