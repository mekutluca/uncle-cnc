import { error } from '@sveltejs/kit';
import { defaultErrorMessage } from '$lib/utils/errors';
import type { PageServerLoad } from './$types';

// /admin altındaki eşleşmeyen adresler de yetki zincirinden geçer: oturumsuz
// ziyaretçi login'e yönlenir, yetkisiz hesap 403 alır, yönetici 404'ü panel
// kabuğunun içinde görür.
export const load: PageServerLoad = () => {
	// Mesajsız error(404) gövdeye 'Error: 404' yazar; Türkçe açıklamayı açıkça ver.
	error(404, defaultErrorMessage(404));
};
