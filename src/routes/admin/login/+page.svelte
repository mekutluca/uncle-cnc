<script lang="ts">
	import LoginForm from '$lib/components/admin/login-form.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();
</script>

<svelte:head><title>Yönetim Girişi | {site.fullName}</title></svelte:head>

<!-- Çelik zemin bilinçli olarak .dark token takası yerine sabit renk: plaka kartı
     içeride normal (aydınlık) token bağlamında kalır -->
<div class="bg-steel flex min-h-svh flex-col">
	<div class="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-5 sm:px-6">
		<span class="crosshair text-safety shrink-0" aria-hidden="true"></span>
		<span class="leading-none">
			<span class="display block text-lg text-[#f4f5f7]">{site.name}</span>
			<span class="mt-1 block font-mono text-[9px] uppercase tracking-[0.24em] text-[#9aa1ab]">
				Yönetim Paneli
			</span>
		</span>
	</div>

	<div class="flex flex-1 items-center justify-center px-4 pb-16">
		<div class="w-full max-w-sm">
			<div class="plate">
				<PlateHeader title="Operatör Girişi" code="ADM-00" />
				<LoginForm supabase={data.supabase} />
			</div>
			<p class="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#9aa1ab]">
				Yalnızca yetkili kullanıcılar
			</p>
		</div>
	</div>
</div>
