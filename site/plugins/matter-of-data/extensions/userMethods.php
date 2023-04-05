<?php

use Kirby\Cms\Html;
use Kirby\Toolkit\Str;

return [
	'toLink' => function ($text = false) {
		return toKeyword($this->name());
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
	'title' => function () {
		return $this->name();
	},
	'slug' => function () {
		return Str::slug($this->name());
	},
	'url' => function () {
		return 'team/' . Str::slug($this->name());
	},
	'entityType' => function () {
		return ['user'];
	},
];
