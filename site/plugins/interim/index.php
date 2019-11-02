<?php

/**
* matter-of-data plugin
*/

Kirby::plugin('centre-for-documentary-architecture/interim', [

	'routes' => [
		[
			'pattern' => '',
			'action'  => function () {

				if( Server::host() === 'documentary-architecture.org' ){
					
					return new Page([
						'slug' => 'interim',
						'template' => 'interim',
						'content' => [
							'foo' => 'bar'
						]
					]);

				} else {
					return page();
				}

			}
		]
	],

	'templates' => [
        'interim' => __DIR__ . '/templates/interim.php'
    ]

]);
