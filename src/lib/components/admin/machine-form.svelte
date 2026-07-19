<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import XIcon from '@lucide/svelte/icons/x';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Textarea } from '$lib/components/ui/textarea';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance, submitFormAction } from '$lib/utils/form-enhance';
	import { resizeImage } from '$lib/utils/image-resize';
	import { slugify } from '$lib/utils/slugify';
	import { MACHINE_TYPES } from '$lib/data/machine-options';
	import type { Machine, PendingPhoto } from '$lib/types';

	let {
		machine = null,
		mode
	}: {
		machine?: (Machine & { photoUrls: string[] }) | null;
		mode: 'create' | 'edit';
	} = $props();

	const STATUS_LABEL: Record<Machine['status'], string> = {
		available: 'Satışta',
		sold: 'Satıldı',
		hidden: 'Gizli'
	};
	const CURRENCY_LABEL: Record<Machine['currency'], string> = { EUR: '€', USD: '$', TRY: 'TL' };

	/* Form alanları bilinçli olarak yalnızca İLK değerden başlar: kullanıcı yazarken
	   sunucu verisi alanların üzerine yazmamalı. Düzenleme sayfası {#key machine.id}
	   ile farklı makinede formu yeniden kurar. */
	// svelte-ignore state_referenced_locally
	const initial = {
		title: machine?.title ?? '',
		slug: machine?.slug ?? '',
		slugTouched: mode === 'edit',
		machineType: machine?.machine_type ?? '',
		status: machine?.status ?? 'available',
		currency: machine?.currency ?? 'EUR',
		price: machine?.price?.toString() ?? '',
		description: machine?.description ?? '',
		specs: Object.entries(machine?.specs ?? {}).map(([key, value]) => ({
			key,
			value: String(value)
		}))
	} as const;

	let title = $state(initial.title);
	let slug = $state(initial.slug);
	let slugTouched = $state(initial.slugTouched);
	let machineType = $state(initial.machineType);
	let status = $state<Machine['status']>(initial.status);
	let currency = $state<Machine['currency']>(initial.currency);
	let price = $state(initial.price);
	let description = $state(initial.description);
	let specs = $state(initial.specs.map((spec) => ({ ...spec })));
	let pendingPhotos = $state<PendingPhoto[]>([]);
	let saving = $state(false);
	let photoBusy = $state(false);

	// Mevcut fotoğraflar sunucu verisinden türetilir; sil/sırala invalidate ile tazelenir.
	const existingPhotos = $derived(
		(machine?.photos ?? []).map((path, index) => ({ path, url: machine?.photoUrls[index] ?? '' }))
	);

	function onTitleInput() {
		if (!slugTouched) slug = slugify(title);
	}

	async function onPhotosSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		input.value = '';
		for (const file of files) {
			const resized = await resizeImage(file);
			pendingPhotos.push({
				id: crypto.randomUUID(),
				file: resized,
				url: URL.createObjectURL(resized)
			});
		}
	}

	function removePending(id: string) {
		const photo = pendingPhotos.find((p) => p.id === id);
		if (photo) URL.revokeObjectURL(photo.url);
		pendingPhotos = pendingPhotos.filter((p) => p.id !== id);
	}

	onDestroy(() => {
		pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
	});

	async function deleteExistingPhoto(path: string) {
		await submitFormAction(
			'?/deletePhoto',
			{ path },
			{
				loadingMessage: 'Fotoğraf siliniyor…',
				onStart: () => (photoBusy = true),
				onFinish: () => (photoBusy = false)
			}
		);
	}

	async function moveExistingPhoto(index: number, direction: -1 | 1) {
		const order = existingPhotos.map((photo) => photo.path);
		const target = index + direction;
		if (target < 0 || target >= order.length) return;
		[order[index], order[target]] = [order[target], order[index]];
		await submitFormAction(
			'?/reorderPhotos',
			{ paths: JSON.stringify(order) },
			{
				onStart: () => (photoBusy = true),
				onFinish: () => (photoBusy = false)
			}
		);
	}

	const formEnhance = createFormEnhance({
		loadingMessage: 'Kaydediliyor…',
		beforeSubmit: (formData) => {
			pendingPhotos.forEach((photo) => formData.append('photos', photo.file));
		},
		onStart: () => (saving = true),
		onFinish: () => (saving = false),
		onSuccess: () => {
			pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
			pendingPhotos = [];
			if (mode === 'create') goto('/admin/machines');
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
			<Card.Title class="eyebrow">İlan Bilgileri</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5 sm:col-span-2">
				<label class={labelClass} for="title">Başlık *</label>
				<Input
					id="title"
					name="title"
					required
					bind:value={title}
					oninput={onTitleInput}
					placeholder="Örn. Mazak VTC-200 Dik İşleme Merkezi"
				/>
			</div>
			<div class="grid gap-1.5 sm:col-span-2">
				<label class={labelClass} for="slug">Kısa Ad (URL) *</label>
				<Input
					id="slug"
					name="slug"
					required
					bind:value={slug}
					oninput={() => (slugTouched = true)}
					placeholder="mazak-vtc-200"
					class="font-mono text-sm"
				/>
			</div>
			<div class="grid gap-1.5">
				<span class={labelClass}>Makine Cinsi *</span>
				<Select.Root type="single" name="machine_type" bind:value={machineType}>
					<Select.Trigger class="w-full">{machineType || 'Seçiniz'}</Select.Trigger>
					<Select.Content>
						{#each MACHINE_TYPES as type (type)}
							<Select.Item value={type}>{type}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-1.5">
				<span class={labelClass}>Durum *</span>
				<Select.Root type="single" name="status" bind:value={status}>
					<Select.Trigger class="w-full">{STATUS_LABEL[status]}</Select.Trigger>
					<Select.Content>
						{#each Object.entries(STATUS_LABEL) as [value, label] (value)}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-1.5">
				<label class={labelClass} for="price">Fiyat (boş = "Fiyat için sorunuz")</label>
				<Input id="price" name="price" type="number" min="0" bind:value={price} placeholder="45000" />
			</div>
			<div class="grid gap-1.5">
				<span class={labelClass}>Para Birimi *</span>
				<Select.Root type="single" name="currency" bind:value={currency}>
					<Select.Trigger class="w-full">{CURRENCY_LABEL[currency]}</Select.Trigger>
					<Select.Content>
						{#each Object.entries(CURRENCY_LABEL) as [value, label] (value)}
							<Select.Item {value}>{label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-1.5 sm:col-span-2">
				<label class={labelClass} for="description">Açıklama</label>
				<Textarea
					id="description"
					name="description"
					rows={4}
					bind:value={description}
					placeholder="Makinenin durumu, bakım geçmişi, öne çıkan özellikleri…"
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex-row items-center justify-between">
			<Card.Title class="eyebrow">Teknik Özellikler</Card.Title>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onclick={() => specs.push({ key: '', value: '' })}
			>
				<PlusIcon class="size-4" />
				Özellik Ekle
			</Button>
		</Card.Header>
		<Card.Content class="grid gap-2">
			{#if specs.length === 0}
				<p class="text-muted-foreground text-sm">
					Örn. "Model Yılı → 2018", "Tabla Boyutu → 1000x500 mm", "Kontrol → Fanuc".
				</p>
			{/if}
			{#each specs as spec, index (index)}
				<div class="flex gap-2">
					<Input name="spec_key" bind:value={spec.key} placeholder="Özellik (örn. Model Yılı)" />
					<Input name="spec_value" bind:value={spec.value} placeholder="Değer (örn. 2018)" />
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Özelliği kaldır"
						onclick={() => specs.splice(index, 1)}
					>
						<XIcon class="size-4" />
					</Button>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Fotoğraflar</Card.Title>
			<Card.Description>
				İlk fotoğraf kapak görseli olur. Fotoğraflar yüklenmeden önce otomatik küçültülür (~1600px).
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{#if existingPhotos.length > 0}
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
					{#each existingPhotos as photo, index (photo.path)}
						<div class="group relative">
							<img
								src={photo.url}
								alt="Makine fotoğrafı {index + 1}"
								class="border-border aspect-[4/3] w-full rounded-md border object-cover"
							/>
							{#if index === 0}
								<span
									class="bg-safety text-steel absolute left-1 top-1 rounded-sm px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em]"
								>
									Kapak
								</span>
							{/if}
							<div class="absolute bottom-1 right-1 flex gap-1">
								<Button
									type="button"
									variant="secondary"
									size="icon-sm"
									aria-label="Sola taşı"
									disabled={photoBusy || index === 0}
									onclick={() => moveExistingPhoto(index, -1)}
								>
									<ArrowLeftIcon class="size-3.5" />
								</Button>
								<Button
									type="button"
									variant="secondary"
									size="icon-sm"
									aria-label="Sağa taşı"
									disabled={photoBusy || index === existingPhotos.length - 1}
									onclick={() => moveExistingPhoto(index, 1)}
								>
									<ArrowRightIcon class="size-3.5" />
								</Button>
								<Button
									type="button"
									variant="destructive"
									size="icon-sm"
									aria-label="Fotoğrafı sil"
									disabled={photoBusy}
									onclick={() => deleteExistingPhoto(photo.path)}
								>
									<XIcon class="size-3.5" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{/if}

			{#if pendingPhotos.length > 0}
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
					{#each pendingPhotos as photo (photo.id)}
						<div class="relative">
							<img
								src={photo.url}
								alt="Yüklenecek fotoğraf"
								class="border-safety aspect-[4/3] w-full rounded-md border border-dashed object-cover opacity-90"
							/>
							<Button
								type="button"
								variant="destructive"
								size="icon-sm"
								class="absolute right-1 top-1"
								aria-label="Vazgeç"
								onclick={() => removePending(photo.id)}
							>
								<XIcon class="size-3.5" />
							</Button>
						</div>
					{/each}
				</div>
			{/if}

			<label
				class="border-border hover:bg-muted flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-sm transition-colors"
			>
				<ImagePlusIcon class="text-muted-foreground size-4" />
				Fotoğraf seç veya sürükleyip bırak
				<input type="file" accept="image/*" multiple class="sr-only" onchange={onPhotosSelected} />
			</label>
		</Card.Content>
	</Card.Root>

	<div class="flex items-center justify-end gap-3">
		<Button type="button" variant="outline" href="/admin/machines" disabled={saving}>Vazgeç</Button>
		<Button type="submit" class="btn-label" disabled={saving}>
			{mode === 'create' ? 'İlanı Oluştur' : 'Değişiklikleri Kaydet'}
		</Button>
	</div>
</form>
