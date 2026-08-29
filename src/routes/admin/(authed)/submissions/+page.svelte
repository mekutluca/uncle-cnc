<script lang="ts">
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import MailIcon from '@lucide/svelte/icons/mail';
	import MailOpenIcon from '@lucide/svelte/icons/mail-open';
	import ImageIcon from '@lucide/svelte/icons/image';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Empty from '$lib/components/ui/empty';
	import * as Table from '$lib/components/ui/table';
	import ConfirmDeleteDialog from '$lib/components/admin/confirm-delete-dialog.svelte';
	import { FORM_LABELS } from '$lib/data/form-fields';
	import { formatDateTime } from '$lib/utils/date-format';
	import { submitFormAction } from '$lib/utils/form-enhance';
	import type { FormSubmission } from '$lib/types';

	let { data } = $props();

	let deleteTarget = $state<FormSubmission | null>(null);
	let deleteOpen = $state(false);

	function toggleRead(submission: FormSubmission) {
		submitFormAction('?/toggleRead', {
			id: submission.id,
			is_read: String(!submission.is_read)
		});
	}
</script>

<svelte:head><title>Talepler | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-6xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<h1 class="display text-2xl">Talepler</h1>
	</div>

	<Card.Root class="py-0">
		<Card.Content class="p-0">
			{#if data.submissions.length === 0}
				<Empty.Root class="py-16">
					<Empty.Header>
						<Empty.Title>Talep yok</Empty.Title>
						<Empty.Description
							>Site formlarından gelen talepler burada listelenir.</Empty.Description
						>
					</Empty.Header>
				</Empty.Root>
			{:else}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head class="w-44">Tarih</Table.Head>
							<Table.Head>Form</Table.Head>
							<Table.Head>Ad Soyad</Table.Head>
							<Table.Head>Telefon</Table.Head>
							<Table.Head class="w-16">Foto</Table.Head>
							<Table.Head class="w-12"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each data.submissions as submission (submission.id)}
							<tr
								data-slot="table-row"
								class="cursor-pointer border-b transition-colors hover:bg-muted/50
									{submission.is_read ? 'text-muted-foreground' : 'font-medium'}"
								onclick={() => goto(`/admin/submissions/${submission.id}`)}
							>
								<Table.Cell>{formatDateTime(submission.created_at)}</Table.Cell>
								<Table.Cell>
									<Badge variant={submission.is_read ? 'secondary' : 'default'}>
										{FORM_LABELS[submission.form_name] ?? submission.form_name}
									</Badge>
								</Table.Cell>
								<Table.Cell>{submission.data.ad_soyad ?? '—'}</Table.Cell>
								<Table.Cell>{submission.data.telefon ?? '—'}</Table.Cell>
								<Table.Cell>
									{#if submission.photos.length}
										<span class="inline-flex items-center gap-1 text-sm">
											<ImageIcon class="size-3.5" />
											{submission.photos.length}
										</span>
									{:else}
										—
									{/if}
								</Table.Cell>
								<Table.Cell onclick={(e: MouseEvent) => e.stopPropagation()}>
									<DropdownMenu.Root>
										<DropdownMenu.Trigger>
											{#snippet child({ props })}
												<Button variant="ghost" size="icon" aria-label="İşlemler" {...props}>
													<MoreVerticalIcon class="size-4" />
												</Button>
											{/snippet}
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="end">
											<DropdownMenu.Item onclick={() => toggleRead(submission)}>
												{#if submission.is_read}
													<MailIcon size={14} />
													Okunmadı işaretle
												{:else}
													<MailOpenIcon size={14} />
													Okundu işaretle
												{/if}
											</DropdownMenu.Item>
											<DropdownMenu.Item
												variant="destructive"
												onclick={() => {
													deleteTarget = submission;
													deleteOpen = true;
												}}
											>
												<Trash2Icon size={14} />
												Sil
											</DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								</Table.Cell>
							</tr>
						{/each}
					</Table.Body>
				</Table.Root>
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<ConfirmDeleteDialog
	bind:open={deleteOpen}
	id={deleteTarget?.id ?? null}
	action="?/deleteSubmission"
	title="Talebi sil"
	description={`"${deleteTarget?.data.ad_soyad ?? FORM_LABELS[deleteTarget?.form_name ?? ''] ?? ''}" talebi ve fotoğrafları kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
/>
