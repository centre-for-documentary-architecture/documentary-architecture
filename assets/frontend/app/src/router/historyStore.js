import { writable } from 'svelte/store';
export const historyStore = writable([]);

export function historyStoreAdd( state ){
  historyStore.update(h => [...h, state]);
}
export function historyStoreReplaceLast( state ){
  historyStore.update( h => {
    h[h.length-1] = state;
    return h;
  });
}
export function historyStoreRemoveLast(){
  historyStore.update( h => {
		h.pop();
		return h;
	});
}
