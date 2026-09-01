<script lang="ts">
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import BrandMark from '$lib/components/site/BrandMark.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import { errorKind } from '$lib/utils/errors';

	/**
	 * Panel kabuğu DIŞINDA kalan hatalar için giriş sayfasıyla aynı çelik çerçeve.
	 * Tipik durum 403: hesap oturum açmış ama uc_admins üyesi değil. Çıkış butonu
	 * şart — yoksa kullanıcı /admin/login → /admin → 403 döngüsüne sıkışır.
	 */
	let { status, message }: { status: number; message?: string } = $props();

	// admin/+layout.ts'ten gelir; kök layout yükleme hatasında bulunmayabilir.
	let supabase = $derived(page.data.supabase);
	let forbidden = $derived(errorKind(status) === 'forbidden');

	async function logout() {
		await supabase.auth.signOut({ scope: 'local' });
		await goto('/admin/login', { invalidateAll: true });
	}
</script>

<div class="flex min-h-svh flex-col bg-steel">
	<div class="mx-auto w-full max-w-7xl px-4 py-5 text-[#f4f5f7] sm:px-6">
		<a href="/admin"
			><BrandMark subtitle="Yönetim Paneli" size="md" subtitleClass="text-[#9aa1ab]" /></a
		>
	</div>

	<div class="flex flex-1 items-center justify-center px-4 pb-16">
		<div class="w-full max-w-md">
			<div class="plate">
				<PlateHeader title="Alarm" code={String(status)} codeLabel="KOD" />
				<div class="px-6 py-10">
					<ErrorState
						{status}
						{message}
						size="md"
						homeLabel="Siteye Dön"
						secondary={forbidden ? 'none' : 'auto'}
					>
						{#snippet actions()}
							{#if forbidden && supabase}
								<Button variant="outline" class="btn-label" onclick={logout}>
									<LogOutIcon data-icon="inline-start" />
									Çıkış Yap
								</Button>
							{/if}
						{/snippet}
					</ErrorState>
				</div>
			</div>
		</div>
	</div>
</div>
