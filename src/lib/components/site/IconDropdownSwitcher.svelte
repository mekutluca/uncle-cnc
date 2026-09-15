<script lang="ts" generics="T extends string">
	import Check from '@lucide/svelte/icons/check';
	import type { Component } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let {
		icon: Icon,
		ariaLabel,
		align = 'end',
		dir = 'ltr',
		items,
		current,
		onSelect
	}: {
		icon: Component;
		ariaLabel: string;
		align?: 'start' | 'center' | 'end';
		dir?: 'ltr' | 'rtl';
		items: { code: T; label: string }[];
		current: T;
		onSelect: (code: T) => void;
	} = $props();
</script>

<DropdownMenu.Root {dir}>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="icon" aria-label={ariaLabel}>
				<Icon class="size-5" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content {align}>
		{#each items as item (item.code)}
			<DropdownMenu.Item onclick={() => onSelect(item.code)}>
				{item.label}
				{#if current === item.code}
					<Check class="ms-auto size-4" />
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
