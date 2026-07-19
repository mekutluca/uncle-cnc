<script lang="ts">
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import PhotoThumb from '$lib/components/site/PhotoThumb.svelte';
	import { formatPrice } from '$lib/utils/machine-format';
	import { publicPhotoUrl } from '$lib/utils/storage';
	import type { MachinePreview } from '$lib/types';

	let { slug }: { slug: string } = $props();

	/* Form sayfası prerender edildiği için ilan bilgisi tarayıcıda, anon REST ile
	   çekilir. Bulunamazsa (silinmiş/gizlenmiş ilan) kart sessizce görünmez —
	   gizli ilgili_ilan alanı yine gönderilir. */
	let preview = $state<MachinePreview | null>(null);

	$effect(() => {
		let cancelled = false;
		const query = new URLSearchParams({
			slug: `eq.${slug}`,
			select: 'title,price,currency,machine_type,photos',
			limit: '1'
		});
		fetch(`${PUBLIC_SUPABASE_URL}/rest/v1/uc_machines?${query}`, {
			headers: { apikey: PUBLIC_SUPABASE_ANON_KEY }
		})
			.then((response) => (response.ok ? response.json() : []))
			.then((rows: MachinePreview[]) => {
				if (!cancelled) preview = rows[0] ?? null;
			})
			.catch(() => {});
		return () => {
			cancelled = true;
		};
	});

	const price = $derived(preview ? formatPrice(preview.price, preview.currency) : null);
	const thumbnail = $derived(preview?.photos[0] ? publicPhotoUrl(preview.photos[0]) : null);
</script>

{#if preview}
	<div class="border-border bg-card border-s-safety flex items-center gap-4 rounded-md border border-s-2 p-3">
		<PhotoThumb src={thumbnail} alt={preview.title} class="aspect-[4/3] w-20" />
		<div class="min-w-0">
			<p class="eyebrow">İlgilenilen İlan</p>
			<p class="mt-1 truncate font-medium">{preview.title}</p>
			<p class="text-muted-foreground mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em]">
				{preview.machine_type}{#if price}<span class="text-primary normal-case tracking-normal">
						· {price}</span
					>{/if}
			</p>
		</div>
	</div>
{/if}
