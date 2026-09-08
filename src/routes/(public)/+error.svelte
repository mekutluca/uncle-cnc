<script lang="ts">
	import { page } from '$app/state';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';
</script>

<!-- Halka açık layout'un içinde çizilir: header ve footer yerinde kalır. -->
<section class="mx-auto max-w-2xl px-4 py-24 sm:px-6">
	<ErrorState status={page.status} message={page.error?.message} localized>
		<p class="mt-6 text-sm text-muted-foreground">
			{m.error_page_help()}
			<a href={site.phoneHref} dir="ltr" class="ms-1 font-mono font-semibold text-primary"
				>{site.phone}</a
			>
		</p>
	</ErrorState>
</section>
