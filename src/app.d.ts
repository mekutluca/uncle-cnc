import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	/** package.json sürümü — vite.config.ts `define` ile derlemede gömülür */
	const __APP_VERSION__: string;

	namespace App {
		interface Locals {
			/** Yalnızca /admin rotalarında hooks.server.ts tarafından doldurulur. */
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session?: Session | null;
		}
		// interface Error {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
