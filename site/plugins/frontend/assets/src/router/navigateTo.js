import { historyStore } from './historyStore.js';
import { pageStore } from './pageStore.js';

import { createStateObject } from './createStateObject.js';

import { loadData } from './loadData.js';

let loading = false;

export async function navigateTo( url, replace = false, target = {} ) {
	if( loading === true ){
		console.log('navigateTo() already loading');
		return false;
	}

	const href = new URL( url );
	if( href.host !== window.location.host ){
		window.open( href, '_blank' );
		return;
	}
	if( url === window.location.href ){
		return false;
	}

	loading = true;

	target.title = target.title || target.pathname;
	target.template = target.template || false;
	target.url = url;

	let state = createStateObject( target );

	// use info provided by page object for

	pageStore.set({...target, loading: true});

	if( replace === false ){
		history.pushState( state, state.title, state.url);
	} else {
		history.replaceState( state, state.title, state.url);
	}

	historyStore.update(l => [...l, state]);

	// load data
	let data = await loadData( url );

	// replace info in page object and history
	pageStore.set({...data , loading: false });

	// naviWorld( entity.worlditem );
	// relocate();

	state = createStateObject( data );
	history.replaceState( state, data.title, data.url );

	historyStore.update( l => {
		l[l.length-1] = state;
		return l;
	});

	loading = false;
}
