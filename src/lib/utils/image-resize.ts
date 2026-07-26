const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;
const THUMB_DIMENSION = 800;
const THUMB_QUALITY = 0.8;

async function resize(file: File, maxDimension: number, quality: number): Promise<File> {
	try {
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));

		const canvas = document.createElement('canvas');
		canvas.width = Math.round(bitmap.width * scale);
		canvas.height = Math.round(bitmap.height * scale);
		const context = canvas.getContext('2d');
		if (!context) return file;
		context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		bitmap.close();

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/jpeg', quality)
		);
		if (!blob) return file;

		const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
		return new File([blob], name, { type: 'image/jpeg' });
	} catch {
		return file;
	}
}

/**
 * Fotoğrafı tarayıcıda en fazla 1600px olacak şekilde küçültüp JPEG'e çevirir —
 * telefon fotoğrafları depolamayı şişirmesin. Küçültülemeyen dosya (ör. desteklenmeyen
 * biçim) olduğu gibi döner.
 */
export function resizeImage(file: File): Promise<File> {
	return resize(file, MAX_DIMENSION, JPEG_QUALITY);
}

/**
 * Kart ve liste görünümleri için küçük (~800px) varyant. Ana görselle birlikte
 * yüklenir, `thumbPath` düzeniyle depolanır. Küçültme başarısızsa ana dosya döner —
 * varyant hiç yüklenmemiş olsa da görüntüleme tarafı tam boyuta düşer (onerror).
 */
export function makeThumb(file: File): Promise<File> {
	return resize(file, THUMB_DIMENSION, THUMB_QUALITY);
}
