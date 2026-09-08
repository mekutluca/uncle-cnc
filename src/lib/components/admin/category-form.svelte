<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance } from '$lib/utils/form-enhance';
	import type { SaleCategory } from '$lib/types';

	let {
		category = null,
		mode
	}: {
		category?: SaleCategory | null;
		mode: 'create' | 'edit';
	} = $props();

	/* Form alanı bilinçli olarak yalnızca İLK değerden başlar (bkz. machine-form).
	   Düzenleme sayfası {#key category.id} ile farklı kayıtta formu yeniden kurar. */
	// svelte-ignore state_referenced_locally
	let title = $state(category?.title ?? '');
	let saving = $state(false);

	const formEnhance = createFormEnhance({
		loadingMessage: 'Kaydediliyor…',
		onStart: () => (saving = true),
		onFinish: () => (saving = false),
		onSuccess: () => {
			if (mode === 'create') goto('/admin/categories');
		}
	});
</script>

<form
	method="POST"
	action={mode === 'create' ? '?/create' : '?/update'}
	use:enhance={formEnhance}
	class="grid gap-6"
>
	<Card.Root>
		<Card.Header>
			<Card.Title class="eyebrow">Kategori Bilgileri</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-1.5">
				<label class={labelClass} for="title">Başlık *</label>
				<Input id="title" name="title" required bind:value={title} placeholder="Örn. Tezgahlar" />
			</div>
		</Card.Content>
	</Card.Root>

	<div class="flex items-center justify-end gap-3">
		<Button type="button" variant="outline" href="/admin/categories" disabled={saving}
			>Vazgeç</Button
		>
		<Button type="submit" class="btn-label" disabled={saving}>
			{mode === 'create' ? 'Kategoriyi Ekle' : 'Değişiklikleri Kaydet'}
		</Button>
	</div>
</form>
