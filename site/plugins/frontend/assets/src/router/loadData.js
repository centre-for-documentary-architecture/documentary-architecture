export async function loadData( url ){

	url = url.replace( '.json', '' );

	const location = new URL( url );
	url = location.origin + '/get' + location.pathname + location.search;

	console.log( 'loadData( '+url+' )' );
	const response = await fetch( url );
	let data;
	if (response.ok) { // if HTTP-status is 200-299
		// get the response body (the method explained below)
		// console.log( response.headers.get('content-type') );
		data = await response.json();
	} else {
		console.error("HTTP-Error: " + response.status);
	}
	return data.data;

}
