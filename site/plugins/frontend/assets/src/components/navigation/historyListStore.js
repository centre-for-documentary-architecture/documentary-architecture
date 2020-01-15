import { writable } from 'svelte/store';
export const historyList = writable([]);

export function historyListAdd( item ){
	historyList.update(l => [...l, {
		title: item.title,
		url: item.url,
		template: item.template
	}]);
}
