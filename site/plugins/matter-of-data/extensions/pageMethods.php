<?php

/*
* pageMethods
* https://getkirby.com/docs/reference/plugins/extensions/page-methods
*/

return [

	/*
	* general information about this page
	*/
	'entity' => function(): string
	{
		// collection|item|file
		return explode( '_', $this->intendedTemplate() )[0];

	},
	'type' => function(): string
	{
		// image|video|building|liebling-house
		$e = explode( '_', $this->intendedTemplate() );
		return end( $e );

	},
	'classlist' => function(): string
	{
		return $this->entity().' '.$this->type();
	},
	'category' => function(): ?string
	{
		// select field
		if( $this->content()->category()->exists() && $this->content()->category()->isNotEmpty() ){

			return $this->content()->category()->toSlug()->value();

		}
		return null;

	},
	'theme' => function(): string
	{

		return 'black';

	},
	'layout' => function(): string
	{

		return 'regular';

	},

	/*
	* generic fields all pages should have
	*/
	'keywords' => function( string $fallback = '' ): Kirby\Cms\Field
	{

		if( $this->content()->keywords()->exists() && $this->content()->keywords()->isNotEmpty() ){

			return $this->content()->keywords();

		}

		return new Field( $this, 'keywords', $fallback );

	},
	'description' => function( string $fallback = '' ): Kirby\Cms\Field
	{

		if( $this->content()->description()->exists() && $this->content()->description()->isNotEmpty() ){

			return $this->content()->description();

		}

		return new Field( $this, 'description', $fallback );

	},
	'thumbnail' => function(): ?Kirby\Cms\File
	{

		if( $file = $this->content()->thumbnail()->toFile() ){

			return $file;

		}

		return null;

	},
	'countCollection' => function(): int
	{

		if( $c = $this->collection() ){

			return $c->count();

		}
		return 0;

	},

	/*
	* general data representations on the current page
	*/
	'dataAbstract' => function( string $srcset = 'medium', $count = null, $flush = false ){

		$id = $this->id();
		$cache = $this->kirby()->cache('dataAbstract');
		$data  = $cache->get( $id );

		if ($data === null) {

			$data = [
				'url' => $this->url(),
				'title' => $this->title()->value(),
				'template' => $this->template()->name(),
				'classlist' => $this->classlist(),
				'worlditem' => $this->worlditem(),
				'count' => $this->countCollection(),
			];

			if( $srcset && $thumbnail = $this->thumbnail() ){
				$data['thumbnail'] = $this->thumbnail()->dataThumbnail( $srcset );
			}

			$cache->set($id, $data, option('centre-for-documentary-architecture.matter-of-data.expires') );

		}

		return $data;

	},
	'dataGeneral' => function(): array
	{

		return [
			'url' => $this->url(),
			'id' => $this->id(),
			'entity' => $this->entity(),
			'type' => $this->type(),
			'category' => $this->category(),

			'title' => $this->title()->value(),
			'keywords' => $this->keywords()->split(),
			'description' => $this->description()->value(),

			'theme' => $this->theme(),
			'layout' => $this->layout(),
			'template' => $this->template()->name(),
			'worlditem' => $this->worlditem(),
			'breadcrumbs' => $this->dataBreadcrumbs()
		];

	},
	'dataSet' => function(): array
	{
		/*
		* this shall be overridden by pageModels to include individual sets of information
		*/
		return $this->dataGeneral();

	},
	'dataBreadcrumbs' => function(): array
	{
		// get all parents and flip the order
		$crumbs = $this->parents()->flip();

        // add the home page
		$crumbs->prepend( $this->site()->homePage() );

		$crumbs->add( $this );

		return $crumbs->dataAbstract( false );
	},
	'collection' => function()
	{

		if( $this->hasChildren() ){

            return $this->children()->listed();

		}
		return [];

	},
	'worlditem' => function(): ?string
	{
		return null;
	},


	/*
	* legacy
	*/


	'entityType' => function(){
		/*
		* returns array of all types, this page is part of
		* requires that blueprints are named like type1_type2, eg. item_building.yml
		*/
		return explode( '_', $this->intendedTemplate() );
	},
	'isType' => function( $type ){
		/*
		* tests if this page matches the given type
		*/
		return in_array( $type, explode( '_', $this->intendedTemplate() ));
	},
	'toLink' => function( $text = false ){
		/*
		* creates a link to this page
		*/
		return Html::a(
			$this->url(),
			$text ? $text : $this->title(),
			$attr = [
				'title' => 'Go to "'.$this->title().'"'
		]);
	},
	'filetitle' => function(){
		/*
		* inserts word break hints <wbr> into filenames
		*/
		return wbr( $this->title() );
	},
];
