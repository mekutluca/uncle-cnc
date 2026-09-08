import { createTransport } from 'nodemailer';
import { env } from '$env/dynamic/private';
import { FORM_LABELS, orderedEntries } from '$lib/data/form-fields';
import { site } from '$lib/data/site';

/** SMTP env değişkenleri (Coolify'da tanımlanır): SMTP_HOST, SMTP_PORT,
 * SMTP_USER, SMTP_PASS. İsteğe bağlı: SMTP_FROM ve FORM_NOTIFY_TO.
 * Eksiklerse bildirim sessizce atlanır — gönderim zaten veritabanında. */
function transport() {
	if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
	const port = Number(env.SMTP_PORT ?? 465);
	return createTransport({
		host: env.SMTP_HOST,
		port,
		secure: port === 465,
		auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
	});
}

const escapeHtml = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function sendSubmissionNotification(
	formName: string,
	data: Record<string, string>,
	photoCount: number
): Promise<void> {
	const mailer = transport();
	if (!mailer) {
		console.warn('SMTP yapılandırılmamış, form bildirimi e-postası atlandı.');
		return;
	}

	const formLabel = FORM_LABELS[formName] ?? formName;
	const entries = orderedEntries(data);
	const adminUrl = `${site.url}/admin/submissions`;

	const text = [
		`Yeni ${formLabel} talebi alındı.`,
		'',
		...entries.map(([label, value]) => `${label}: ${value}`),
		...(photoCount
			? ['', `${photoCount} fotoğraf eklendi (yönetim panelinden görüntülenir).`]
			: []),
		'',
		`Tüm talepler: ${adminUrl}`
	].join('\n');

	const rows = entries
		.map(
			([label, value]) =>
				`<tr><td style="padding:6px 12px 6px 0;color:#666;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>` +
				`<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`
		)
		.join('');
	const html =
		`<p>Yeni <strong>${escapeHtml(formLabel)}</strong> talebi alındı.</p>` +
		`<table style="border-collapse:collapse;font-size:14px">${rows}</table>` +
		(photoCount ? `<p>${photoCount} fotoğraf eklendi (yönetim panelinden görüntülenir).</p>` : '') +
		`<p><a href="${adminUrl}">Tüm talepler</a></p>`;

	await mailer.sendMail({
		// Brevo'da SMTP_USER gönderen adresi değildir (…@smtp-brevo.com login'i);
		// gönderen, doğrulanmış domain'deki bir adres olmalıdır.
		from: env.SMTP_FROM ?? site.email,
		to: env.FORM_NOTIFY_TO ?? site.email,
		replyTo: data.eposta || undefined,
		subject: `Yeni talep — ${formLabel}${data.ad_soyad ? `: ${data.ad_soyad}` : ''}`,
		text,
		html
	});
}
