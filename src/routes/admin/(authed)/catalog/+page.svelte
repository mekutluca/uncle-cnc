<script lang="ts">
	import FileUpIcon from '@lucide/svelte/icons/file-up';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { formatDateTime } from '$lib/utils/date-format';
	import { formatMegabytes } from '$lib/utils/locale-format';
	import { CATALOG_BUCKET, CATALOG_ROUTE } from '$lib/utils/storage';

	/** Bucket sınırıyla aynı (50 MB). */
	const MAX_BYTES = 52_428_800;

	let { data } = $props();
	let uploading = $state(false);
	/** 0-100 arası yüklenen yüzde. */
	let progress = $state(0);
	let uploadingBytes = $state(0);

	let qrHref = $derived(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.qrSvg)}`);

	// Dosya sunucudan geçmez (gövde sınırı 16 MB): tarayıcıdan doğrudan depoya yüklenir.
	async function onFileSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		if (file.type !== 'application/pdf') return void toast.error('Yalnızca PDF yüklenebilir.');
		if (file.size > MAX_BYTES) return void toast.error('Dosya 50 MB sınırını aşıyor.');

		uploading = true;
		progress = 0;
		uploadingBytes = file.size;
		// Her yükleme yeni adla gider: CDN'de eski sürüm kalmaz.
		const name = `katalog-${Date.now()}.pdf`;
		const errorMessage = await uploadWithProgress(name, file);
		if (errorMessage) {
			uploading = false;
			return void toast.error(`Katalog yüklenemedi: ${errorMessage}`);
		}

		const bucket = data.supabase.storage.from(CATALOG_BUCKET);
		const { data: files } = await bucket.list();
		const stale = (files ?? []).map((entry) => entry.name).filter((entry) => entry !== name);
		if (stale.length) await bucket.remove(stale);

		await invalidateAll();
		uploading = false;
		toast.success('Katalog güncellendi. Bağlantı ve QR kod aynı kaldı.');
	}

	// supabase-js ilerleme bildirmez. Aynı depo uç noktasına XHR ile gidilir ki
	// büyük dosyada yüzde gösterilebilsin. Hata mesajı döner, başarıda null.
	async function uploadWithProgress(name: string, file: File): Promise<string | null> {
		const {
			data: { session }
		} = await data.supabase.auth.getSession();
		if (!session) return 'Oturum süresi dolmuş, yeniden giriş yapın.';

		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			xhr.open('POST', `${PUBLIC_SUPABASE_URL}/storage/v1/object/${CATALOG_BUCKET}/${name}`);
			xhr.setRequestHeader('authorization', `Bearer ${session.access_token}`);
			xhr.setRequestHeader('apikey', PUBLIC_SUPABASE_ANON_KEY);
			xhr.setRequestHeader('content-type', 'application/pdf');
			xhr.setRequestHeader('cache-control', 'max-age=31536000');
			xhr.upload.onprogress = (event) => {
				if (event.lengthComputable) progress = Math.round((event.loaded / event.total) * 100);
			};
			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) return resolve(null);
				let message = `HTTP ${xhr.status}`;
				try {
					message = (JSON.parse(xhr.responseText) as { message?: string }).message ?? message;
				} catch {
					// Gövde JSON değilse durum kodu yeterli.
				}
				resolve(message);
			};
			xhr.onerror = () => resolve('Bağlantı kesildi.');
			xhr.send(file);
		});
	}

	async function copyLink() {
		await navigator.clipboard.writeText(data.link);
		toast.success('Bağlantı kopyalandı.');
	}
</script>

<svelte:head><title>Katalog | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<h1 class="display mb-2 text-2xl">Katalog</h1>
	<p class="mb-6 text-sm text-muted-foreground">
		Satılık makineler sayfasındaki indirme düğmesi ve basılı kartlardaki QR kod bu dosyayı indirir.
	</p>

	<div class="grid gap-6">
		<Card.Root>
			<Card.Content class="grid gap-4">
				<span class={labelClass}>Yayındaki dosya</span>
				{#await data.catalog}
					<Skeleton class="h-6 w-64" />
				{:then catalog}
					{#if catalog}
						<div class="flex flex-wrap items-center justify-between gap-3">
							<p class="font-mono text-sm">
								PDF · {formatMegabytes(catalog.size)}
								{#if catalog.uploadedAt}
									<span class="block text-xs text-muted-foreground">
										{formatDateTime(catalog.uploadedAt, 'long')}
									</span>
								{/if}
							</p>
							<Button variant="outline" size="sm" href={CATALOG_ROUTE} data-sveltekit-reload>
								<DownloadIcon class="size-4" />
								İndirmeyi dene
							</Button>
						</div>
					{:else}
						<p class="text-sm text-muted-foreground">
							Henüz katalog yüklenmedi. Yüklenene kadar sitede indirme düğmesi görünmez.
						</p>
					{/if}
				{/await}

				{#if uploading}
					<div class="grid gap-3 rounded-md border border-border px-4 py-5">
						<div class="flex items-baseline justify-between gap-3 font-mono text-sm">
							<span>{progress < 100 ? 'Yükleniyor…' : 'Tamamlanıyor…'}</span>
							<span class="text-muted-foreground">
								{formatMegabytes((uploadingBytes * progress) / 100)} / {formatMegabytes(
									uploadingBytes
								)}
							</span>
						</div>
						<div
							class="h-2 overflow-hidden rounded-sm bg-muted"
							role="progressbar"
							aria-label="Katalog yükleme ilerlemesi"
							aria-valuemin={0}
							aria-valuemax={100}
							aria-valuenow={progress}
						>
							<div
								class="h-full origin-left bg-primary transition-transform duration-200 ease-out"
								style="transform: scaleX({progress / 100})"
							></div>
						</div>
						<p class="text-xs text-muted-foreground">Yükleme bitene kadar bu sayfayı kapatmayın.</p>
					</div>
				{:else}
					<label
						class={[
							'flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm transition-colors hover:bg-muted',
							'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50'
						]}
					>
						<FileUpIcon class="size-4 text-muted-foreground" />
						Yeni PDF seç (en çok 50 MB)
						<input type="file" accept="application/pdf" class="sr-only" onchange={onFileSelected} />
					</label>
				{/if}
				<p class="text-xs text-muted-foreground">
					Yeni dosya eskisinin yerine geçer. Bağlantı ve QR kod değişmez, kartları yeniden bastırmak
					gerekmez.
				</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Content class="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
				<!-- QR her temada okunabilsin diye zemin beyaz kalır. -->
				<div class="w-40 rounded-md border border-border bg-white p-1 [&>svg]:block">
					{@html data.qrSvg}
				</div>
				<div class="grid gap-4">
					<div class="grid gap-1.5">
						<span class={labelClass}>Kalıcı bağlantı</span>
						<p class="font-mono text-sm break-all" dir="ltr">{data.link}</p>
					</div>
					<p class="text-xs text-muted-foreground">
						Kartlara bu QR kodu koyun. Matbaaya SVG dosyasını verin, her boyutta net basılır.
					</p>
					<div class="flex flex-wrap gap-3">
						<Button variant="outline" size="sm" href={qrHref} download="uncle-cnc-katalog-qr.svg">
							<DownloadIcon class="size-4" />
							QR kodu indir (SVG)
						</Button>
						<Button variant="outline" size="sm" onclick={copyLink}>
							<CopyIcon class="size-4" />
							Bağlantıyı kopyala
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
