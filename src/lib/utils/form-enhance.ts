import type { SubmitFunction } from '@sveltejs/kit';
import { deserialize } from '$app/forms';
import { invalidateAll } from '$app/navigation';
import { toast } from 'svelte-sonner';
import type { FormActionData, FormEnhanceOptions } from '$lib/types';

function showSuccess(
	opts: FormEnhanceOptions,
	data: FormActionData | undefined,
	toastId?: string | number
) {
	// Aksiyonun kendi mesajı öncelikli: duruma özel bilgi taşıyabilir
	// (ör. "eklendi ama bir fotoğraf yüklenemedi").
	const message = data?.message ?? opts.successMessage;
	if (message) toast.success(message, { id: toastId });
	else if (toastId !== undefined) toast.dismiss(toastId);
}

function showFailure(data: FormActionData | undefined, toastId?: string | number) {
	if (data?.message) toast.error(data.message, { id: toastId });
	else if (toastId !== undefined) toast.dismiss(toastId);
}

/**
 * Standart `use:enhance` sarmalayıcısı: yüklenme durumunu yönetir, sonuç
 * mesajlarını toast'a bağlar, başarıda opsiyonel callback çalıştırır.
 */
export function createFormEnhance(opts: FormEnhanceOptions = {}): SubmitFunction {
	return ({ formData }) => {
		opts.beforeSubmit?.(formData);
		opts.onStart?.();
		const toastId = opts.loadingMessage ? toast.loading(opts.loadingMessage) : undefined;
		return async ({ result, update }) => {
			opts.onFinish?.();
			if (result.type === 'success')
				showSuccess(opts, result.data as FormActionData | undefined, toastId);
			else if (result.type === 'failure')
				showFailure(result.data as FormActionData | undefined, toastId);
			else if (toastId !== undefined) toast.dismiss(toastId);
			// Bağlı (bind) alan durumu form değerlerinin sahibi; DOM reset'i senkronu bozar.
			await update({ reset: false });
			// update'ten sonra: onSuccess içindeki goto, update'in tetiklediği
			// invalidation tarafından iptal edilmesin.
			if (result.type === 'success') opts.onSuccess?.(result.data as FormActionData | undefined);
		};
	};
}

/**
 * `createFormEnhance`in programatik karşılığı: JS'ten (ör. menü öğesinden) form
 * aksiyonuna POST atar ve sonucu aynı toast + invalidate akışından geçirir.
 */
export async function submitFormAction(
	action: string,
	values: Record<string, string> = {},
	opts: FormEnhanceOptions = {}
): Promise<void> {
	opts.onStart?.();
	const toastId = opts.loadingMessage ? toast.loading(opts.loadingMessage) : undefined;
	try {
		const formData = new FormData();
		for (const [key, value] of Object.entries(values)) {
			formData.append(key, value);
		}
		const response = await fetch(action, { method: 'POST', body: formData });
		const result = deserialize(await response.text());
		if (result.type === 'success') {
			showSuccess(opts, result.data as FormActionData | undefined, toastId);
			await invalidateAll();
			opts.onSuccess?.(result.data as FormActionData | undefined);
		} else if (result.type === 'failure') {
			showFailure(result.data as FormActionData | undefined, toastId);
		} else if (toastId !== undefined) {
			toast.dismiss(toastId);
		}
	} finally {
		opts.onFinish?.();
	}
}
