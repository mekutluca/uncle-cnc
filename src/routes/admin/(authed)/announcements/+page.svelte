<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import MegaphoneIcon from '@lucide/svelte/icons/megaphone';
	import { goto } from '$app/navigation';
	import { Badge, type BadgeVariant } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import ConfirmDeleteDialog from '$lib/components/admin/confirm-delete-dialog.svelte';
	import PhotoThumb from '$lib/components/site/PhotoThumb.svelte';
	import {
		announcementStateLabel,
		announcementStateOf,
		formatWindow,
		isPopupOpen,
		popupDaysLeft
	} from '$lib/utils/announcements';
	import type { AnnouncementState, AnnouncementWithPhoto } from '$lib/types';

	let { data } = $props();

	let deleteTarget = $state<AnnouncementWithPhoto | null>(null);
	let deleteOpen = $state(false);

	const badgeVariant: Record<AnnouncementState, BadgeVariant> = {
		live: 'default',
		scheduled: 'outline',
		ended: 'ghost',
		draft: 'secondary'
	};

	function popupLabel(a: AnnouncementWithPhoto, now: number): string {
		if (!a.popup) return '—';
		if (isPopupOpen(a, now)) return `${popupDaysLeft(a, now)} gün kaldı`;
		return announcementStateOf(a, now) === 'scheduled' ? 'Başlayınca' : 'Bitti';
	}
</script>

<svelte:head><title>Duyurular | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-6xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<h1 class="display text-2xl">Duyurular</h1>
		<Button href="/admin/announcements/new" class="btn-label">
			<PlusIcon class="size-4" />
			Yeni Duyuru
		</Button>
	</div>

	<Card.Root class="py-0">
		<Card.Content class="p-0">
			{#await data.announcements}
				<div class="grid gap-3 p-4">
					{#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
						<Skeleton class="h-14 w-full" />
					{/each}
				</div>
			{:then rows}
				{@const now = Date.now()}
				{#if rows.length === 0}
					<Empty.Root class="py-16">
						<Empty.Header>
							<Empty.Media variant="icon"><MegaphoneIcon /></Empty.Media>
							<Empty.Title>Duyuru yok</Empty.Title>
							<Empty.Description>
								İlk duyuruyu ekleyin. Yayında olanlar ana sayfada ve /announcements sayfasında
								görünür.
							</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-16"></Table.Head>
								<Table.Head>Başlık</Table.Head>
								<Table.Head class="w-32">Durum</Table.Head>
								<Table.Head class="w-52">Tarih</Table.Head>
								<Table.Head class="w-36">Açılır mesaj</Table.Head>
								<Table.Head class="w-12"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each rows as announcement (announcement.id)}
								{@const state = announcementStateOf(announcement, now)}
								<Table.Row
									class="cursor-pointer"
									onclick={() => goto(`/admin/announcements/${announcement.id}/edit`)}
								>
									<Table.Cell>
										<PhotoThumb
											src={announcement.thumbUrl}
											fallback={announcement.photoUrl}
											alt=""
											class="size-11"
										/>
									</Table.Cell>
									<Table.Cell class="max-w-xs font-medium">
										<span class="line-clamp-2">{announcement.title}</span>
									</Table.Cell>
									<Table.Cell>
										<Badge variant={badgeVariant[state]}>{announcementStateLabel[state]}</Badge>
									</Table.Cell>
									<Table.Cell class="font-mono text-xs text-muted-foreground tabular-nums">
										{formatWindow(announcement)}
									</Table.Cell>
									<Table.Cell class="text-sm text-muted-foreground">
										{#if announcement.popup}
											<span class="inline-flex items-center gap-1.5">
												<MegaphoneIcon class="size-3.5 text-safety" />
												{popupLabel(announcement, now)}
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
												<DropdownMenu.Item
													onclick={() => goto(`/admin/announcements/${announcement.id}/edit`)}
												>
													<PencilIcon size={14} />
													Düzenle
												</DropdownMenu.Item>
												<DropdownMenu.Item
													variant="destructive"
													onclick={() => {
														deleteTarget = announcement;
														deleteOpen = true;
													}}
												>
													<Trash2Icon size={14} />
													Sil
												</DropdownMenu.Item>
											</DropdownMenu.Content>
										</DropdownMenu.Root>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			{:catch}
				<Empty.Root class="py-16">
					<Empty.Header>
						<Empty.Title>Liste yüklenemedi</Empty.Title>
						<Empty.Description
							>Sayfayı yenileyin. Sorun sürerse tekrar giriş yapın.</Empty.Description
						>
					</Empty.Header>
				</Empty.Root>
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<ConfirmDeleteDialog
	bind:open={deleteOpen}
	id={deleteTarget?.id ?? null}
	action="?/deleteAnnouncement"
	title="Duyuruyu sil"
	description={`"${deleteTarget?.title}" duyurusu ve fotoğrafı kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
/>
