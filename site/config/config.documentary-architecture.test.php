<?php

header("Access-Control-Allow-Origin: *");

return [

	'kql' => [
		'auth' => false,
		'methods' => [
			'allowed' => [
				'Kirby\Cms\Users::findByNameSlug',
			]
		],
	],

	'debug'  => true,

	'cache' => [
		'pages' => [
			'active' => false
		]
	],
	'cda.get.cache' => true,

	'frontend-js' =>  '/assets/frontend/bundle.js',
	'frontend-css' => '/assets/frontend/bundle.css',

];
