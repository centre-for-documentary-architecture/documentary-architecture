<?php

use Kirby\Cms\Field;
use Kirby\Cms\File;
use Kirby\Cms\Html;
use Kirby\Data\Yaml;

return [
	
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




	'classlist' => function (): string {
		return $this->entity() . ' ' . $this->type();
	},
	'theme' => function (): string {
		return 'black';
	},
	'layout' => function (): string {
		return 'regular';
	},

	/*
	* generic fields all pages should have
	*/
	'keywords' => function (string $fallback = ''): Field {

		if ($this->content()->keywords()->isNotEmpty()) {

			return $this->content()->keywords();
		}

		return new Field($this, 'keywords', $fallback);
	},
	'description' => function (string $fallback = ''): Field {

		if ($this->content()->description()->isNotEmpty()) {

			return $this->content()->description();
		}

		return new Field($this, 'description', $fallback);
	},
	'thumbnail' => function (): ?File {

		if ($file = $this->content()->thumbnail()->toFile()) {
			return $file;
		}

		return null;
	},
	
	'entityInfo' => function (): string {

		return '';
	},

	/*
	* general data representations on the current page
	*/
	'dataAbstract' => function (string $srcset = 'medium') {

		$data = [
			'url' => $this->url(),
			'title' => $this->title()->value(),
			'template' => $this->template()->name(),
			'classlist' => $this->classlist(),
			'worlditem' => $this->worlditem(),
			'count' => $this->countCollection(),
			'info' => $this->entityInfo(),
			'keywords' => $this->research_methods()->split(),
		];

		if ($srcset && $thumbnail = $this->thumbnail()) {
			$data['thumbnail'] = $this->thumbnail()->dataThumbnail($srcset);
		}

		return $data;
	},
	'dataGeneral' => function (): array {
		$data = [
			'url' => $this->url(),
			'id' => $this->id(),
			'entity' => $this->entity(),
			'type' => $this->type(),
			'category' => $this->category(),

			'title' => $this->title()->value(),
			'keywords' => $this->research_methods()->split(),
			'description' => $this->description()->value(),

			'theme' => $this->theme(),
			'layout' => $this->layout(),
			'template' => $this->template()->name(),
			'worlditem' => $this->worlditem(),
		];
		if ($thumbnail = $this->thumbnail()) {
			$data['thumbnail'] = $this->thumbnail()->dataThumbnail('medium');
		}
		return $data;
	},
	'dataSet' => function (): array {
		/*
		* this shall be overridden by pageModels to include individual sets of information
		*/
		return $this->dataGeneral();
	},
	'dataBreadcrumbs' => function (): array {
		// get all parents and flip the order
		$crumbs = $this->parents()->flip();

		// add the home page
		$crumbs->prepend($this->site()->homePage());

		$crumbs->add($this);

		return $crumbs->dataAbstract(false);
	},
	'collection' => function () {

		if ($this->hasChildren()) {

			return $this->children()->listed();
		}
		return [];
	},
	'worlditem' => function (): ?string {
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

	/*
	new
	*/

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

	/*
	* legacy
	*/

	'isType' => function ($type) {
		/*
		* tests if this page matches the given type
		*/
		return in_array($type, explode('_', $this->intendedTemplate()));
	},
	'toLink' => function ($text = false) {
		/*
		* creates a link to this page
		*/
		return Html::a(
			$this->url(),
			$text ? $text : $this->title(),
			$attr = [
				'title' => 'Go to "' . $this->title() . '"'
			]
		);
	},
	'filetitle' => function () {
		/*
		* inserts word break hints <wbr> into filenames
		*/
		return wbr($this->title());
	},
];
