import { navigateTo } from './navigateTo.js';

export function clickAnyLink( event ){

	let anchor = event.target.closest('a');
	if( !anchor || !anchor.classList.contains('follow') ){
		return;
	}

	event.preventDefault();
	navigateTo( anchor.href );

}
