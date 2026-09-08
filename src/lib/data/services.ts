import * as m from '$lib/paraglide/messages';
import type { Service } from '$lib/types';

/** Beş hizmet dikeyi — sıra ve tanıtım metinleri müşterinin PDF'inden.
 *  `title`/`short`/`intro` getter'dır: dil değişince yeniden hesaplanır. */
export const services: Service[] = [
	{
		slug: 'appraisal',
		formName: 'appraisal',
		code: 'EKS-01',
		get title() {
			return m.services_data_appraisal_title();
		},
		get short() {
			return m.services_data_appraisal_short();
		},
		get intro() {
			return m.services_data_appraisal_intro();
		},
		fields: {
			machine: true,
			modelYear: 'single',
			priceRange: false,
			photos: false,
			faultDescription: false
		}
	},
	{
		slug: 'consulting',
		formName: 'consulting',
		code: 'DAN-02',
		get title() {
			return m.services_data_consulting_title();
		},
		get short() {
			return m.services_data_consulting_short();
		},
		get intro() {
			return m.services_data_consulting_intro();
		},
		fields: {
			machine: false,
			modelYear: 'none',
			priceRange: false,
			photos: false,
			faultDescription: false
		}
	},
	{
		slug: 'maintenance',
		formName: 'maintenance',
		code: 'BAK-03',
		get title() {
			return m.services_data_maintenance_title();
		},
		get short() {
			return m.services_data_maintenance_short();
		},
		get intro() {
			return m.services_data_maintenance_intro();
		},
		fields: {
			machine: true,
			modelYear: 'single',
			priceRange: false,
			photos: true,
			faultDescription: false
		}
	},
	{
		slug: 'repair',
		formName: 'repair',
		code: 'SRV-04',
		get title() {
			return m.services_data_repair_title();
		},
		get short() {
			return m.services_data_repair_short();
		},
		get intro() {
			return m.services_data_repair_intro();
		},
		fields: {
			machine: true,
			modelYear: 'single',
			priceRange: false,
			photos: true,
			faultDescription: true
		}
	},
	{
		slug: 'machine-trading',
		formName: 'machine-trading',
		code: 'TIC-05',
		get title() {
			return m.services_data_machine_trading_title();
		},
		get short() {
			return m.services_data_machine_trading_short();
		},
		get intro() {
			return m.services_data_machine_trading_intro();
		},
		fields: {
			machine: true,
			modelYear: 'range-by-intent',
			priceRange: true,
			photos: 'sell-only',
			faultDescription: false
		}
	}
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
