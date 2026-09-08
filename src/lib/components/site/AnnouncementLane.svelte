<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { fallbackToFull } from '$lib/utils/photo-fallback';
	import { datePlate, excerpt, formatLastDayLong, splitParagraphs } from '$lib/utils/announcements';
	import { getLocale } from '$lib/paraglide/runtime';
	import { localeTag } from '$lib/utils/locale-format';
	import * as m from '$lib/paraglide/messages';
	import type { AnnouncementWithPhoto } from '$lib/types';

	/** Duyuru şeridi. `compact`: ana sayfa kartı (özet + küçük görsel).
	 * `full`: arşiv sayfası (tam metin, yan görsel). */
	let {
		announcement,
		variant = 'full'
	}: { announcement: AnnouncementWithPhoto; variant?: 'compact' | 'full' } = $props();

	const plate = $derived(datePlate(announcement.starts_at, localeTag(getLocale())));
	const href = $derived(announcement.link_url ?? `/announcements#${announcement.id}`);
	const label = $derived(
		announcement.link_label ?? (announcement.link_url ? m.announcements_chrome_details() : m.announcements_chrome_more())
	);
	const paragraphs = $derived(splitParagraphs(announcement.body));
	const compact = $derived(variant === 'compact');
</script>

<article
	id={announcement.id}
	class="flex scroll-mt-24 flex-col overflow-hidden rounded-md border border-border bg-card
		{compact ? '' : 'sm:flex-row'}"
>
	<div class="h-0.5 shrink-0 bg-safety {compact ? '' : 'sm:hidden'}" aria-hidden="true"></div>

	{#if announcement.thumbUrl && compact}
		<img
			src={announcement.thumbUrl}
			alt=""
			loading="lazy"
			onerror={(e) => fallbackToFull(e, announcement.photoUrl)}
			class="aspect-[16/9] w-full border-b border-border object-cover"
		/>
	{/if}

	<div class="flex flex-1">
		<time
			datetime={announcement.starts_at}
			class="flex w-16 shrink-0 flex-col items-center justify-start gap-0.5 border-e border-border bg-secondary px-2 pt-5 font-mono
				{compact ? '' : 'sm:w-20 sm:pt-6'}"
		>
			<span class="text-2xl leading-none font-semibold tabular-nums {compact ? '' : 'sm:text-3xl'}"
				>{plate.day}</span
			>
			<span class="text-[11px] tracking-[0.18em] text-muted-foreground">{plate.month}</span>
		</time>

		<div class="flex min-w-0 flex-1 flex-col p-5 {compact ? '' : 'sm:p-6'}">
			<h3 class="display {compact ? 'text-lg' : 'text-xl sm:text-2xl'}">{announcement.title}</h3>

			{#if compact}
				<p class="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
					{excerpt(announcement.body)}
				</p>
			{:else}
				<div class="mt-3 max-w-prose space-y-3 text-base leading-relaxed text-muted-foreground">
					{#each paragraphs as paragraph, i (i)}
						<p class="whitespace-pre-line">{paragraph}</p>
					{/each}
				</div>
			{/if}

			<div class="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
				<a {href} class="btn-label inline-flex items-center gap-2 text-primary hover:underline">
					{label}
					<ArrowRightIcon class="size-3.5" />
				</a>
				{#if announcement.ends_at && !compact}
					<span class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
						{m.announcements_chrome_last_day({
							date: formatLastDayLong(announcement.ends_at, localeTag(getLocale()))
						})}
					</span>
				{/if}
			</div>
		</div>

		{#if announcement.photoUrl && !compact}
			<img
				src={announcement.thumbUrl}
				alt=""
				loading="lazy"
				onerror={(e) => fallbackToFull(e, announcement.photoUrl)}
				class="hidden border-s border-border object-cover sm:block sm:w-64 lg:w-80"
			/>
		{/if}
	</div>

	{#if announcement.photoUrl && !compact}
		<img
			src={announcement.thumbUrl}
			alt=""
			loading="lazy"
			onerror={(e) => fallbackToFull(e, announcement.photoUrl)}
			class="aspect-[16/9] w-full border-t border-border object-cover sm:hidden"
		/>
	{/if}
</article>
