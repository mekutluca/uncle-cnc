<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { fallbackToFull } from '$lib/utils/photo-fallback';
	import { datePlate, excerpt } from '$lib/utils/announcements';
	import { getLocale } from '$lib/paraglide/runtime';
	import { localeTag } from '$lib/utils/locale-format';
	import * as m from '$lib/paraglide/messages';
	import type { PopupAnnouncement } from '$lib/types';

	/** Açılır mesaj: köşeye asılan plaka. Sayfayı kilitlemez, odağı çalmaz.
	 * Her duyuru tarayıcı başına bir kez gösterilir (localStorage). */
	const SEEN_KEY = 'uc-popup-seen';
	const SEEN_LIMIT = 20;
	const SHOW_DELAY_MS = 1000;

	let announcement = $state<PopupAnnouncement | null>(null);
	let open = $state(false);

	const plate = $derived(
		announcement ? datePlate(announcement.starts_at, localeTag(getLocale())) : null
	);
	const href = $derived(
		announcement ? (announcement.link_url ?? `/announcements#${announcement.id}`) : '#'
	);
	const label = $derived(
		announcement?.link_label ??
			(announcement?.link_url
				? m.announcements_chrome_details()
				: m.announcements_chrome_go_to_announcement())
	);

	function seenIds(): string[] {
		try {
			const parsed = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[];
			return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
		} catch {
			return [];
		}
	}

	function markSeen(id: string) {
		try {
			const next = [id, ...seenIds().filter((x) => x !== id)].slice(0, SEEN_LIMIT);
			localStorage.setItem(SEEN_KEY, JSON.stringify(next));
		} catch {
			/* Depolama kapalıysa mesaj bir sonraki ziyarette yeniden çıkar. */
		}
	}

	function dismiss() {
		if (announcement) markSeen(announcement.id);
		open = false;
	}

	onMount(() => {
		// Arşiv sayfasında zaten duyurulara bakıyor, mesaj gereksiz.
		if (page.url.pathname.startsWith('/announcements')) return;

		const controller = new AbortController();
		let timer: ReturnType<typeof setTimeout> | undefined;

		(async () => {
			try {
				const response = await fetch('/api/announcements/popup', { signal: controller.signal });
				if (!response.ok) return;
				const data = (await response.json()) as PopupAnnouncement | null;
				if (!data || seenIds().includes(data.id)) return;
				announcement = data;
				timer = setTimeout(() => (open = true), SHOW_DELAY_MS);
			} catch {
				/* Ağ hatası: sessizce vazgeç. */
			}
		})();

		return () => {
			controller.abort();
			clearTimeout(timer);
		};
	});
</script>

<svelte:window onkeydown={(e) => open && e.key === 'Escape' && dismiss()} />

<!-- Canlı bölge önceden var olmalı ki içerik değişince okunsun. -->
<div class="sr-only" aria-live="polite">
	{#if announcement && open}{m.announcements_chrome_live_new({ title: announcement.title })}{/if}
</div>

{#if announcement && open && plate}
	<aside
		role="region"
		aria-label={m.announcements_chrome_region_aria()}
		transition:fly={{ y: 16, duration: prefersReducedMotion.current ? 0 : 320, easing: cubicOut }}
		class="plate fixed inset-x-3 bottom-3 z-[60] flex max-h-[70dvh] flex-col rounded-md sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[min(26rem,calc(100vw-3rem))]"
	>
		<div
			class="flex shrink-0 items-center justify-between gap-3 border-b border-foreground bg-safety px-4 py-2 text-safety-foreground"
		>
			<span class="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase">
				{m.announcements_chrome_header({ day: plate.day, month: plate.month })}
			</span>
			<button
				type="button"
				onclick={dismiss}
				aria-label={m.announcements_chrome_dismiss_aria()}
				class="-me-1.5 flex size-8 items-center justify-center rounded-sm transition-colors hover:bg-steel/10 focus-visible:ring-2 focus-visible:ring-steel focus-visible:outline-none"
			>
				<XIcon class="size-4" />
			</button>
		</div>

		<div class="min-h-0 overflow-y-auto">
			{#if announcement.thumbUrl}
				<img
					src={announcement.thumbUrl}
					alt=""
					onerror={(e) => fallbackToFull(e, announcement?.photoUrl ?? null)}
					class="aspect-[16/9] w-full border-b border-border object-cover"
				/>
			{/if}
			<div class="p-4 sm:p-5">
				<p class="display text-lg">{announcement.title}</p>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
					{excerpt(announcement.body, 160)}
				</p>
				<div class="mt-4">
					<Button size="sm" {href} class="btn-label" onclick={dismiss}>
						{label}
						<ArrowRightIcon class="size-3.5" />
					</Button>
				</div>
			</div>
		</div>
	</aside>
{/if}
