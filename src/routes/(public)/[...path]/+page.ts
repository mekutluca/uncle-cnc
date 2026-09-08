import { error } from '@sveltejs/kit';
import { defaultErrorMessage } from '$lib/utils/errors';
import type { PageLoad } from './$types';

// Eşleşmeyen adresler kök +error.svelte yerine burada 404 alır. Böylece hata
// sayfası halka açık layout'un (header/footer) içinde çizilir. Prerender
// edilemez: hangi adreslerin gelmeyeceği önceden bilinmez, SSR ile yanıtlanır.
export const prerender = false;

export const load: PageLoad = () => {
	// Mesajsız error(404) gövdeye 'Error: 404' yazar. Türkçe açıklamayı açıkça ver.
	error(404, defaultErrorMessage(404));
};
