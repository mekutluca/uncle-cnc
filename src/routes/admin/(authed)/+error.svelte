<script lang="ts">
	import { page } from '$app/state';
	import ErrorState from '$lib/components/ErrorState.svelte';
</script>

<!-- Panel kabuğunun içinde çizilir: kenar çubuğu ve üst bar kullanılabilir kalır. -->
<div class="flex min-h-full items-center justify-center p-6">
	<ErrorState
		status={page.status}
		message={page.error?.message}
		size="md"
		homeHref="/admin"
		homeLabel="Panele Dön"
	/>
</div>
