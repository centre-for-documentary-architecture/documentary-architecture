import { historyStore } from './historyStore.js';
import { pageStore } from './pageStore.js';

import { loadData } from './loadData.js';

export async function navigateTo( url, replace = false, page = {} ) {

	const target = new URL( url );
	if( target.host != window.location.host ){
		window.open( url, '_blank' );
		return;
	}

	page.title = page.title || target.pathname;
	page.template = page.template || false;

	let state = {
		url: url,
		title: page.title,
		template: page.template,
		worlditem: page.worlditem
	};

	// use info provided by page object for

	pageStore.set({...page, loading: true});

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

	state = {
		title: data.title,
		url: data.url,
		worlditem: data.worlditem
	}

	history.replaceState( state, data.title, data.url );

	historyStore.update( l => {
		l[l.length-1] = state;
		return l;
	});

}
