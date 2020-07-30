import { historyStoreRemoveLast } from './historyStore.js';
import { pageStoreSet } from './pageStore.js';

import { loadData } from './loadData.js';

async function navigateBack( target ) {

	// use info provided by old state object for
	pageStoreSet({...target, loading: true});
	historyStoreRemoveLast();

	let data = await loadData( target.url );

	// replace info in page object and history
	pageStoreSet({...data , loading: false });

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
