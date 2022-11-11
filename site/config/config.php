<?php

Str::$language = [
	'ß' => 'ss',
	'ä' => 'ae',
	'ö' => 'oe',
	'ü' => 'ue',
];

return [

	// setting up
	'panel' =>[
		'css' => 'assets/css/panel.css'
	],

	'kql' => [
		'auth' => false
	],

	// development
	'debug'  => true,

	// archive shall render all 404, using the request path as query input
	'error' => 'error',

	'smartypants' => true,

	// cache
	// https://getkirby.com/docs/guide/cache
	'cache' => [
		'pages' => [
			'active' => false
		]
	],
	'cache-expires' => 1440,
	'cache.abstract' => true,
	'cache.worlditems' => true,
	'cache.get' => true,

	// other configuration
	/*
	'thumbs' => [
		'srcsets' => [
			'mini' =>  [ 40, 80, 120],
			'small' =>     [ 80, 120, 240, 360],
			'medium' =>                   [360, 480, 640, 880, 1200],
			'large' =>                              [640, 880, 1200, 1600, 2000],
			'full' =>                               [640, 880, 1200, 1600, 2000, 2500, 3000, 3500],
			'all' =>       [ 80, 120, 240, 360, 480, 640, 880, 1200, 1600, 2000, 2500, 3000, 3500],
		]
	],
	*/
	'thumbs' => [
		'thumbs' => [
			'quality' => 75
		],
		'srcsets' => [
			'mini' => [ 40, 80, 120],
			'small' => [ 120, 240, 360],
			'medium' => [360, 640, 1200],
			'large' => [640, 1200, 2000],
			'full' => [640, 1200, 2000, 3000],
			'all' => [ 80, 360, 640, 1200, 2000, 3000],
		]
	],

	'cdn-domain' =>		'//documentary-architecture.fra1.digitaloceanspaces.com',
	'cdn-host' => 		'https://documentary-architecture.fra1.digitaloceanspaces.com',
	'cdn' =>		 			'https://documentary-architecture.fra1.digitaloceanspaces.com/cda',
	// 'cdn' =>				'https://documentary-architecture.fra1.cdn.digitaloceanspaces.com/cda',
	'frontend-js' => 	'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/frontend/bundle.js',
	'frontend-css' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/frontend/bundle.css',

];
