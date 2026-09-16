<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Languages from '@lucide/svelte/icons/languages';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
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

<DropdownMenu.Root dir={isRtl(getLocale()) ? 'rtl' : 'ltr'}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon" aria-label={current.label}>
				<Languages class="size-5" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content {align}>
		{#each languages as language (language.code)}
			<DropdownMenu.Item onclick={() => setLocale(language.code)}>
				{language.label}
				{#if current.code === language.code}
					<Check class="ms-auto size-4" />
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
