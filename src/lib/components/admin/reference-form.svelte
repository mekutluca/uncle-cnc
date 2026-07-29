<script lang="ts">
	import ImagePlusIcon from '@lucide/svelte/icons/image-plus';
	import XIcon from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance, submitFormAction } from '$lib/utils/form-enhance';
	import { prepareLogo } from '$lib/utils/image-resize';
	import type { PendingLogo, ReferenceWithLogo } from '$lib/types';

	let {
		reference = null,
		mode
	}: {
		reference?: ReferenceWithLogo | null;
		mode: 'create' | 'edit';
	} = $props();

	/* Form alanları bilinçli olarak yalnızca İLK değerden başlar (bkz. machine-form).
	   Düzenleme sayfası {#key reference.id} ile farklı kayıtta formu yeniden kurar. */
	// svelte-ignore state_referenced_locally
	const initial = {
		name: reference?.name ?? '',
		sector: reference?.sector ?? ''
	} as const;

	let name = $state(initial.name);
	let sector = $state(initial.sector);
	let pendingLogo = $state<PendingLogo | null>(null);
	let saving = $state(false);
	let logoBusy = $state(false);

	async function onLogoSelected(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		const prepared = await prepareLogo(file);
		if (pendingLogo) URL.revokeObjectURL(pendingLogo.url);
		pendingLogo = { file: prepared, url: URL.createObjectURL(prepared) };
	}

	function removePending() {
		if (pendingLogo) URL.revokeObjectURL(pendingLogo.url);
		pendingLogo = null;
	}

	onDestroy(removePending);

	async function deleteExistingLogo() {
		await submitFormAction(
			'?/deleteLogo',
			{},
			{
				loadingMessage: 'Logo siliniyor…',
				onStart: () => (logoBusy = true),
				onFinish: () => (logoBusy = false)
			}
		);
	}

	const formEnhance = createFormEnhance({
		loadingMessage: 'Kaydediliyor…',
		beforeSubmit: (formData) => {
			if (pendingLogo) formData.append('logo', pendingLogo.file);
		},
		onStart: () => (saving = true),
		onFinish: () => (saving = false),
		onSuccess: () => {
			removePending();
			if (mode === 'create') goto('/admin/references');
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
			<Card.Title class="eyebrow">Referans Bilgileri</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4 sm:grid-cols-2">
			<div class="grid gap-1.5">
				<label class={labelClass} for="name">Firma Adı *</label>
				<Input id="name" name="name" required bind:value={name} placeholder="Örn. Acme Makina" />
			</div>
			<div class="grid gap-1.5">
				<label class={labelClass} for="sector">Sektör</label>
				<Input
					id="sector"
					name="sector"
					bind:value={sector}
					placeholder="Örn. Otomotiv yan sanayi"
				/>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Logo</Card.Title>
			<Card.Description>
				PNG/SVG logolarda şeffaflık korunur. Logo yoksa sitede yalnızca firma adı görünür.
			</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			{#if reference?.logoUrl && !pendingLogo}
				<div class="relative max-w-sm">
					<div
						class="flex h-32 items-center justify-center rounded-md border border-border bg-muted/40 p-4"
					>
						<img
							src={reference.logoUrl}
							alt="{name} logosu"
							class="max-h-full max-w-full object-contain"
						/>
					</div>
					<Button
						type="button"
						variant="destructive"
						size="icon-sm"
						class="absolute top-1 right-1"
						aria-label="Logoyu sil"
						disabled={logoBusy}
						onclick={deleteExistingLogo}
					>
						<XIcon class="size-3.5" />
					</Button>
				</div>
			{/if}

			{#if pendingLogo}
				<div class="relative max-w-sm">
					<div
						class="flex h-32 items-center justify-center rounded-md border border-dashed border-safety bg-muted/40 p-4"
					>
						<img
							src={pendingLogo.url}
							alt="Yüklenecek logo"
							class="max-h-full max-w-full object-contain"
						/>
					</div>
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
				{#if reference?.logo}
					<p class="text-xs text-muted-foreground">Kaydedildiğinde mevcut logonun yerine geçer.</p>
				{/if}
			{/if}

			<label
				class="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-6 text-sm transition-colors hover:bg-muted"
			>
				<ImagePlusIcon class="size-4 text-muted-foreground" />
				{reference?.logo || pendingLogo ? 'Logoyu değiştir' : 'Logo seç'}
				<input type="file" accept="image/*,.svg" class="sr-only" onchange={onLogoSelected} />
			</label>
		</Card.Content>
	</Card.Root>

	<div class="flex items-center justify-end gap-3">
		<Button type="button" variant="outline" href="/admin/references" disabled={saving}
			>Vazgeç</Button
		>
		<Button type="submit" class="btn-label" disabled={saving}>
			{mode === 'create' ? 'Referansı Ekle' : 'Değişiklikleri Kaydet'}
		</Button>
	</div>
</form>
