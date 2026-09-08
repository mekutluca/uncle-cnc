<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { labelClass } from './field-styles';

	let { label = m.forms_photo_label_default() }: { label?: string } = $props();

	const MAX_FILES = 3;
	const MAX_MB = 4;

	let warning = $state('');

	function onchange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])];
		if (files.length > MAX_FILES) {
			warning = m.forms_photo_max_files_warning({ maxFiles: MAX_FILES });
			input.value = '';
			return;
		}
		const oversized = files.find((f) => f.size > MAX_MB * 1024 * 1024);
		if (oversized) {
			warning = m.forms_photo_oversized_warning({ fileName: oversized.name, maxMb: MAX_MB });
			input.value = '';
			return;
		}
		warning = '';
	}
</script>

<div class="grid gap-1.5">
	<label class={labelClass} for="fotograflar">{label}</label>
	<input
		id="fotograflar"
		name="fotograflar"
		type="file"
		accept="image/*"
		multiple
		{onchange}
		class="w-full cursor-pointer rounded-md border border-input bg-card
			text-sm shadow-xs outline-none file:me-3 file:h-10 file:cursor-pointer file:border-0 file:bg-secondary
			file:px-4 file:font-mono file:text-[11px] file:font-medium file:tracking-[0.14em] file:text-foreground
			file:uppercase hover:file:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
	/>
	<p class="text-xs text-muted-foreground">
		{m.forms_photo_helper({ maxFiles: MAX_FILES, maxMb: MAX_MB })}
	</p>
	{#if warning}
		<p class="text-sm text-destructive" role="alert">{warning}</p>
	{/if}
</div>
