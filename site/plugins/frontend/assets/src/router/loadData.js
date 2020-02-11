function readHeader( header ){
	if( header.includes('json') ){
		 return 'json';
	}
	return 'html';
}

export async function loadData( url ){

	url = url.replace( '.json', '' );

	const location = new URL( url );
	url = location.origin + '/get' + location.pathname + location.search;

	console.log( 'loadData( '+url+' )' );
	const response = await fetch( url );

	if (!response.ok) {
		console.error("HTTP-Error: " + response.status);
		return false;
	}

	let format = readHeader( response.headers.get('content-type') );
	let data = {};

	if( format === 'json' ){
		data = await response.json();
	} else {
		data.data = {};
		data.data.html = await response.text();
	}

	return data.data;
}
