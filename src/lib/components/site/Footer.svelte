<script lang="ts">
	import { site } from '$lib/data/site';
	import { services } from '$lib/data/services';
	import logoLockup from '$lib/assets/logo-lockup.png';
	import * as m from '$lib/paraglide/messages';
</script>

<footer class="dark border-t border-border bg-background text-foreground">
	<div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
		<div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
			<div>
				<img src={logoLockup} alt={site.fullName} class="h-14 w-auto rounded-md" />
				<p class="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
					{site.description}
				</p>
			</div>

			<nav aria-label={m.footer_services_nav_aria()}>
				<h2 class="eyebrow mb-4">{m.footer_services_heading()}</h2>
				<ul class="grid gap-2.5">
					{#each services as service (service.slug)}
						<li>
							<a
								href="/services/{service.slug}"
								class="text-sm transition-colors hover:text-safety"
							>
								{service.title}
							</a>
						</li>
					{/each}
					<li>
						<a href="/machines" class="text-sm transition-colors hover:text-safety"
							>{m.footer_machines_link()}</a
						>
					</li>
					<li>
						<a href="/announcements" class="text-sm transition-colors hover:text-safety"
							>{m.footer_announcements_link()}</a
						>
					</li>
				</ul>
			</nav>

			<div>
				<h2 class="eyebrow mb-4">{m.footer_contact_heading()}</h2>
				<ul class="grid gap-2.5 text-sm">
					<li>
						<a
							href={site.phoneHref}
							dir="ltr"
							class="inline-block font-mono transition-colors hover:text-safety">{site.phone}</a
						>
					</li>
					<li>
						<a href="mailto:{site.email}" class="font-mono transition-colors hover:text-safety"
							>{site.email}</a
						>
					</li>
					<li class="text-muted-foreground">{site.address}</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
		>
			<p class="font-mono text-[11px] tracking-[0.14em] text-muted-foreground">
				© {new Date().getFullYear()}
				{site.fullName}
			</p>
			<p
				class="flex items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground"
			>
				<span class="dim-line w-24" aria-hidden="true"></span>
				REV {__APP_VERSION__}
			</p>
		</div>
	</div>
</footer>
