<script lang="ts">
	import Palette from '@lucide/svelte/icons/palette';
	import IconDropdownSwitcher from './IconDropdownSwitcher.svelte';
	import type { AccentTheme } from '$lib/types';

	let { align = 'end' }: { align?: 'start' | 'center' | 'end' } = $props();

	const cookieName = 'ACCENT_THEME';
	const cookieMaxAge = 34560000;

	const accents: { code: AccentTheme; label: string }[] = [
		{ code: 'yellow', label: 'Sarı (orijinal)' },
		{ code: 'red', label: 'Kırmızı (marka)' },
		{ code: 'red-contrast', label: 'Kırmızı (kontrastlı)' }
	];

	let current = $state<AccentTheme>('red-contrast');

	$effect(() => {
		const attr = document.documentElement.getAttribute('data-accent');
		if (attr === 'yellow' || attr === 'red' || attr === 'red-contrast') {
			current = attr;
		}
	});

	function selectAccent(accent: AccentTheme) {
		document.cookie = `${cookieName}=${accent}; path=/; max-age=${cookieMaxAge}`;
		document.documentElement.setAttribute('data-accent', accent);
		current = accent;
	}
</script>

<IconDropdownSwitcher
	icon={Palette}
	ariaLabel="Renk teması"
	{align}
	items={accents}
	{current}
	onSelect={selectAccent}
/>
