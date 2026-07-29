<script lang="ts">
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance, submitFormAction } from '$lib/utils/form-enhance';
	import { makeThumb, resizeImage } from '$lib/utils/image-resize';
	import { services, serviceBySlug } from '$lib/data/services';
	import type { GalleryItemWithUrl, PendingPhoto } from '$lib/types';

	let {
		item = null,
		mode
	}: {
		item?: GalleryItemWithUrl | null;
		mode: 'create' | 'edit';
	} = $props();

	/* Form alanları bilinçli olarak yalnızca İLK değerden başlar (bkz. machine-form).
	   Düzenleme sayfası {#key item.id} ile farklı öğede formu yeniden kurar. */
	// svelte-ignore state_referenced_locally
	const initial = {
		label: item?.label ?? '',
		description: item?.description ?? '',
		serviceSlug: item?.service_slug ?? ''
	} as const;

	let label = $state(initial.label);
	let description = $state(initial.description);
	let serviceSlug = $state(initial.serviceSlug);
	let pendingPhoto = $state<PendingPhoto | null>(null);
	let saving = $state(false);
	let photoBusy = $state(false);

	const serviceTitle = $derived(serviceBySlug(serviceSlug)?.title ?? 'Yok');

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
			if (mode === 'create') goto('/admin/gallery');
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
			<Card.Title class="eyebrow">Galeri Bilgileri</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5">
				<label class={labelClass} for="label">Etiket *</label>
				<Input id="label" name="label" required bind:value={label} placeholder="Örn. REVİZYON" />
			</div>
			<div class="grid gap-1.5">
				<span class={labelClass}>İlgili Hizmet</span>
				<Select.Root type="single" bind:value={serviceSlug}>
					<Select.Trigger class="w-full">{serviceTitle}</Select.Trigger>
					<Select.Content>
						<Select.Item value="">Yok</Select.Item>
						{#each services as service (service.slug)}
							<Select.Item value={service.slug}>{service.title}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<input type="hidden" name="service_slug" value={serviceSlug} />
			</div>
			<div class="grid gap-1.5 sm:col-span-2">
				<label class={labelClass} for="description">Açıklama *</label>
				<Input
					id="description"
					name="description"
					required
					bind:value={description}
					placeholder="Örn. Dik işleme merkezi komple revizyon"
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Fotoğraf</Card.Title>
			<Card.Description>
				Fotoğraf yüklenmeden önce otomatik küçültülür (~1600px). Fotoğraf yoksa sitede desenli yer
				tutucu görünür.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{#if item?.photoUrl && !pendingPhoto}
				<div class="group relative max-w-sm">
					<img
						src={item.photoUrl}
						alt="Galeri fotoğrafı"
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
				{#if item?.photo}
					<p class="text-xs text-muted-foreground">
						Kaydedildiğinde mevcut fotoğrafın yerine geçer.
					</p>
				{/if}
			{/if}

			<label
				class="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm transition-colors hover:bg-muted"
			>
				<ImagePlusIcon class="size-4 text-muted-foreground" />
				{item?.photo || pendingPhoto ? 'Fotoğrafı değiştir' : 'Fotoğraf seç'}
				<input type="file" accept="image/*" class="sr-only" onchange={onPhotoSelected} />
			</label>
		</Card.Content>
	</Card.Root>

	<div class="flex items-center justify-end gap-3">
		<Button type="button" variant="outline" href="/admin/gallery" disabled={saving}>Vazgeç</Button>
		<Button type="submit" class="btn-label" disabled={saving}>
			{mode === 'create' ? 'Öğeyi Ekle' : 'Değişiklikleri Kaydet'}
		</Button>
	</div>
</form>
