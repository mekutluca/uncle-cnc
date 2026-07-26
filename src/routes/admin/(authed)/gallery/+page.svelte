<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { goto } from '$app/navigation';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import GalleryDeleteDialog from '$lib/components/admin/gallery-delete-dialog.svelte';
	import PhotoThumb from '$lib/components/site/PhotoThumb.svelte';
	import { submitFormAction } from '$lib/utils/form-enhance';
	import { serviceBySlug } from '$lib/data/services';
	import type { GalleryItemWithUrl } from '$lib/types';

	let { data } = $props();

	let deleteTarget = $state<GalleryItemWithUrl | null>(null);
	let deleteOpen = $state(false);
	let moveBusy = $state(false);

	async function moveItem(id: string, direction: -1 | 1) {
		await submitFormAction(
			'?/moveItem',
			{ id, direction: String(direction) },
			{
				onStart: () => (moveBusy = true),
				onFinish: () => (moveBusy = false)
			}
		);
	}
</script>

<svelte:head><title>Galeri | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-6xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<h1 class="display text-2xl">Galeri</h1>
		<Button href="/admin/gallery/new" class="btn-label">
			<PlusIcon class="size-4" />
			Yeni Öğe
		</Button>
	</div>

	<Card.Root class="py-0">
		<Card.Content class="p-0">
			{#await data.items}
				<div class="grid gap-3 p-4">
					{#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
						<Skeleton class="h-14 w-full" />
					{/each}
				</div>
			{:then items}
				{#if items.length === 0}
					<Empty.Root class="py-16">
						<Empty.Header>
							<Empty.Title>Galeri boş</Empty.Title>
							<Empty.Description>Tamamlanan işlerden ilk kareyi ekleyin.</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-16"></Table.Head>
								<Table.Head>Etiket</Table.Head>
								<Table.Head>Açıklama</Table.Head>
								<Table.Head>Hizmet</Table.Head>
								<Table.Head class="w-24">Sıra</Table.Head>
								<Table.Head class="w-12"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each items as item, index (item.id)}
								<Table.Row
									class="cursor-pointer"
									onclick={() => goto(`/admin/gallery/${item.id}/edit`)}
								>
									<Table.Cell>
										<PhotoThumb src={item.thumbUrl} fallback={item.photoUrl} class="size-11" />
									</Table.Cell>
									<Table.Cell>
										<Badge variant="outline" class="font-mono text-[10px] tracking-[0.1em]">
											{item.label}
										</Badge>
									</Table.Cell>
									<Table.Cell class="font-medium">{item.description}</Table.Cell>
									<Table.Cell class="text-muted-foreground text-sm">
										{serviceBySlug(item.service_slug ?? '')?.title ?? '—'}
									</Table.Cell>
									<Table.Cell onclick={(e: MouseEvent) => e.stopPropagation()}>
										<div class="flex gap-1">
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Yukarı taşı"
												disabled={moveBusy || index === 0}
												onclick={() => moveItem(item.id, -1)}
											>
												<ArrowUpIcon class="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Aşağı taşı"
												disabled={moveBusy || index === items.length - 1}
												onclick={() => moveItem(item.id, 1)}
											>
												<ArrowDownIcon class="size-3.5" />
											</Button>
										</div>
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
												<DropdownMenu.Item onclick={() => goto(`/admin/gallery/${item.id}/edit`)}>
													<PencilIcon size={14} />
													Düzenle
												</DropdownMenu.Item>
												<DropdownMenu.Item
													variant="destructive"
													onclick={() => {
														deleteTarget = item;
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
						<Empty.Description>Sayfayı yenileyin; sorun sürerse tekrar giriş yapın.</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			{/await}
		</Card.Content>
	</Card.Root>
</div>

<GalleryDeleteDialog bind:open={deleteOpen} item={deleteTarget} />
