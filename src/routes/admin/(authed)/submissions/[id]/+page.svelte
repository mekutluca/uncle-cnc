<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import ConfirmDeleteDialog from '$lib/components/admin/confirm-delete-dialog.svelte';
	import { FORM_LABELS, orderedEntries } from '$lib/data/form-fields';
	import { formatDateTime } from '$lib/utils/date-format';

	let { data } = $props();
	let { submission, photoUrls } = $derived(data);

	let deleteOpen = $state(false);

	const formLabel = $derived(FORM_LABELS[submission.form_name] ?? submission.form_name);
	const entries = $derived(orderedEntries(submission.data));
</script>

<svelte:head><title>Talep: {formLabel} | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<Button variant="ghost" size="icon" href="/admin/submissions" aria-label="Taleplere dön">
				<ArrowLeftIcon class="size-4" />
			</Button>
			<div>
				<h1 class="display text-2xl">
					{formLabel}
					<Badge class="ms-2 align-middle">{submission.data.ad_soyad ?? '—'}</Badge>
				</h1>
				<p class="text-sm text-muted-foreground">{formatDateTime(submission.created_at, 'long')}</p>
			</div>
		</div>
		<Button variant="destructive" class="btn-label" onclick={() => (deleteOpen = true)}>
			<Trash2Icon class="size-4" />
			Sil
		</Button>
	</div>

	<Card.Root>
		<Card.Content>
			<dl class="grid gap-x-6 gap-y-3 sm:grid-cols-[max-content_1fr]">
				{#each entries as [label, value] (label)}
					<dt class="eyebrow self-center">{label}</dt>
					<dd class="text-sm whitespace-pre-wrap">
						{#if label === 'Telefon'}
							<a class="underline underline-offset-2" href="tel:{value.replaceAll(' ', '')}"
								>{value}</a
							>
						{:else if label === 'E-posta'}
							<a class="underline underline-offset-2" href="mailto:{value}">{value}</a>
						{:else}
							{value}
						{/if}
					</dd>
				{/each}
			</dl>
		</Card.Content>
	</Card.Root>

	{#if submission.photos.length}
		<Card.Root class="mt-4">
			<Card.Header>
				<Card.Title>Fotoğraflar ({submission.photos.length})</Card.Title>
			</Card.Header>
			<Card.Content>
				{#if photoUrls.length}
					<div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
						{#each photoUrls as url, index (url)}
							<a href={url} target="_blank" rel="noreferrer" class="block">
								<img
									src={url}
									alt="Talep fotoğrafı {index + 1}"
									class="aspect-square w-full rounded-md border object-cover"
									loading="lazy"
								/>
							</a>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">Fotoğraf bağlantıları oluşturulamadı.</p>
				{/if}
			</Card.Content>
		</Card.Root>
	{/if}
</div>

<ConfirmDeleteDialog
	bind:open={deleteOpen}
	id={submission.id}
	action="?/deleteSubmission"
	title="Talebi sil"
	description={`Bu ${formLabel.toLocaleLowerCase('tr-TR')} talebi ve fotoğrafları kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
/>
