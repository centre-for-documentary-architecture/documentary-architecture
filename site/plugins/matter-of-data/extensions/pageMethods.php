<?php

use Kirby\Cms\File;
use Kirby\Cms\Html;
use Kirby\Data\Yaml;

return [
	
	/**
     * @kql-allowed
     */
	'adminUrl' => function (): string {
		return $this->panel()->url();
	},
	
	/**
     * @kql-allowed
     */
	'entity' => function (): string {
		// collection|item|file
		return explode('_', $this->intendedTemplate())[0];
	},

	/**
     * @kql-allowed
     */
	'category' => function (): ?string {
		// select field
		if ($this->content()->category()->isNotEmpty()) {
			return $this->content()->category()->toSlug()->value();
		}
		return null;
	},
	
	/**
     * @kql-allowed
     */
	'type' => function (): string {
		$types = explode( '_', $this->intendedTemplate() );

		if ($this->content()->category()->isNotEmpty()) {
			$types[] = $this->content()->category()->toSlug()->value();
		}

		return implode( '/', $types );
	},

	'thumbnail' => function (): ?File {

		if ($file = $this->content()->thumbnail()->toFile()) {
			return $file;
		}

		return null;
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
