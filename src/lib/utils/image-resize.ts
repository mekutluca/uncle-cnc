const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

/**
 * Fotoğrafı tarayıcıda en fazla 1600px olacak şekilde küçültüp JPEG'e çevirir —
 * telefon fotoğrafları depolamayı şişirmesin. Küçültülemeyen dosya (ör. desteklenmeyen
 * biçim) olduğu gibi döner.
 */
export async function resizeImage(file: File): Promise<File> {
	try {
		const bitmap = await createImageBitmap(file);
		const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));

		const canvas = document.createElement('canvas');
		canvas.width = Math.round(bitmap.width * scale);
		canvas.height = Math.round(bitmap.height * scale);
		const context = canvas.getContext('2d');
		if (!context) return file;
		context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		bitmap.close();

		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
		);
		if (!blob) return file;

		const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
		return new File([blob], name, { type: 'image/jpeg' });
	} catch {
		return file;
	}
}
