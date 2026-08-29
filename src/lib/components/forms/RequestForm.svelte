<script lang="ts">
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { site } from '$lib/data/site';

	let {
		name,
		upload = false,
		children
	}: { name: string; upload?: boolean; children: Snippet } = $props();

	let submitting = $state(false);
	let failed = $state(false);

	/* Gönderim /api/submit endpoint'ine yapılır: kayıt Supabase'e yazılır ve
	   e-posta bildirimi gönderilir. Başarıda /thanks'e istemci tarafında geçilir;
	   JS kapalıysa form natif POST edilir ve endpoint /thanks'e yönlendirir. */
	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		submitting = true;
		failed = false;
		try {
			const response = await fetch('/api/submit', { method: 'POST', body: new FormData(form) });
			if (!response.ok) throw new Error(`Form gönderimi ${response.status} döndürdü`);
			await goto('/thanks');
		} catch {
			failed = true;
			submitting = false;
		}
	}
</script>

<form
	{name}
	method="POST"
	action="/api/submit"
	enctype={upload ? 'multipart/form-data' : undefined}
	{onsubmit}
	class="grid gap-5 p-5 sm:p-7"
	inert={submitting || undefined}
>
	<input type="hidden" name="form-name" value={name} />
	<p class="hidden" aria-hidden="true">
		<label>Bu alanı boş bırakın: <input name="bot-field" tabindex="-1" autocomplete="off" /></label>
	</p>
	{@render children()}
	{#if failed}
		<p class="text-sm text-destructive" role="alert">
			Gönderim başarısız oldu. Lütfen tekrar deneyin ya da bizi arayın: {site.phone}
		</p>
	{/if}
</form>
