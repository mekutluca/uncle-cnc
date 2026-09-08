<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { flip } from 'svelte/animate';
	import { prefersReducedMotion } from 'svelte/motion';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Empty from '$lib/components/ui/empty';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import ConfirmDeleteDialog from '$lib/components/admin/confirm-delete-dialog.svelte';
	import { ReorderableList } from '$lib/utils/reorderable-list.svelte';
	import type { SaleCategory } from '$lib/types';

	let { data } = $props();

	const list = new ReorderableList<SaleCategory>();
	$effect(() => list.sync(data.categories));

	let deleteTarget = $state<SaleCategory | null>(null);
	let deleteOpen = $state(false);
</script>

<svelte:head><title>Kategoriler | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-6xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="display text-2xl">Kategoriler</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Satış ilanlarının gruplandığı kategoriler. Sıra burada belirlenen düzende sitede görünür.
			</p>
		</div>
		<Button href="/admin/categories/new" class="btn-label">
			<PlusIcon class="size-4" />
			Yeni Kategori
		</Button>
	</div>

	<Card.Root class="py-0">
		<Card.Content class="p-0">
			{#if list.loadFailed}
				<Empty.Root class="py-16">
					<Empty.Header>
						<Empty.Title>Liste yüklenemedi</Empty.Title>
						<Empty.Description
							>Sayfayı yenileyin. Sorun sürerse tekrar giriş yapın.</Empty.Description
						>
					</Empty.Header>
				</Empty.Root>
			{:else if list.rows === null}
				<div class="grid gap-3 p-4">
					{#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
						<Skeleton class="h-14 w-full" />
					{/each}
				</div>
			{:else}
				{@const rows = list.rows}
				{#if rows.length === 0}
					<Empty.Root class="py-16">
						<Empty.Header>
							<Empty.Title>Kategori yok</Empty.Title>
							<Empty.Description>İlk kategoriyi ekleyin (ör. "Tezgahlar").</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Başlık</Table.Head>
								<Table.Head class="w-24">Sıra</Table.Head>
								<Table.Head class="w-12"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each rows as category, index (category.id)}
								<!-- Table.Row yerine düz tr: animate yönergesi bileşene uygulanamaz. -->
								<tr
									animate:flip={{ duration: prefersReducedMotion.current ? 0 : 220 }}
									data-slot="table-row"
									class="cursor-pointer border-b transition-colors hover:bg-muted/50"
									onclick={() => goto(`/admin/categories/${category.id}/edit`)}
								>
									<Table.Cell class="font-medium">{category.title}</Table.Cell>
									<Table.Cell onclick={(e: MouseEvent) => e.stopPropagation()}>
										<div class="flex gap-1">
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Yukarı taşı"
												disabled={list.moveBusy || index === 0}
												onclick={() => list.move('?/moveCategory', category.id, -1)}
											>
												<ArrowUpIcon class="size-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon-sm"
												aria-label="Aşağı taşı"
												disabled={list.moveBusy || index === rows.length - 1}
												onclick={() => list.move('?/moveCategory', category.id, 1)}
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
												<DropdownMenu.Item
													onclick={() => goto(`/admin/categories/${category.id}/edit`)}
												>
													<PencilIcon size={14} />
													Düzenle
												</DropdownMenu.Item>
												<DropdownMenu.Item
													variant="destructive"
													onclick={() => {
														deleteTarget = category;
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
			{/if}
		</Card.Content>
	</Card.Root>
</div>

<ConfirmDeleteDialog
	bind:open={deleteOpen}
	id={deleteTarget?.id ?? null}
	action="?/deleteCategory"
	title="Kategoriyi sil"
	description={`"${deleteTarget?.title}" kategorisi kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
/>
