import { writable } from 'svelte/store';
export const pageStore = writable({
	title: document.title,
	url: window.location.href
});

export function pageStoreSet( pageObject ){
	pageStore.set( pageObject );
}

export function pageStoreReplaceProperties( properties ){
	pageStore.update( page => {
		for (var key in properties) {
			page[key] = properties[key];
		}
		return page;
	});
}
