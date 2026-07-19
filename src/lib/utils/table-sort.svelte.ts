import type { SortOrder } from '$lib/types';

/**
 * Tıklanabilir başlıklı tablolar için sütun sıralama durumu. Bir sütuna
 * tıklamak başlangıç yönü → ters yön → sırasız döngüsünde ilerler; başka
 * sütuna tıklamak o sütunun başlangıç yönüyle yeniden başlar.
 */
export class TableSort<K extends string> {
	key = $state<K | null>(null);
	order = $state<SortOrder>('asc');

	toggle(key: K, initialOrder: SortOrder = 'asc') {
		if (this.key === key) {
			if (this.order === initialOrder) {
				this.order = initialOrder === 'asc' ? 'desc' : 'asc';
			} else {
				this.key = null;
				this.order = 'asc';
			}
		} else {
			this.key = key;
			this.order = initialOrder;
		}
	}
}
