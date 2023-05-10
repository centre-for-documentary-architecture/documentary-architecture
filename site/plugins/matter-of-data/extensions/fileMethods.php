<?php

use Kirby\Cms\Html;
use Kirby\Cms\Page;
use Kirby\Cms\Field;
use Kirby\Data\Yaml;
use Kirby\Filesystem\F;
use Kirby\Toolkit\Str;

return [

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

	'alt' => function (): string {
		if ($title = $this->additional_title()->isNotEmpty()) {
			return $title;
		}
		return $this->title();
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

	/**
     * @kql-allowed
	 * returns the filename as title, making $file mor compatible to $page templates
     */
	'title' => function () {
		return $this->filename();
	},

	/**
     * @kql-allowed
     */
	'image' => function () {
		return $this;
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
	
	'extractDateFromFilenameOrExif' => function ( $filename = null ){

		$filename = $filename ?? Str::slug( F::name( $this->filename() ) );

		$pattern = "/(?!\D)((1[5-9]|20)[0-9](0s|[0-9]((-(0[1-9]|1[012]))(-(0[1-9]|[12][0-9]|3[01]))?)?))(?=\D)/";
		
		preg_match($pattern, $filename, $matches);
		if (isset($matches[0])) {
			return $matches[0];
		}
		
		$exif = $this->exif();
		
		if ($timestamp = $exif->timestamp()) {
			return date('Y-m-d', $timestamp);
		}

		return null;
		
	},

];
