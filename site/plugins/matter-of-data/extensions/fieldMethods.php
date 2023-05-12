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
	
	'toLocation' => function ($field ) {
		if( $field->isEmpty() ){
			return false;
		}

		$object = $field->toObject();

		// inherit
		if( $inherit = $object->inherit()->toPage() ){
			return $inherit->location()->toLocation();
		}

		// get from locator field
		$location = $object->location()->toObject();

		// override
		if( $object->address()->isNotEmpty() ){
			$location->update([
				'address' => $object->address()->value()
			]);
		}
		if( $object->city()->isNotEmpty() ){
			$location->update([
				'city' => $object->city()->value()
			]);
		}
		if( $location->number()->isNotEmpty() && $location->address()->isNotEmpty() ){
			$address = (string)$location->address();
			$pattern = '/\b' . preg_quote((string)$location->number(), '/') . '\b$/';
			if (preg_match($pattern, $address)) {
				$location->update([
					'address' => trim(preg_replace($pattern, '', $address))
				]);
			}
		}

		if( $location->lat()->isEmpty() ){
			if( $location->country()->isEmpty() ){
				return false;
			}
		}

		return $location->toArray();
	},
	
	'toTimeline' => function ($field ) {
		if( $field->isEmpty() ){
			return false;
		}

		$timeline = [];
		foreach( $field->toStructure() as $item ){
			$timeline[] = [
				'title' => (string)$item->title(),
				'text' => (string)$item->text()->kirbytext(),
				'date' => (string)$item->date(),
				'location' => $item->location()->toLocation(),
			];
		}

		return $timeline;
	},
	
	'tagsToUsers' => function ($field ) {
		$users = [];
		foreach( $field->split() as $item ){
			if( $user = kirby()->users()->findBySlug( Str::slug( $item ) ) ){
				$users[] = [
					'name' => (string)$user->name(),
					'url' => $user->url(),
				];
			} else {
				$users[] = [
					'name' => $item,
					'url' => false,
				];
			}
		}
		return $users;
	},

	'tagsToEntities' => function ($field ) {
		$kirby = kirby();
		$items = [];
		foreach( $field->split() as $item ){

			if ($page = $kirby->page($item)) {
				$items[] = $page->kqlAbstract();
			} else if ($image = $kirby->file($item)) {
				$items[] = $image->kqlAbstract();
			} else {
				$items[] = [
					'title' => $item,
				];
			}
		}
		return $items;
	},
	
	'toCredits' => function ($field ) {
		if( $field->isEmpty() ){
			return false;
		}

		$credits = [];
		foreach( $field->toStructure() as $item ){

			$people = $item->person()->tagsToUsers();

			$credits[] = [
				'role' => (string)$item->title(),
				'people' => $people,
			];
		}

		return $credits;
	},
	
];
