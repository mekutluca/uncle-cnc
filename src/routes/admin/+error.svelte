<script lang="ts">
	import { page } from '$app/state';
	import ErrorFrame from '$lib/components/admin/error-frame.svelte';
</script>

<!-- (authed) layout'unun 403'ü ve login sayfası hataları buraya düşer. -->
<ErrorFrame status={page.status} message={page.error?.message} />
