export function createStateObject( obj ){
	let title = obj.title || obj.url.split('/').pop();
	return {
		url: obj.url,
		title: title.replace('C D A → ',''),
		template: obj.template || false,
		worlditem: obj.worlditem || false
	};
}

export function assumeTemplate( pathname ){
  if( pathname === '' || pathname === '/' ){
    return false;
  } else if( pathname.match(/^\/?archive\/.+\/.+/) ){
		return 'entity';
	} else if( pathname.match(/^\/?archive.*/) ){
		return 'archive';
	}
	return false;
}

export function assumeTitle( href ){

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
