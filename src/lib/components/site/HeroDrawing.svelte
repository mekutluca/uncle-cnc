<script lang="ts">
	/**
	 * İmza görsel: dik işleme merkezinin teknik resim (CAD) üslubunda çizimi.
	 * Çizgiler sayfa açılışında çizilir, ölçü etiketleri sonradan belirir;
	 * prefers-reduced-motion açıksa animasyon yapılmaz.
	 */
</script>

<svg
	viewBox="0 0 560 460"
	role="img"
	aria-label="Dik işleme merkezi teknik çizimi"
	class="hero-drawing h-auto w-full"
>
	<!-- zemin karolajı -->
	<g class="grid-lines" stroke="currentColor" stroke-width="0.5" opacity="0.12">
		{#each Array.from({ length: 13 }, (_, i) => i * 40 + 20) as x (x)}
			<line x1={x} y1="10" x2={x} y2="430" />
		{/each}
		{#each Array.from({ length: 11 }, (_, i) => i * 40 + 20) as y (y)}
			<line x1="20" y1={y} x2="540" y2={y} />
		{/each}
	</g>

	<!-- makine gövdesi -->
	<g
		class="machine"
		fill="none"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
		stroke-linecap="round"
	>
		<!-- taban -->
		<path class="draw d1" pathLength="1" d="M90 380 H470 V346 H90 Z" />
		<!-- kolon -->
		<path class="draw d1" pathLength="1" d="M356 346 V96 H446 V346" />
		<path class="draw d2" pathLength="1" d="M368 108 H434" />
		<!-- kafa gövdesi ve raylar -->
		<path class="draw d2" pathLength="1" d="M356 128 H222 V196 H356" />
		<path class="draw d2" pathLength="1" d="M222 144 H356 M222 180 H356" />
		<!-- iş mili -->
		<path class="draw d3" pathLength="1" d="M258 196 H306 V232 H258 Z" />
		<path class="draw d3" pathLength="1" d="M276 232 H288 V254 H276 Z" />
		<!-- takım -->
		<path class="draw d3" pathLength="1" d="M282 254 V276" />
		<!-- tabla ve kızak -->
		<path class="draw d2" pathLength="1" d="M130 296 H370 V314 H130 Z" />
		<path class="draw d2" pathLength="1" d="M154 314 H346 V346 H154 Z" />
		<!-- tabla T-kanalları -->
		<path class="draw d3" pathLength="1" d="M166 296 V314 M214 296 V314 M262 296 V314 M310 296 V314 M358 296 V314" opacity="0.5" />
		<!-- kolon cıvataları -->
		<path class="draw d3" pathLength="1" d="M372 360 h8 M422 360 h8" opacity="0.6" />
	</g>

	<!-- koordinat merkezi: takım ucunda artı işareti -->
	<g class="origin text-safety" stroke="currentColor" stroke-width="1.2">
		<line x1="270" y1="288" x2="294" y2="288" />
		<line x1="282" y1="276" x2="282" y2="300" />
		<circle cx="282" cy="288" r="6" fill="none" />
	</g>

	<!-- ölçü çizgileri -->
	<g class="dims text-safety" stroke="currentColor" stroke-width="1">
		<!-- X: taban altı -->
		<g class="dim x">
			<line x1="90" y1="404" x2="470" y2="404" />
			<line x1="90" y1="398" x2="90" y2="410" />
			<line x1="470" y1="398" x2="470" y2="410" />
		</g>
		<!-- Z: kolon sağı -->
		<g class="dim z">
			<line x1="496" y1="96" x2="496" y2="380" />
			<line x1="490" y1="96" x2="502" y2="96" />
			<line x1="490" y1="380" x2="502" y2="380" />
		</g>
		<!-- Y: tabla üstü -->
		<g class="dim y">
			<line x1="130" y1="282" x2="370" y2="282" />
			<line x1="130" y1="276" x2="130" y2="288" />
			<line x1="370" y1="276" x2="370" y2="288" />
		</g>
	</g>

	<!-- ölçü etiketleri -->
	<g class="labels" fill="currentColor" font-family="'IBM Plex Mono', monospace" font-size="11" letter-spacing="0.1em">
		<text x="264" y="422" class="text-safety" fill="currentColor">X 1200</text>
		<text x="512" y="242" class="text-safety" fill="currentColor" transform="rotate(-90 512 242)" text-anchor="middle">Z 600</text>
		<text x="230" y="274" class="text-safety" fill="currentColor">Y 600</text>
		<text x="94" y="90" opacity="0.65">MC-V1200 / DİK İŞLEME MERKEZİ</text>
		<text x="94" y="106" opacity="0.4">ÖLÇEK 1:20 — TOLERANS ±0.01 MM</text>
	</g>
</svg>

<style>
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.1s cubic-bezier(0.6, 0, 0.3, 1) forwards;
	}
	.d1 { animation-delay: 0.1s; }
	.d2 { animation-delay: 0.5s; }
	.d3 { animation-delay: 0.9s; }

	.origin,
	.dims .dim,
	.labels text {
		opacity: 0;
		animation: appear 0.5s ease forwards;
	}
	.dims .x { animation-delay: 1.5s; }
	.dims .y { animation-delay: 1.65s; }
	.dims .z { animation-delay: 1.8s; }
	.origin { animation-delay: 1.4s; }
	.labels text { animation-delay: 1.9s; }

	@keyframes draw {
		to { stroke-dashoffset: 0; }
	}
	@keyframes appear {
		to { opacity: 1; }
	}
	.labels text[opacity='0.65'] { animation-name: appear-65; }
	.labels text[opacity='0.4'] { animation-name: appear-40; }
	@keyframes appear-65 { to { opacity: 0.65; } }
	@keyframes appear-40 { to { opacity: 0.4; } }

	@media (prefers-reduced-motion: reduce) {
		.draw,
		.origin,
		.dims .dim,
		.labels text {
			animation: none;
			stroke-dashoffset: 0;
			opacity: 1;
		}
		.labels text[opacity='0.65'] { opacity: 0.65; }
		.labels text[opacity='0.4'] { opacity: 0.4; }
	}
</style>
