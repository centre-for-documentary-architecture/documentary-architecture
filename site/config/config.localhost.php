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

	'debug'  => true,

	'cache-expires' => 30,

	'cdn' =>		 	'https://documentary-architecture.fra1.digitaloceanspaces.com/cda',
	'frontend-js' => 	'http://localhost:8000/media/plugins/centre-for-documentary-architecture/frontend/public/bundle.js',
	'frontend-css' => 	'http://localhost:8000/media/plugins/centre-for-documentary-architecture/frontend/public/bundle.css',

];
