import type { HandleClientError } from '@sveltejs/kit';
import { defaultErrorMessage } from '$lib/utils/errors';

// Tarayıcı tarafı gezinme hataları (istemcide load fırlatması, chunk yüklenememesi)
// aynı +error.svelte'yi çizer. Mesaj genel kalır, ayrıntı konsolda.
export const handleError: HandleClientError = ({ error, status, message }) => {
	console.error(`[${status}] ${message}`, error);
	return { message: defaultErrorMessage(status) };
};
