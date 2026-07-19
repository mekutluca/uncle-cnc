/**
 * adapter-netlify'ın ürettiği render fonksiyonu `path: ["/*"]` ile TÜM istekleri
 * (POST dahil) sahiplenir; bu yüzden Netlify Forms gönderimleri hiçbir zaman
 * statik katmana ulaşamaz. Bu betik, /__forms.html yolunu fonksiyonun
 * excludedPath listesine ekler ki form POST'ları CDN'de yakalanabilsin.
 * (Aynı mimarideki Next.js çözümü: https://opennext.js.org/netlify/forms)
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = '.netlify/functions-internal/sveltekit-render.mjs';
const BEFORE = 'excludedPath: ["/.netlify/*"]';
const AFTER = 'excludedPath: ["/.netlify/*", "/__forms.html"]';

const source = readFileSync(FILE, 'utf8');

if (source.includes(AFTER)) {
	console.log('patch-netlify-forms: zaten uygulanmış, atlanıyor');
	process.exit(0);
}

if (!source.includes(BEFORE)) {
	console.error(
		`patch-netlify-forms: ${FILE} içinde beklenen '${BEFORE}' bulunamadı — ` +
			'adapter-netlify çıktısı değişmiş olabilir, betiği güncelleyin.'
	);
	process.exit(1);
}

writeFileSync(FILE, source.replace(BEFORE, AFTER));
console.log('patch-netlify-forms: /__forms.html render fonksiyonundan hariç tutuldu');
