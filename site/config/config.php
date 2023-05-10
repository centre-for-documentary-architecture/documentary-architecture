<?php

use Kirby\Toolkit\Str;

Str::$language = [
	'ß' => 'ss',
	'ä' => 'ae',
	'ö' => 'oe',
	'ü' => 'ue',
];

return [

	'debug'  => false,
	'smartypants' => true,

	'frontend' => 'https://new.documentary-architecture.org',
	'cdn' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda',

	'panel' => [
		'css' => 'assets/css/panel.css'
	],

	'kql' => [
		'auth' => false,
		'methods' => [
			'allowed' => [
				'Kirby\Cms\Page::type',
			]
		],
	],

];
