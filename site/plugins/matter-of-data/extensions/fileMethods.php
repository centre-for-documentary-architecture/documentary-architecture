<?php

use Kirby\Cms\Html;
use Kirby\Cms\Page;
use Kirby\Cms\Field;
use Kirby\Data\Yaml;

return [
	'entityType' => function () {
		/*
		* returns array of all types, this page is part of
		* requires that blueprints are named like type1_type2, eg. item_building.yml
		*/
		return explode('_', $this->template());
	},
	'title' => function () {
		/*
		* returns the filename as title, making $file mor compatible to $page templates
		*/
		return $this->filename();
	},
	'filetitle' => function () {
		/*
		* returns the filename as title, making $file mor compatible to $page templates
		*/
		return wbr($this->filename());
	},
	'downloadLink' => function () {
		/*
		* creates a download link
		*/
		return Html::a($this->url(), 'Download', [
			'title' => 'Download "' . $this->filename() . '"',
			'download' => true
		]);
	},
	'isType' => function ($type) {
		/*
		* tests if this page matches the given type
		*/
		return ($type === 'file' || $type === $this->type());
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
	'alt' => function (): string {
		if ($title = $this->additional_title()->isNotEmpty()) {
			return $title;
		}
		return $this->title();
	},
	'thumbnail' => function () {
		/*
		* tests if this page matches the given type
		*/
		if ($this->content()->thumbnail()->exists() && $thumbnail = $this->content()->thumbnail()->isNotEmpty()) {
			return $thumbnail;
		} else {
			return new Field(
				$this,
				'thumbnail',
				$this->id()
			);
		}
	},
	'toImageEntity' => function () {
		return Page::factory([
			'id' => $this->id(),
			'slug' => $this->filename(),
			'template' => 'file',
			'model' => 'file_image',
			'parent' => $this->kirby()->page('archive/images'),
			'content' => $this->content()->toArray()
		]);
	},
	'responsiveImage' => function (string $srcset = 'medium', bool $lazy = null, string $alt = null) {
		if ($lazy === null) {
			$size = 80;
		} else {
			$size = 360;
		}
		return Html::img(
			$this->resize($size)->url(),
			[
				'alt' => $alt === null ? $this->alt($alt) : $alt,
				'class' => 'lazyload',
				'data-sizes' => 'auto',
				'data-src' => $this->resize(2000),
				'data-srcset' => $this->srcset($srcset),
			]
		);
	},
	'dataThumbnail' => function ($srcset = 'small') {
		return $this->responsiveImage($srcset);
	},
	'dataAbstract' => function ($srcset = 'small') {

		/*
		* only matches to images
		*/
		if ($this->type() != 'image') {
			return null;
		}

		$content = [
			'url' => $this->url(),
			'title' => $this->title(),
			'template' => 'entity',
			'worlditem' => $this->worlditem(),
			'thumbnail' => $this->dataThumbnail($srcset)
		];

		return $content;
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

];
