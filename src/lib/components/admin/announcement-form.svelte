<script lang="ts">
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Switch } from '$lib/components/ui/switch';
	import { Textarea } from '$lib/components/ui/textarea';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance, submitFormAction } from '$lib/utils/form-enhance';
	import { makeThumb, resizeImage } from '$lib/utils/image-resize';
	import {
		ANNOUNCEMENT_LIMITS,
		addDaysToDayKey,
		formatDayKeyMedium,
		istanbulDayKey,
		lastDayKey
	} from '$lib/utils/announcements';
	import type { AnnouncementWithPhoto, PendingPhoto } from '$lib/types';

	let {
		announcement = null,
		mode
	}: {
		announcement?: AnnouncementWithPhoto | null;
		mode: 'create' | 'edit';
	} = $props();

	const {
		title: TITLE_MAX,
		body: BODY_MAX,
		linkLabel: LINK_LABEL_MAX,
		popupDaysMin: POPUP_DAYS_MIN,
		popupDaysMax: POPUP_DAYS_MAX,
		popupDaysDefault: POPUP_DAYS_DEFAULT
	} = ANNOUNCEMENT_LIMITS;

	/* Form alanları bilinçli olarak yalnızca İLK değerden başlar (bkz. machine-form).
	   Düzenleme sayfası {#key announcement.id} ile farklı kayıtta formu yeniden kurar. */
	// svelte-ignore state_referenced_locally
	const initial = {
		title: announcement?.title ?? '',
		body: announcement?.body ?? '',
		linkUrl: announcement?.link_url ?? '',
		linkLabel: announcement?.link_label ?? '',
		startsOn: announcement ? istanbulDayKey(announcement.starts_at) : istanbulDayKey(Date.now()),
		endsOn: announcement?.ends_at ? lastDayKey(announcement.ends_at) : '',
		published: announcement?.published ?? true,
		popup: announcement?.popup ?? false,
		popupDays: announcement?.popup_days ?? POPUP_DAYS_DEFAULT
	} as const;

	let title = $state(initial.title);
	let body = $state(initial.body);
	let linkUrl = $state(initial.linkUrl);
	let linkLabel = $state(initial.linkLabel);
	let startsOn = $state(initial.startsOn);
	let endsOn = $state(initial.endsOn);
	let published = $state(initial.published);
	let popup = $state(initial.popup);
	let popupDays = $state<number>(initial.popupDays);
	let pendingPhoto = $state<PendingPhoto | null>(null);
	let saving = $state(false);
	let photoBusy = $state(false);

	/** Açılır mesajın kapsayıcı son günü: ilk gün + süre - 1, duyurunun son gününü aşmaz. */
	const popupLastDay = $derived.by(() => {
		if (!startsOn) return null;
		const days = Math.min(Math.max(Math.trunc(popupDays || 0), POPUP_DAYS_MIN), POPUP_DAYS_MAX);
		const byDays = addDaysToDayKey(startsOn, days - 1);
		return endsOn && endsOn < byDays ? endsOn : byDays;
	});

	async function onPhotoSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		const resized = await resizeImage(file);
		if (pendingPhoto) URL.revokeObjectURL(pendingPhoto.url);
		pendingPhoto = {
			id: crypto.randomUUID(),
			file: resized,
			thumb: await makeThumb(resized),
			url: URL.createObjectURL(resized)
		};
	}

	function removePending() {
		if (pendingPhoto) URL.revokeObjectURL(pendingPhoto.url);
		pendingPhoto = null;
	}

	onDestroy(removePending);

	async function deleteExistingPhoto() {
		await submitFormAction(
			'?/deletePhoto',
			{},
			{
				loadingMessage: 'Fotoğraf siliniyor…',
				onStart: () => (photoBusy = true),
				onFinish: () => (photoBusy = false)
			}
		);
	}

	const formEnhance = createFormEnhance({
		loadingMessage: 'Kaydediliyor…',
		beforeSubmit: (formData) => {
			if (pendingPhoto) {
				formData.append('photo', pendingPhoto.file);
				formData.append('photo_thumb', pendingPhoto.thumb);
			}
		},
		onStart: () => (saving = true),
		onFinish: () => (saving = false),
		onSuccess: () => {
			removePending();
			if (mode === 'create') goto('/admin/announcements');
		}
	});
</script>

<form
	method="POST"
	action={mode === 'create' ? '?/create' : '?/update'}
	enctype="multipart/form-data"
	use:enhance={formEnhance}
	class="grid gap-6"
