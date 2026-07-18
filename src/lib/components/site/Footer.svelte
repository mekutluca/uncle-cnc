<script lang="ts">
	import { site } from '$lib/data/site';
	import { services } from '$lib/data/services';
</script>

<footer class="dark bg-background text-foreground border-border border-t">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
		<div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
			<div>
				<div class="flex items-center gap-3">
					<span class="crosshair text-safety shrink-0" aria-hidden="true"></span>
					<span class="display text-xl">{site.name}</span>
				</div>
				<p class="text-safety mt-2 font-mono text-xs tracking-[0.14em]">{site.tagline}</p>
				<p class="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">{site.description}</p>
			</div>

			<nav aria-label="Hizmetler">
				<h2 class="eyebrow mb-4">Hizmetler</h2>
				<ul class="grid gap-2.5">
					{#each services as service (service.slug)}
						<li>
							<a href="/services/{service.slug}" class="hover:text-safety text-sm transition-colors">
								{service.title}
							</a>
						</li>
					{/each}
					<li>
						<a href="/machines" class="hover:text-safety text-sm transition-colors">Satılık Makineler</a>
					</li>
				</ul>
			</nav>

			<div>
				<h2 class="eyebrow mb-4">İletişim</h2>
				<ul class="grid gap-2.5 text-sm">
					<li><a href={site.phoneHref} class="hover:text-safety font-mono transition-colors">{site.phone}</a></li>
					<li><a href="mailto:{site.email}" class="hover:text-safety font-mono transition-colors">{site.email}</a></li>
					<li class="text-muted-foreground">{site.address}</li>
				</ul>
			</div>
		</div>

		<div class="border-border mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
			<p class="text-muted-foreground font-mono text-[11px] tracking-[0.14em]">
				© {new Date().getFullYear()} {site.fullName}
			</p>
			<p class="text-muted-foreground flex items-center gap-3 font-mono text-[11px] tracking-[0.14em]">
				<span class="dim-line w-24" aria-hidden="true"></span>
				REV {__APP_VERSION__}
			</p>
		</div>
	</div>
</footer>
