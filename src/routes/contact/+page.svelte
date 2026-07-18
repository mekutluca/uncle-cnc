<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import Seo from '$lib/components/site/Seo.svelte';
	import SectionHeader from '$lib/components/site/SectionHeader.svelte';
	import NetlifyForm from '$lib/components/forms/NetlifyForm.svelte';
	import PlateHeader from '$lib/components/site/PlateHeader.svelte';
	import { labelClass } from '$lib/components/forms/field-styles';
	import { site } from '$lib/data/site';
</script>

<Seo title="İletişim" description="MC ICS ile iletişime geçin: telefon, e-posta, adres ve iletişim formu." />

<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
	<SectionHeader
		eyebrow="İletişim"
		title="Bize ulaşın"
		description="Sorunuz için formu doldurun ya da doğrudan arayın. Hizmet talepleri için ilgili hizmet sayfasındaki formu kullanmanızı öneririz."
	/>

	<div class="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
		<div class="flex flex-col gap-6">
			<div class="border-border bg-card rounded-md border p-6">
				<h2 class="eyebrow mb-4">İletişim Bilgileri</h2>
				<ul class="grid gap-3 text-sm">
					<li>
						<span class={labelClass}>Telefon</span>
						<a href={site.phoneHref} class="text-primary mt-1 block font-mono text-lg font-semibold">
							{site.phone}
						</a>
					</li>
					<li>
						<span class={labelClass}>E-posta</span>
						<a href="mailto:{site.email}" class="mt-1 block font-mono">{site.email}</a>
					</li>
					<li>
						<span class={labelClass}>Adres</span>
						<p class="mt-1">{site.address}</p>
					</li>
				</ul>
			</div>
			<iframe
				src={site.mapsEmbedUrl}
				title="MC ICS konumu"
				class="border-border min-h-64 w-full flex-1 rounded-md border"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allowfullscreen
			></iframe>
		</div>

		<div class="plate h-fit">
			<PlateHeader title="İletişim Formu" code="ILT-00" />
			<NetlifyForm name="contact">
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="grid gap-1.5">
						<label class={labelClass} for="ad_soyad">Ad Soyad *</label>
						<Input id="ad_soyad" name="ad_soyad" required autocomplete="name" placeholder="Adınız Soyadınız" />
					</div>
					<div class="grid gap-1.5">
						<label class={labelClass} for="firma">Firma</label>
						<Input id="firma" name="firma" autocomplete="organization" placeholder="Firma adı" />
					</div>
					<div class="grid gap-1.5">
						<label class={labelClass} for="telefon">Telefon *</label>
						<Input id="telefon" name="telefon" type="tel" required autocomplete="tel" placeholder="05xx xxx xx xx" />
					</div>
					<div class="grid gap-1.5">
						<label class={labelClass} for="eposta">E-posta *</label>
						<Input id="eposta" name="eposta" type="email" required autocomplete="email" placeholder="ornek@firma.com" />
					</div>
				</div>
				<div class="grid gap-1.5">
					<label class={labelClass} for="mesaj">Mesajınız *</label>
					<Textarea id="mesaj" name="mesaj" required rows={5} placeholder="Size nasıl yardımcı olabiliriz?" />
				</div>
				<Button type="submit" size="lg" class="btn-label">
					Mesajı Gönder
				</Button>
			</NetlifyForm>
		</div>
	</div>
</section>
