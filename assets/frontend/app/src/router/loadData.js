function readReturnHeader( header ){
	if( header.includes('json') ){
		return 'json';
	}
	return 'html';
}

export async function loadData( url ){

	url = url.replace( '.json', '' );

	const location = new URL( url );
	url = location.origin;

	let path = location.pathname;
	if( location.pathname.substring(0,4) === '/de/' ){
		url += '/de';
		path = path.slice(3);
	}
	url += '/get' + path + location.search;

	console.log( 'loadData( '+url+' )' );
	const response = await fetch( url );

	if (!response.ok) {
		console.error("HTTP-Error: " + response.status);
		return false;
	}

	let format = readReturnHeader( response.headers.get('content-type') );
	let data = {};

	if( format === 'json' ){
		data = await response.json();
	} else {
		data.data = {};
		data.data.html = await response.text();
	}

	return data.data;
}
