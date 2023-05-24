<?php

use Kirby\Cms\Html;
use Kirby\Data\Yaml;

return [

	/**
	 * @kql-allowed
	 */
	'kqlAbstract' => function () {
		if( $image = $this->image() ){
			$image = $image->kqlAbstract();
		}
		return [
			'id' => $this->id(),
			'title' => (string)$this->title(),
			'url' => $this->url(),
			'count' => $this->count(),
			'image' => $image ?? false,
		];
	},
	
	/**
     * @kql-allowed
     */
	'adminUrl' => function (): string {
		return $this->panel()->url();
	},
	
	/**
     * @kql-allowed
     */
	'view' => function () {
		return false;
	},
	
	/**
     * @kql-allowed
	 * collection|item|file
     */
	'entity' => function (): string {
		return $this->intendedTemplate();
	},
	
	/**
     * @kql-allowed
	 * 3d|audio|image|video|building|event|material|object|organisation|person|publication
     */
	'type' => function (): string {
		return $this->intendedTemplate();
	},

	/**
     * @kql-allowed
     */
	'count' => function() {
	
        $count = $this->children()->count()
            + $this->contextualized()->toEntities()->count()
            + $this->contexts()->toEntities()->count();

		return $count ?? 1;
	},

	'schema' => function (): array {

		$breadcrumbs = [];
		$i = 1;
		foreach ($this->parents()->flip() as $parent) {
			$breadcrumbs[] = [
				'@type' => 'ListItem',
				'position' => $i,
				'item' => [
					'@id' => $parent->url(),
					'name' => (string)$parent->title(),
					'url' => $parent->url()
				],
			];
			$i++;
		}
		$breadcrumbs = $i > 1 ? [
			'@context' => 'https://schema.org',
			'@type' => 'BreadcrumbList',
			'itemListElement' => $breadcrumbs
		] : null;

		return [
			'@context' => 'https://schema.org',
			'@type' => 'WebPage',
			'@id' => $this->url(),
			'breadcrumb' => $breadcrumbs,
			'inLanguage' => 'en',
			'name' => (string)$this->title(),
			'publisher' => [
				'@id' => $this->site()->url(),
			]
		];
	},

	'updateDateModified' => function ( bool $created = false, bool $return = false ){
		
		$modified = Yaml::decode( $this->date_modified()->value() );

		$modified['modified']    = date('Y-m-d H:i');
		$modified['modified_by'] = (string)$this->kirby()->user()->uuid();

		if ( $created === true ) {
			$modified['created']    = $modified['modified'];
			$modified['created_by'] = $modified['modified_by'];
		}

		if( $return === true ){
			return $modified;
		}

		$this->update([
			'date_modified' => Yaml::encode($modified)
		]);
	},

	/**
	 * creates a link to this page
	 * @todo is this used?
	 */
	'toLink' => function ($text = false) {
		return Html::a(
			$this->url(),
			$text ? $text : $this->title(),
			[
				'title' => 'Go to "' . $this->title() . '"'
			]
		);
	},

];
