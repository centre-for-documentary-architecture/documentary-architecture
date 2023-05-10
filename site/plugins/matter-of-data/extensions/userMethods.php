<?php

use Kirby\Cms\Html;
use Kirby\Toolkit\Str;

return [

	/*
	 * used by
	 * (user: ) kirbytag
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

	/*
	 * used by
	 * $user->toLink()
	 * $user->schema()
	 */
	'url' => function ( bool $absolute = false ) {
		$url = '/info/team/' . $this->slug();
		if( $absolute === true ){
			$url = $this->kirby()->url() . $url;
		}
		return $url;
	},

	/**
     * @kql-allowed
     */
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
