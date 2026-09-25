<script lang="ts">
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button';
	import * as m from '$lib/paraglide/messages';
	import { getRequestFormState } from './request-form-context';

	let { label }: { label: string } = $props();

	const formState = getRequestFormState();
</script>

<Button
	type="submit"
	size="lg"
	class="btn-label disabled:opacity-80"
	disabled={formState.submitting}
	aria-busy={formState.submitting}
>
	{#if formState.submitting}
		<LoaderCircleIcon class="size-4 animate-spin" aria-hidden="true" />
		{m.forms_submitting()}
	{:else}
		{label}
	{/if}
</Button>
