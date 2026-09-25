import { createContext } from 'svelte';
import type { RequestFormState } from '$lib/types';

/* RequestForm, gönderim durumunu içindeki SubmitButton'a bu context ile iletir. */
export const [getRequestFormState, setRequestFormState] = createContext<RequestFormState>();
