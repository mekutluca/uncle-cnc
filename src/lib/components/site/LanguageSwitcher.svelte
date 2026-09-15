<script lang="ts">
	import Languages from '@lucide/svelte/icons/languages';
	import IconDropdownSwitcher from './IconDropdownSwitcher.svelte';
	import { getLocale, setLocale, type Locale } from '$lib/paraglide/runtime';
	import { isRtl } from '$lib/utils/rtl';

	let { align = 'end' }: { align?: 'start' | 'center' | 'end' } = $props();

	const baseLanguages: { code: Locale; label: string }[] = [
		{ code: 'tr', label: 'Türkçe' },
		{ code: 'en', label: 'English' },
		{ code: 'ar', label: 'العربية' },
		{ code: 'de', label: 'Deutsch' }
	];

	let showPersian = $state(false);

	$effect(() => {
		try {
			showPersian = Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Tehran';
		} catch {
			showPersian = false;
		}
	});

	const languages = $derived(
		showPersian ? [...baseLanguages, { code: 'fa' as Locale, label: 'فارسی' }] : baseLanguages
	);

	const current = $derived(languages.find((l) => l.code === getLocale()) ?? languages[0]);
</script>

<IconDropdownSwitcher
	icon={Languages}
	ariaLabel={current.label}
	{align}
	dir={isRtl(getLocale()) ? 'rtl' : 'ltr'}
	items={languages}
	current={current.code}
	onSelect={setLocale}
/>
