<?php

/*
* siteMethods
* https://getkirby.com/docs/reference/plugins/extensions/site-methods
*/

return [
	'archive' => function ( $type = false ){
		/*
		* returns the archive page or any given sub archive
		*/
		if( $page = $this->page('archive/'.$type) ){
			// returns /archive/slug
			return $page;
		} else {
			// returns /archive
			return $this->page('archive');
		}
	},
	'dataAbstract' => function( string $srcset = 'medium' ){

		$content = $this->homePage()->dataAbstract();
		$content['title'] = $this->title()->value();

		return $content;

	},
];