>
	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Duyuru</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-1.5">
				<label class={labelClass} for="title">Başlık *</label>
				<Input
					id="title"
					name="title"
					required
					maxlength={TITLE_MAX}
					bind:value={title}
					placeholder="Örn. Stoğa yeni dik işleme merkezi geldi"
				/>
			</div>
			<div class="grid gap-1.5">
				<div class="flex items-baseline justify-between gap-3">
					<label class={labelClass} for="body">Metin *</label>
					<span class="font-mono text-[11px] text-muted-foreground tabular-nums">
						{body.length} / {BODY_MAX}
					</span>
				</div>
				<Textarea
					id="body"
					name="body"
					required
					rows={5}
					maxlength={BODY_MAX}
					bind:value={body}
					placeholder="Duyuru metni. Boş satır yeni paragraf açar."
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Yayın</Card.Title>
			<Card.Description>
				Duyuru ilk günden son güne kadar sitede görünür. Son gün boş bırakılırsa süresiz kalır.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5">
				<label class={labelClass} for="starts_on">İlk gün *</label>
				<Input id="starts_on" name="starts_on" type="date" required bind:value={startsOn} />
			</div>
			<div class="grid gap-1.5">
				<label class={labelClass} for="ends_on">Son gün</label>
				<Input id="ends_on" name="ends_on" type="date" min={startsOn} bind:value={endsOn} />
			</div>
			<div class="flex items-center gap-3 sm:col-span-2">
				<Switch id="published" bind:checked={published} />
				<input type="hidden" name="published" value={published ? 'true' : 'false'} />
				<label for="published" class="text-sm font-medium">Sitede göster</label>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Bağlantı</Card.Title>
			<Card.Description>
				İsteğe bağlı. Site içi yol (örn. /machines/ilan-adi) ya da dış adres. Boşsa kart duyuru
				sayfasına götürür.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5">
				<label class={labelClass} for="link_url">Bağlantı</label>
				<Input
					id="link_url"
					name="link_url"
					inputmode="url"
					bind:value={linkUrl}
					placeholder="/machines/… veya https://…"
				/>
			</div>
			<div class="grid gap-1.5">
				<label class={labelClass} for="link_label">Bağlantı yazısı</label>
				<Input
					id="link_label"
					name="link_label"
					maxlength={LINK_LABEL_MAX}
					disabled={!linkUrl.trim()}
					bind:value={linkLabel}
					placeholder="Örn. İlana git"
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Fotoğraf</Card.Title>
			<Card.Description>
				İsteğe bağlı. Yüklenmeden önce otomatik küçültülür (~1600px). Fotoğraf yoksa kart yalnız
				metinle çizilir.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{#if announcement?.photoUrl && !pendingPhoto}
				<div class="group relative max-w-sm">
					<img
						src={announcement.photoUrl}
						alt="Duyuru fotoğrafı"
						class="aspect-[4/3] w-full rounded-md border border-border object-cover"
					/>
					<Button
						type="button"
						variant="destructive"
						size="icon-sm"
						class="absolute top-1 right-1"
						aria-label="Fotoğrafı sil"
						disabled={photoBusy}
						onclick={deleteExistingPhoto}
					>
						<XIcon class="size-3.5" />
					</Button>
				</div>
			{/if}

			{#if pendingPhoto}
				<div class="relative max-w-sm">
					<img
						src={pendingPhoto.url}
						alt="Yüklenecek fotoğraf"
						class="aspect-[4/3] w-full rounded-md border border-dashed border-safety object-cover opacity-90"
					/>
					<Button
						type="button"
						variant="destructive"
						size="icon-sm"
						class="absolute top-1 right-1"
						aria-label="Vazgeç"
						onclick={removePending}
					>
						<XIcon class="size-3.5" />
					</Button>
				</div>
				{#if announcement?.photo}
					<p class="text-xs text-muted-foreground">
						Kaydedildiğinde mevcut fotoğrafın yerine geçer.
					</p>
				{/if}
			{/if}

			<label
				class="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm transition-colors hover:bg-muted"
			>
				<ImagePlusIcon class="size-4 text-muted-foreground" />
				{announcement?.photo || pendingPhoto ? 'Fotoğrafı değiştir' : 'Fotoğraf seç'}
				<input type="file" accept="image/*" class="sr-only" onchange={onPhotoSelected} />
			</label>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Açılır mesaj</Card.Title>
			<Card.Description>
				Ziyaretçi siteye girdiğinde köşede açılan mesaj. Her ziyaretçi bir kez görür, kapattıktan
				sonra bu duyuru için tekrar çıkmaz.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="flex items-center gap-3">
				<Switch id="popup" bind:checked={popup} />
				<input type="hidden" name="popup" value={popup ? 'true' : 'false'} />
				<label for="popup" class="text-sm font-medium">Ziyaretçiye açılır mesaj olarak göster</label
				>
			</div>
			{#if popup}
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="grid gap-1.5">
						<label class={labelClass} for="popup_days">Süre (gün) *</label>
						<Input
							id="popup_days"
							name="popup_days"
							type="number"
							required
							min={POPUP_DAYS_MIN}
							max={POPUP_DAYS_MAX}
							step={1}
							bind:value={popupDays}
						/>
					</div>
					<p class="self-end pb-2.5 text-sm text-muted-foreground">
						{#if popupLastDay}
							Açılır mesaj <span class="font-mono text-foreground"
								>{formatDayKeyMedium(startsOn)}</span
							>
							– <span class="font-mono text-foreground">{formatDayKeyMedium(popupLastDay)}</span>
							arasında gösterilir.
						{:else}
							İlk günü seçince süre burada görünür.
						{/if}
					</p>
				</div>
			{:else}
				<input type="hidden" name="popup_days" value={popupDays} />
			{/if}
		</Card.Content>
	</Card.Root>

	<div class="flex items-center justify-end gap-3">
		<Button type="button" variant="outline" href="/admin/announcements" disabled={saving}
			>Vazgeç</Button
		>
		<Button type="submit" class="btn-label" disabled={saving}>
			{mode === 'create' ? 'Duyuruyu Ekle' : 'Değişiklikleri Kaydet'}
		</Button>
	</div>
</form>
