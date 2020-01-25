import { writable } from 'svelte/store';
export const pageStore = writable({
	title: document.title,
	url: window.location.href
});
