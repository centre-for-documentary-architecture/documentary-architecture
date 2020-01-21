export function clickLink( event ){

	let anchor = event.target.closest('a');
	if( !anchor ){
		return;
	}
	event.preventDefault();

	console.log('clickLink() navigate to '+anchor.href);

}
