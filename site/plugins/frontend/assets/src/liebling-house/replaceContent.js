import { historyStoreAdd, historyStoreReplaceLast } from '../router/historyStore.js';
import { pageStoreReplaceProperties } from '../router/pageStore.js';

import { loadData } from '../router/loadData.js';

let loading = false;

export async function replaceContent( url, target = {}, replace = false ) {
	if( loading === true ){
		console.log('replaceContent() already loading');
		return false;
	}
	if( url === window.location.href ){
		return false;
	}

	console.log('REPLAAAACE');

	const href = new URL( url );

	loading = true;
	let state = history.state;

	state.url = url;
	state.title = target.title || assumeTitle( href );
	state.worlditem = target.worlditem || false;

	// use info provided by page object for

	pageStoreReplaceProperties({...target, loading: true});

	if( replace === false ){
		historyStoreAdd( state );
		history.pushState( state, state.title, state.url);
	} else {
		historyStoreReplaceLast( state );
		history.replaceState( state, state.title, url );
	}

	// load data
	let data = await loadData( url );

	state.title = data.title;
	state.worlditem = data.worlditem;

	// ? naviWorld( entity.worlditem );

	pageStoreReplaceProperties({
		...state,
		id: data.id,
		category: data.category,
		keywords: data.keywords,
		description: data.description,
		content: data.content,
		pagination: data.pagination || false,
		loading: false
	});
	historyStoreReplaceLast( state );
	history.replaceState( state, state.title, state.url );

	loading = false;
}
