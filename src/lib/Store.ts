import { writable, type Writable } from 'svelte/store';

export const SelectedGroup: Writable<Group | null> = writable(null)
export const SelectedSession: Writable<Session | null> = writable(null)
export const SelectedStudent: Writable<Student | null> = writable(null)

export const Theme: Writable<string> = writable('theme')
