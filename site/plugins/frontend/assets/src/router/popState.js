import { historyStore } from './historyStore.js';
import { pageStore } from './pageStore.js';

import { loadData } from './loadData.js';

async function navigateBack( target ) {

	// use info provided by old state object for
	pageStore.set({...target, loading: true});
	historyStore.update( l => {
		l.pop();
		return l;
	});

	// load data
	let data = await loadData( target.url );

	// replace info in page object and history
	pageStore.set({...data , loading: false });

	// naviWorld( entity.worlditem );
	// relocate();

}

export async function popState( event ){

	if( event.state ){

		console.log( 'popState('+event.state.url+')' );
		navigateBack( event.state );

	} else {

		throw Error('popState() no history.state object');

	}

}
