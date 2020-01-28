import { historyStoreAdd, historyStoreReplaceLast } from './historyStore.js';
import { pageStoreSet } from './pageStore.js';

import { createStateObject, assumeTemplate } from './utilities.js';

import { loadData } from './loadData.js';

let loading = false;

function assumeTitle( href ){

	// from query
	let matches = href.search.match(/research=([^&]*)/);
	if( matches ){
		return matches[0].replace('research=','');
	}

	// from last slug
	if( href.pathname ){
		let slugs = href.pathname.split('/');
		return slugs.pop();
	}

	return '';

}

export async function navigateTo( url, target = {}, replace = false ) {
	if( loading === true ){
		console.log('navigateTo() already loading');
		return false;
	}
	if( url === window.location.href ){
		return false;
	}
	const href = new URL( url );
	if( href.host !== window.location.host ){
		window.open( href, '_blank' );
		return;
	}
	
	loading = true;

	target.url = url;
	target.template = target.template || assumeTemplate( href.pathname );
	target.title = target.title || assumeTitle( href );

	let state = createStateObject( target );

	// use info provided by page object for

	pageStoreSet({...target, loading: true});

	if( replace === false ){
		history.pushState( state, state.title, state.url);
	} else {
		history.replaceState( state, state.title, state.url);
	}

	historyStoreAdd( state );

	// load data
	let data = await loadData( url );

	let classlist = ['dynamic'];
	if( data.html ){
		data.url = state.url;
		data.title = state.title;
		data.template = 'html';
		classlist = [...classlist, 'reqular', 'black'];
	} else {
		state = createStateObject( data );
		// let classlist = ['dynamic', data.theme, data.layout, data.template, data.entity, data.type, data.category ];
		classlist = [...classlist, data.theme, data.layout, data.template, data.entity ];
	}

	// replace info in page object and history
	pageStoreSet({...data , loading: false });

	// naviWorld( entity.worlditem );

	history.replaceState( state, data.title, data.url );
	historyStoreReplaceLast( state );

	document.body.className = classlist.join(' ');

	loading = false;
}
