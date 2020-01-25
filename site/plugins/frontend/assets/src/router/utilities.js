export function createStateObject( obj ){
  return {
    url: obj.url,
    title: obj.title || obj.url.split('/').pop(),
    template: obj.template || false,
    worlditem: obj.worlditem || false
  };
}

export function assumeTemplate( pathname ){
  if( pathname === '' ){
    return false;
  } else if( pathname.match(/^\/archive\/.+/) ){
		return 'entity';
	} else if( pathname.match(/^\/archive(\/*$|\?$|\?.+)/) ){
		return 'archive';
	}
	return false;
}
