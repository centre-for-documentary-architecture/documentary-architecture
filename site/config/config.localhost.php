<?php

return [

	'panel' =>[
		'install' => true,
		'css' => 'assets/css/panel.css'
	],

	'cache' => [
		'pages' => [
			'active' => false
		]
	],
	'cache-expires' => 10,
	'cache.abstract' => true,
	'cache.json' => false,
	'cache.worlditems' => true,

	'cache.get' => false,

	'debug'  => true,

	'cache-expires' => 30,

	'cdn' =>		 	  	'https://documentary-architecture.fra1.digitaloceanspaces.com/cda',
	'frontend-js' => 	'assets/frontend/bundle.js',
	'frontend-css' => 'assets/frontend/bundle.css',

];
