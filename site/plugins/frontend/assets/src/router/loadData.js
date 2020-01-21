export async function loadData( url ){

	url = url.replace( '.json', '' );

	const location = new URL( url );
	url = location.origin + location.pathname + '.json' + location.search;

	console.log( 'loadData( '+url+')' );
	const response = await fetch( url );
	let data;
	if (response.ok) { // if HTTP-status is 200-299
		// get the response body (the method explained below)
		data = await response.json();
	} else {
		console.error("HTTP-Error: " + response.status);
	}
	return data.data;

}
