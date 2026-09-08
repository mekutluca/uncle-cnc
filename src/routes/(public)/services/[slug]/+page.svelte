<script lang="ts">
	import BackLink from '$lib/components/site/BackLink.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import ServiceForm from '$lib/components/forms/ServiceForm.svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { services } from '$lib/data/services';
	import { site } from '$lib/data/site';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();
	const service = $derived(data.service);
	const otherServices = $derived(services.filter((s) => s.slug !== service.slug));

	const maintenanceGroups = $derived([
		{
			title: m.service_detail_maintenance_mechanical_title(),
			detail: m.service_detail_maintenance_mechanical_detail()
		},
		{
			title: m.service_detail_maintenance_electrical_title(),
			detail: m.service_detail_maintenance_electrical_detail()
		},
		{
			title: m.service_detail_maintenance_lubrication_title(),
			detail: m.service_detail_maintenance_lubrication_detail()
		},
		{
			title: m.service_detail_maintenance_precision_title(),
			detail: m.service_detail_maintenance_precision_detail()
		},
		{
			title: m.service_detail_maintenance_reporting_title(),
			detail: m.service_detail_maintenance_reporting_detail()
		}
	]);
</script>

<Seo title={service.title} description={service.intro} />

<section class="dark bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
		<BackLink href="/services" label={m.service_detail_back_link()} class="mb-6" />
		<p class="eyebrow mb-4 flex items-center gap-3">
			<span class="crosshair text-safety" aria-hidden="true"></span>
			{m.service_detail_eyebrow({ code: service.code })}
		</p>
		<h1 class="display max-w-3xl text-4xl sm:text-5xl">{service.title}</h1>
		<p class="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{service.intro}</p>
	</div>
</section>

<section class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
	<div>
		<ServiceForm {service} />

		{#if service.slug === 'maintenance'}
			<div class="mt-10">
				<h2 class="eyebrow mb-4">{m.service_detail_maintenance_heading()}</h2>
				<Accordion.Root type="single" class="rounded-md border border-border px-4">
					{#each maintenanceGroups as group, i (group.title)}
						<Accordion.Item value={group.title}>
							<Accordion.Trigger class="font-medium">
								<span class="flex items-baseline gap-3">
									<span class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
										{String(i + 1).padStart(2, '0')}
									</span>
									{group.title}
								</span>
							</Accordion.Trigger>
							<Accordion.Content class="text-muted-foreground">{group.detail}</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		{/if}
	</div>

	<aside class="flex flex-col gap-6 lg:mt-0">
		<div class="rounded-md border border-border bg-card p-6">
			<h2 class="eyebrow mb-4">{m.service_detail_contact_heading()}</h2>
			<p class="text-sm leading-relaxed">
				{m.service_detail_contact_body()}
			</p>
			<a
				href={site.phoneHref}
				class="mt-3 block font-mono text-lg font-semibold tracking-[0.06em] text-primary"
				dir="ltr"
			>
				{site.phone}
			</a>
			<a href="mailto:{site.email}" class="mt-1 block font-mono text-sm text-muted-foreground">
				{site.email}
			</a>
		</div>

		<nav class="rounded-md border border-border bg-card p-6" aria-label={m.service_detail_other_services_aria()}>
			<h2 class="eyebrow mb-4">{m.service_detail_other_services_heading()}</h2>
			<ul class="grid gap-2.5">
				{#each otherServices as other (other.slug)}
					<li>
						<a
							href="/services/{other.slug}"
							class="flex items-baseline gap-3 text-sm font-medium transition-colors hover:text-primary"
						>
							<span class="font-mono text-[10px] tracking-[0.12em] text-muted-foreground"
								>{other.code}</span
							>
							{other.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</aside>
</section>
