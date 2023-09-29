import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import db from '$lib/DB';
import { get } from 'svelte/store';
import { SelectedGroup } from '$lib/Store';

export const prerender = true;
export const ssr = true;

export const load = (async () => {
	const CurrentGroup = get(SelectedGroup)
	let students: Student[]

	if (CurrentGroup !== null && CurrentGroup?.id) {
		try {
			students = await db.students.where('groupid').equals(CurrentGroup.id).toArray();
		}
		catch (e) {
			students = []
		}
	} else {
		throw redirect(303, '/groups');
	}

	return { CurrentGroup, students };
}) satisfies PageLoad;
