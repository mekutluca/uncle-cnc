import { error, redirect } from '@sveltejs/kit';
import { FORM_LABELS } from '$lib/data/form-fields';
import { sendSubmissionNotification } from '$lib/server/mailer';
import { supabaseAnon as supabase } from '$lib/server/supabase';
import { SUBMISSION_PHOTOS_BUCKET } from '$lib/utils/storage';
import type { RequestHandler } from './$types';

/** Tüm talep formlarının gönderim noktası: kayıt uc_form_submissions'a,
 * fotoğraflar private bucket'a yazılır. Ardından en-iyi-çaba e-posta bildirimi
 * gönderilir (başarısızlığı gönderimi düşürmez). */

const MAX_FILES = 3; // PhotoUploadField ile eşleşir
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_FIELD_CHARS = 5000;

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();

	// Honeypot dolduysa bot'a da başarı gösterilir. Kayıt alınmaz.
	if (String(formData.get('bot-field') ?? '').trim() !== '') redirect(303, '/thanks');

	const formName = String(formData.get('form-name') ?? '');
	if (!(formName in FORM_LABELS)) error(400, 'Geçersiz form.');

	const data: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (key === 'form-name' || key === 'bot-field' || key === 'fotograflar') continue;
		if (typeof value !== 'string') continue;
		const trimmed = value.trim();
		if (trimmed) data[key] = trimmed.slice(0, MAX_FIELD_CHARS);
	}

	const files = formData
		.getAll('fotograflar')
		.filter((entry): entry is File => entry instanceof File && entry.size > 0);
	if (files.length > MAX_FILES) error(400, `En fazla ${MAX_FILES} fotoğraf yükleyebilirsiniz.`);
	for (const file of files) {
		if (file.size > MAX_FILE_BYTES) error(400, 'Fotoğraflar en fazla 4 MB olabilir.');
		if (!file.type.startsWith('image/')) error(400, 'Yalnızca görsel dosyaları yüklenebilir.');
	}

	const photos: string[] = [];
	for (const file of files) {
		const ext = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase() ?? 'jpg';
		const path = `${formName}/${crypto.randomUUID()}.${ext}`;
		const { error: uploadError } = await supabase.storage
			.from(SUBMISSION_PHOTOS_BUCKET)
			.upload(path, file, { contentType: file.type });
		if (uploadError) {
			console.error('Talep fotoğrafı yüklenemedi:', uploadError.message);
			error(500, 'Fotoğraflar yüklenemedi. Lütfen tekrar deneyin.');
		}
		photos.push(path);
	}

	const { error: insertError } = await supabase
		.from('uc_form_submissions')
		.insert({ form_name: formName, data, photos });
	if (insertError) {
		console.error('Talep kaydedilemedi:', insertError.message);
		error(500, 'Talebiniz kaydedilemedi. Lütfen tekrar deneyin.');
	}

	try {
		await sendSubmissionNotification(formName, data, photos.length);
	} catch (mailError) {
		console.error('Bildirim e-postası gönderilemedi:', mailError);
	}

	// JS kapalıyken natif POST da buraya düşer. Her iki durumda /thanks'e yönlenir.
	redirect(303, '/thanks');
};
