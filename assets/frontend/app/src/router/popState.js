import { historyStoreRemoveLast } from './historyStore.js';
import { pageStoreSet } from './pageStore.js';

import { loadData } from './loadData.js';

async function navigateBack( target ) {

	// use info provided by old state object for
	pageStoreSet({...target, loading: true});
	historyStoreRemoveLast();

	let data = await loadData( target.url );

	let classlist = ['dynamic', data.theme, data.layout, data.template, data.type, data.entity];

	// replace info in page object and history
	pageStoreSet({...data , loading: false });

	document.body.className = classlist.join(' ');

	// naviWorld( entity.worlditem );

}

export async function popState( event ){

	if( event.state ){

		console.log( 'popState('+event.state.url+')' );
		navigateBack( event.state );

	} else {

		throw Error('popState() no history.state object');

	}

}
