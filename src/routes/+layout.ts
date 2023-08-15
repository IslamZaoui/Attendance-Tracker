import { Capacitor } from '@capacitor/core';
import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = true;

export const load = (async ({ url }) => {
	const currentPlatform = Capacitor.getPlatform() as 'web' | 'ios' | 'android';
	return {
		currentPlatform,
		url: url.pathname
	};
}) satisfies LayoutLoad;
