import { writable } from 'svelte/store';
export const pageStore = writable({
	title: 'CDA',
	url: window.location.href
});
