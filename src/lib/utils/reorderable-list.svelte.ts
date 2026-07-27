import { submitFormAction } from '$lib/utils/form-enhance';

/**
 * Akıştan (streamed load) gelen listeyi yerel durumda tutar ve iyimser,
 * geri alınabilir sıralama takası sağlar. Yerel durum, FLIP animasyonunun
 * çalışması için listenin her invalidate'te baştan kurulmamasını garanti eder.
 */
export class ReorderableList<T extends { id: string }> {
	rows = $state<T[] | null>(null);
	loadFailed = $state(false);
	moveBusy = $state(false);

	/** Her yeni akış sözü (ilk yükleme ve invalidate'ler) yerel duruma senkronlanır. */
	sync(promise: Promise<T[]>) {
		promise.then(
			(rows) => (this.rows = rows),
			() => (this.loadFailed = true)
		);
	}

	/** İyimser takas: önce görünüm güncellenir, sunucu doğrulayamazsa geri alınır. */
	async move(action: string, id: string, direction: -1 | 1) {
		const rows = this.rows;
		if (!rows || this.moveBusy) return;
		const index = rows.findIndex((row) => row.id === id);
		const target = index + direction;
		if (index === -1 || target < 0 || target >= rows.length) return;

		const next = [...rows];
		[next[index], next[target]] = [next[target], next[index]];
		this.rows = next;

		const ok = await submitFormAction(
			action,
			{ id, direction: String(direction) },
			{
				onStart: () => (this.moveBusy = true),
				onFinish: () => (this.moveBusy = false)
			}
		);
		if (!ok) this.rows = rows;
	}
}
