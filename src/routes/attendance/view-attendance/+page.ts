import { GroupIsNull, SessionIsNull } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = true;
export const ssr = true;

export const load = (async (event) => {
	if (GroupIsNull()) {
		throw redirect(303, '/attendance');
	}
	if (SessionIsNull()) {
		throw redirect(303, '/attendance');
	}
	return {};
}) satisfies PageLoad;
