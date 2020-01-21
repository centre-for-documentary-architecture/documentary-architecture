export async function popState( event ){
	console.log( event );

	if( event.state ){

		console.log( 'popState()' + event.state );

	} else {

		throw Error('popState() no history.state object');

	}

}
