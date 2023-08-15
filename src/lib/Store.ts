import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const SelectedGroup: Writable<Group | null> = localStorageStore('SelectedGroup', null);
export const SelectedSession: Writable<Session | null> = localStorageStore('SelectedSession', null);
export const SelectedStudent: Writable<Student | null> = localStorageStore('SelectedStudent', null);

export const Theme: Writable<string> = localStorageStore('Theme', 'theme');
