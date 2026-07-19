<script lang="ts" generics="K extends string">
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import * as Table from '$lib/components/ui/table';
	import type { TableSort } from '$lib/utils/table-sort.svelte';
	import type { SortOrder } from '$lib/types';

	let {
		sort,
		key,
		label,
		alignRight = false,
		initialOrder = 'asc'
	}: {
		sort: TableSort<K>;
		key: K;
		label: string;
		alignRight?: boolean;
		initialOrder?: SortOrder;
	} = $props();
</script>

<Table.Head
	class="hover:bg-muted cursor-pointer select-none transition-colors"
	onclick={() => sort.toggle(key, initialOrder)}
>
	<div class="flex items-center gap-1 {alignRight ? 'justify-end' : ''}">
		<span>{label}</span>
		{#if sort.key === key}
			{#if sort.order === 'asc'}
				<ChevronUpIcon size={14} class="text-muted-foreground" />
			{:else}
				<ChevronDownIcon size={14} class="text-muted-foreground" />
			{/if}
		{:else}
			<ChevronsUpDownIcon size={14} class="text-muted-foreground/40" />
		{/if}
	</div>
</Table.Head>
