import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type {
	WithoutChild,
	WithoutChildren,
	WithoutChildrenOrChild,
	WithElementRef
} from '$lib/types';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
