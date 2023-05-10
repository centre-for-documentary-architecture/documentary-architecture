<?php

use Kirby\Cms\Entities;

return [

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

];
