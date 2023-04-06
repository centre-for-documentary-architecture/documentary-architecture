<?php

use Kirby\Cms\Html;
use Kirby\Toolkit\Str;

return [

	/*
	all refactored and approved 2023-04-06
	*/

	'toLink' => function () {
		$name = $this->name();
		return Html::a(
			$this->url(),
			$name,
			[
				'title' => "Profile of $name"
			]
		);
	},

	'url' => function ( bool $absolute = false ) {
		$url = '/info/team/' . $this->slug();
		if( $absolute === true ){
			$url = $this->kirby()->url() . $url;
		}
		return $url;
	},

	'slug' => function () {
		return Str::slug( $this->name() );
	},

	'schema' => function (): array {
		$data = [
			'@context' => 'https://schema.org',
			'@type' => 'Person',
			'name' => (string)$this->name(),
			'url' => $this->url( true ),
			'worksFor' => 'Centre for Documentary Architecture',
			'jobTitle' => (string)$this->profession(),
			'sameAs' => $this->links()->structureToLinks( false )
		];
		if( $this->show_email()->isTrue() ){
			$data['email'] = $this->email();
		}
		return $data;
	},
	
];
