<?php

/*
* fileMethods
* https://getkirby.com/docs/reference/plugins/extensions/file-methods
*/

return [
	'entityType' => function(){
		/*
		* returns array of all types, this page is part of
		* requires that blueprints are named like type1_type2, eg. item_building.yml
		*/
		return explode( '_', $this->template() );
	},
	'title' => function(){
		/*
		* returns the filename as title, making $file mor compatible to $page templates
		*/
		return $this->filename();
	},
	'filetitle' => function(){
		/*
		* returns the filename as title, making $file mor compatible to $page templates
		*/
		return preg_replace('/[-_.]/', '<wbr>$0', $this->filename());
	},
	'downloadLink' => function(){
		/*
		* creates a download link
		*/
		return Html::a( $this->url(), 'Download', [
			'title' => 'Download "'.$this->filename().'"',
			'download' => true
		]);
	},
	'isType' => function( $type ){
		/*
		* tests if this page matches the given type
		*/
		return ( $type === 'file' || $type === $this->type() );
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
	'thumbnail' => function(){
		/*
		* tests if this page matches the given type
		*/
		if( $this->content()->thumbnail()->exists() && $thumbnail = $this->content()->thumbnail()->isNotEmpty() ){
			return $thumbnail;
		} else {
			return new Field(
				$this, 'thumbnail', $this->id()
			);
		}
	},
	'toImageEntity' => function(){
		return Page::factory([
			'id' => $this->id(),
			'slug' => $this->filename(),
			'template' => 'file',
			'model' => 'file_image',
			'parent' => $this->kirby()->page('archive/images'),
			'content' => $this->content()->toArray()
		]);
	},
	'responsiveImage' => function( $srcset = 'medium', $alt = 'CDA' ){
		return Html::img(
			$this->thumb(['width' => 80])->url(),
			[
				'alt' => $alt,
				'class' => 'lazyload',
				'data-sizes' => 'auto',
				'data-src' => $this->url(),
				'data-srcset' => $this->srcset( $srcset ),
			]
		);
	},
	'dataThumbnail' => function( $srcset = 'small' ){
		return $this->responsiveImage( $srcset );
	},
	'dataAbstract' => function( $srcset = 'small' ){

		/*
		* only matches to images
		*/
		if( $this->type() != 'image' ){
			return null;
		}

		$content = [
			'url' => $this->url(),
			'title' => $this->title(),
			'template' => 'entity',
			'worlditem' => $this->worlditem(),
			'thumbnail' => $this->dataThumbnail( $srcset )
		];

		return $content;

	},

];
