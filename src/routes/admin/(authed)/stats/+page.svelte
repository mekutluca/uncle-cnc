<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { createFormEnhance } from '$lib/utils/form-enhance';

	let { data } = $props();
	let saving = $state(false);

	const formEnhance = createFormEnhance({
		loadingMessage: 'Kaydediliyor…',
		onStart: () => (saving = true),
		onFinish: () => (saving = false)
	});
</script>

<svelte:head><title>İstatistikler | Uncle CNC Yönetim</title></svelte:head>

<div class="mx-auto max-w-3xl p-4 sm:p-6">
	<h1 class="display mb-2 text-2xl">Ana Sayfa İstatistikleri</h1>
	<p class="mb-6 text-sm text-muted-foreground">
		Ana sayfada hero bölümünün altında görünen 4 kutu.
	</p>

	{#await data.stats}
		<div class="grid gap-4 sm:grid-cols-2">
			{#each { length: 4 }, i (i)}
				<Skeleton class="h-32 w-full" />
			{/each}
		</div>
	{:then stats}
		<form method="POST" action="?/update" use:enhance={formEnhance} class="grid gap-6">
			<Card.Root>
				<Card.Content class="grid gap-6 sm:grid-cols-2">
					{#each stats as stat (stat.id)}
						<input type="hidden" name="id" value={stat.id} />
						<div class="grid gap-3 rounded-md border border-border p-4">
							<div class="grid gap-1.5">
								<label class={labelClass} for="value-{stat.id}">Değer</label>
								<Input id="value-{stat.id}" name="value-{stat.id}" required value={stat.value} />
							</div>
							<div class="grid gap-1.5">
								<label class={labelClass} for="label-{stat.id}">Etiket</label>
								<Input id="label-{stat.id}" name="label-{stat.id}" required value={stat.label} />
							</div>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
			<div class="flex justify-end">
				<Button type="submit" class="btn-label" disabled={saving}>Değişiklikleri Kaydet</Button>
			</div>
		</form>
	{/await}
</div>
