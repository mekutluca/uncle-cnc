<script lang="ts">
	import LoginForm from '$lib/components/admin/login-form.svelte';
	import BrandMark from '$lib/components/site/BrandMark.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { site } from '$lib/data/site';

	let { data } = $props();
</script>

<svelte:head><title>Yönetim Girişi | {site.fullName}</title></svelte:head>

<!-- Çelik zemin bilinçli olarak .dark token takası yerine sabit renk: plaka kartı
     içeride normal (aydınlık) token bağlamında kalır -->
<div class="bg-steel flex min-h-svh flex-col">
	<div class="mx-auto w-full max-w-7xl px-4 py-5 text-[#f4f5f7] sm:px-6">
		<BrandMark subtitle="Yönetim Paneli" size="md" subtitleClass="text-[#9aa1ab]" />
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
