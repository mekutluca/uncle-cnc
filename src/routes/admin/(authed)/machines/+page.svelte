<script lang="ts">
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MoreVerticalIcon from '@lucide/svelte/icons/more-vertical';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import Trash2Icon from '@lucide/svelte/icons/trash-2';
	import { goto } from '$app/navigation';
	import { Badge, type BadgeVariant } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Empty from '$lib/components/ui/empty';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Table from '$lib/components/ui/table';
	import MachineDeleteDialog from '$lib/components/admin/machine-delete-dialog.svelte';
	import SortableHead from '$lib/components/admin/sortable-head.svelte';
	import PhotoThumb from '$lib/components/site/PhotoThumb.svelte';
	import { formatPrice } from '$lib/utils/machine-format';
	import { TableSort } from '$lib/utils/table-sort.svelte';
	import type { Machine, MachineWithPhotos } from '$lib/types';

	let { data } = $props();

	const STATUS_LABEL: Record<Machine['status'], string> = {
		available: 'Satışta',
		sold: 'Satıldı',
		hidden: 'Gizli'
	};
	const STATUS_BADGE: Record<Machine['status'], BadgeVariant> = {
		available: 'default',
		sold: 'destructive',
		hidden: 'outline'
	};

	let search = $state('');
	let statusFilter = $state('all');
	const sort = new TableSort<'title' | 'machine_type' | 'price' | 'status' | 'created_at'>();

	let deleteTarget = $state<MachineWithPhotos | null>(null);
	let deleteOpen = $state(false);

	function filterAndSort(machines: MachineWithPhotos[]): MachineWithPhotos[] {
		const query = search.trim().toLocaleLowerCase('tr');
		let rows = machines.filter(
			(machine) =>
				(statusFilter === 'all' || machine.status === statusFilter) &&
				(!query ||
					machine.title.toLocaleLowerCase('tr').includes(query) ||
					machine.machine_type.toLocaleLowerCase('tr').includes(query))
		);
		if (sort.key) {
			const key = sort.key;
			const dir = sort.order === 'asc' ? 1 : -1;
			rows = [...rows].sort((a, b) => {
				const av = a[key] ?? '';
				const bv = b[key] ?? '';
				if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
				return String(av).localeCompare(String(bv), 'tr') * dir;
			});
		}
		return rows;
	}
</script>

<svelte:head><title>Makineler | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-6xl p-4 sm:p-6">
	<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
		<h1 class="display text-2xl">Makineler</h1>
		<Button href="/admin/machines/new" class="btn-label">
			<PlusIcon class="size-4" />
			Yeni Makine
		</Button>
	</div>

	<div class="mb-4 flex flex-wrap gap-2">
		<Input placeholder="Ara: başlık, cins…" bind:value={search} class="max-w-xs" />
		<Select.Root type="single" bind:value={statusFilter}>
			<Select.Trigger class="w-36">
				{statusFilter === 'all' ? 'Tüm durumlar' : STATUS_LABEL[statusFilter as Machine['status']]}
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="all">Tüm durumlar</Select.Item>
				{#each Object.entries(STATUS_LABEL) as [value, label] (value)}
					<Select.Item {value}>{label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<Card.Root class="py-0">
		<Card.Content class="p-0">
			{#await data.machines}
				<div class="grid gap-3 p-4">
					{#each Array.from({ length: 4 }, (_, i) => i) as i (i)}
						<Skeleton class="h-14 w-full" />
					{/each}
				</div>
			{:then machines}
				{@const rows = filterAndSort(machines)}
				{#if rows.length === 0}
					<Empty.Root class="py-16">
						<Empty.Header>
							<Empty.Title>Makine bulunamadı</Empty.Title>
							<Empty.Description>
								{machines.length === 0
									? 'Henüz ilan eklenmemiş. İlk makineyi ekleyin.'
									: 'Filtrelere uyan ilan yok.'}
							</Empty.Description>
						</Empty.Header>
					</Empty.Root>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head class="w-16"></Table.Head>
								<SortableHead {sort} key="title" label="Başlık" />
								<SortableHead {sort} key="machine_type" label="Cins" />
								<SortableHead {sort} key="price" label="Fiyat" alignRight />
								<SortableHead {sort} key="status" label="Durum" />
								<SortableHead {sort} key="created_at" label="Eklenme" initialOrder="desc" />
								<Table.Head class="w-12"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each rows as machine (machine.id)}
								<Table.Row
									class="cursor-pointer"
									onclick={() => goto(`/admin/machines/${machine.id}/edit`)}
								>
									<Table.Cell>
										<PhotoThumb src={machine.photoUrls[0] ?? null} class="size-11" />
									</Table.Cell>
									<Table.Cell>
										<p class="font-medium">{machine.title}</p>
										<p class="text-muted-foreground font-mono text-[11px]">/{machine.slug}</p>
									</Table.Cell>
									<Table.Cell>{machine.machine_type}</Table.Cell>
									<Table.Cell class="text-right font-mono text-sm">
										{formatPrice(machine.price, machine.currency) ?? 'Sorunuz'}
									</Table.Cell>
									<Table.Cell>
										<Badge variant={STATUS_BADGE[machine.status]}>{STATUS_LABEL[machine.status]}</Badge>
									</Table.Cell>
									<Table.Cell class="text-muted-foreground text-sm">
										{new Date(machine.created_at).toLocaleDateString('tr-TR')}
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
												<DropdownMenu.Item onclick={() => goto(`/admin/machines/${machine.id}/edit`)}>
													<PencilIcon size={14} />
													Düzenle
												</DropdownMenu.Item>
												<DropdownMenu.Item
													variant="destructive"
													onclick={() => {
														deleteTarget = machine;
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

<MachineDeleteDialog bind:open={deleteOpen} machine={deleteTarget} />
