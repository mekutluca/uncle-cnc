import { listMachines } from '$lib/server/supabase';
import { services } from '$lib/data/services';
import { site } from '$lib/data/site';
import type { RequestHandler } from './$types';

export const prerender = false;

const staticPaths = [
	'/',
	'/about',
	'/gallery',
	'/references',
	'/contact',
	'/services',
	...services.map((s) => `/services/${s.slug}`),
	'/machines'
];

export const GET: RequestHandler = async ({ setHeaders }) => {
	setHeaders({
		'content-type': 'application/xml',
		'netlify-cdn-cache-control': 'public, s-maxage=3600'
	});

	const machines = await listMachines();
	const urls = [...staticPaths, ...machines.map((m) => `/machines/${m.slug}`)];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `\t<url><loc>${site.url}${path}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body);
};
