<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		name,
		upload = false,
		children
	}: { name: string; upload?: boolean; children: Snippet } = $props();
</script>

<!-- Canlı formlar data-netlify taşımaz; kayıt static/__forms.html üzerinden yapılır.
     Netlify, form-name eşleşen POST'u yakalayıp action'a yönlendirir. -->
<form
	{name}
	method="POST"
	action="/thanks"
	enctype={upload ? 'multipart/form-data' : undefined}
	class="grid gap-5 p-5 sm:p-7"
>
	<input type="hidden" name="form-name" value={name} />
	<p class="hidden" aria-hidden="true">
		<label>Bu alanı boş bırakın: <input name="bot-field" tabindex="-1" autocomplete="off" /></label>
	</p>
	{@render children()}
</form>
