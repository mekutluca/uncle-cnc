<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { labelClass } from '$lib/components/forms/field-styles';

	let { supabase }: { supabase: SupabaseClient } = $props();

	let email = $state('');
	let password = $state('');
	let inProgress = $state(false);

	async function login(event: SubmitEvent) {
		event.preventDefault();
		inProgress = true;

		const res = await supabase.auth.signInWithPassword({ email, password });
		if (res.error) {
			toast.error(
				res.error.message === 'Invalid login credentials'
					? 'E-posta veya şifre hatalı.'
					: res.error.message
			);
			inProgress = false;
			return;
		}

		await invalidateAll();
		await goto('/admin');
	}
</script>

<form onsubmit={login} class="grid gap-5 p-5 sm:p-7">
	<div class="grid gap-1.5">
		<label class={labelClass} for="email">E-posta</label>
		<Input
			id="email"
			type="email"
			required
			autocomplete="email"
			placeholder="ornek@firma.com"
			bind:value={email}
		/>
	</div>
	<div class="grid gap-1.5">
		<label class={labelClass} for="password">Şifre</label>
		<Input
			id="password"
			type="password"
			required
			autocomplete="current-password"
			placeholder="••••••••"
			bind:value={password}
		/>
	</div>
	<Button type="submit" size="lg" class="btn-label" disabled={inProgress}>
		{#if inProgress}
			<LoaderCircleIcon class="size-4 animate-spin" />
		{/if}
		Giriş Yap
	</Button>
</form>
