<?php

use Kirby\Toolkit\Str;

Str::$language = [
	'ß' => 'ss',
	'ä' => 'ae',
	'ö' => 'oe',
	'ü' => 'ue',
];

return [

	// setting up
	'panel' => [
		'css' => 'assets/css/panel.css'
	],

	// development
	'debug'  => false,

	'kql' => [
		'auth' => false,
		'methods' => [
			'allowed' => [
				'Kirby\Cms\Users::findBySlug',
				'Kirby\Cms\User::slug',
				'Kirby\Cms\User::schema',
			]
		],
	],

	// archive shall render all 404, using the request path as query input
	'error' => 'error',

	'smartypants' => true,

	// cache
	'cache' => [
		'pages' => [
			'active' => false
		]
	],
	'cda.get.cache' => false,

	// other configuration
	'thumbs' => [
		'thumbs' => [
			'quality' => 75
		],
		'srcsets' => [
			'mini' => [40, 80, 120],
			'small' => [120, 240, 360],
			'medium' => [360, 640, 1200],
			'large' => [640, 1200, 2000],
			'full' => [640, 1200, 2000, 3000],
			'all' => [80, 360, 640, 1200, 2000, 3000],
		]
	],

	'cdn-domain' =>	  '//documentary-architecture.fra1.digitaloceanspaces.com',
	'cdn-host' => 	  'https://documentary-architecture.fra1.digitaloceanspaces.com',
	'cdn' =>		  'https://documentary-architecture.fra1.digitaloceanspaces.com/cda',
	// 'cdn' =>		  'https://documentary-architecture.fra1.cdn.digitaloceanspaces.com/cda',
	'frontend-js' =>  'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/frontend/bundle.js',
	'frontend-css' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/frontend/bundle.css',

];
