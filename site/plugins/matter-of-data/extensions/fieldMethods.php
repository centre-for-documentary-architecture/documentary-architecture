<?php

use Kirby\Cms\Entities;
use Kirby\Toolkit\Str;

return [

	/**
	 * convert the field value to slug
	 * @todo do we need this?
	 */
	'toSlug' => function ($field) {
		if ($field->isNotEmpty()) {
			$field->value = Str::slug( $field->value );
		}
		return $field;
	},

	/**
	 * return a value if the field value is true
	 */
	'ifTrueThen' => function ($field, $fallback) {
		if (!$field->isTrue()) {
			return null;
		}
		return $fallback;    
	},

	'toLink' => function ($field, $text = false) {
		return toLink($field->value, $text);
	},

	'toKeyword' => function ($field) {
		return toKeyword($field->value);
	},

	'toKeywords' => function ($field) {
		return toKeywords($field->value);
	},

	'toDateKeyword' => function ($field) {
		return toDateKeyword($field->value());
	},

	'toEntities' => function ($field) {
		$entities = new Entities();
		$kirby = kirby();
		foreach ($field->toData('yaml') as $link) {
			if ($page = $kirby->page($link)) {
				// this is a page
				$entities->add($page);
			} else if ($image = $kirby->file($link)) {
				// this is a file
				$entities->add($image->toImageEntity());
			}
		}
		return $entities;
	},

	'toEntity' => function ($field) {
		return $field->toEntities()->first();
	},

	'structureToLinks' => function ($field, bool $includeTitle = true ) {

		$links = [];
		foreach( $field->toStructure() as $row ){
			if( $includeTitle ){
				$links[] = [
					'href' => (string)$row->href(),
					'title' => $row->title()->isNotEmpty() ? (string)$row->title() : parse_url($row->href())['host']
				];
			} else {
				$links[] = (string)$row->href();
			}
		}

		return $links;
	},
	
];
