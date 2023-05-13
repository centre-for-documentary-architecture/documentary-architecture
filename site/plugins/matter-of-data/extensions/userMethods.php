<?php

use Kirby\Cms\Html;
use Kirby\Toolkit\Str;

return [

	/**
	 * used by
	 * $user->toLink()
	 * $user->schema()
	 * @todo is this needed?
	 * @kql-allowed
	 */
	'url' => function (bool $absolute = false) {
		$url = '/info/team/' . $this->slug();
		if ($absolute === true) {
			$url = $this->kirby()->url() . $url;
		}
		return $url;
	},

	/**
	 * @kql-allowed
	 */
	'slug' => function () {
		return Str::slug($this->name());
	},

	/**
	 * used by
	 * (user: ) kirbytag
	 * @todo is this needed?
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

	/**
	 * @kql-allowed
	 */
	'count' => function () {
		
		$id = $this->id();
		
		$entities = $this->site()->archive()->entities();
		$entities = $entities->filter(function($item) use ($id) {
			if( str_contains( (string)$item->date_modified(), $id ) ){
				return true;
			}
		})->count();

		return $entities;

	},

	/**
	 * @kql-allowed
	 */
	'entitiesWorkedOn' => function () {
		
		$id = $this->id();
		
		$entities = $this->site()->archive()->entities();
		$entities = $entities->filter(function($item) use ($id) {
			if( str_contains( (string)$item->date_modified(), $id ) ){
				return true;
			}
		});

		$entities = $entities->sortBy(function ($child) {
			return $child->date_modified()->toObject()->modified()->toDate();
		}, 'desc');

		return $entities;

	},

	/**
	 * @kql-allowed
	 */
	'schema' => function (): array {
		$data = [
			'@context' => 'https://schema.org',
			'@type' => 'Person',
			'name' => (string)$this->name(),
			'url' => $this->url(true),
			'worksFor' => 'Centre for Documentary Architecture',
			'jobTitle' => (string)$this->profession(),
			'sameAs' => $this->links()->structureToLinks(false)
		];
		if ($this->show_email()->isTrue()) {
			$data['email'] = $this->email();
		}
		return $data;
	},

];
