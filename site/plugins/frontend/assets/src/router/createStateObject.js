export function createStateObject( obj ){
  return {
    url: obj.url,
    title: obj.title || obj.url.split('/').pop(),
    template: obj.template || false,
    worlditem: obj.worlditem || false
  };
}
