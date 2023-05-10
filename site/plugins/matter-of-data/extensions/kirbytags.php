<?php

use Kirby\Toolkit\Str;
use Kirby\Toolkit\Html;

return [

	/**
	 * custom kirbytag (tag: Tel Aviv) that creates an archive query
	 */
	'tag' => [
		'attr' => [],
		'html' => function ($tag) {
			return toKeyword($tag->value);
		}
	],

	/**
	 * alias of tag
	 */
	'keyword' => [
		'attr' => [],
		'html' => function ($tag) {
			return toKeyword($tag->value);
		}
	],

	/**
	 * overriding (date: YYYY-MM-DD) that creates 3 query links
	 */
	'date' => [
		'attr' => [],
		'html' => function ($tag) {
			return toDateKeyword($tag->date);
		}
	],

	'link' => [
		'attr' => [
			'class',
			'lang',
			'rel',
			'role',
			'target',
			'title',
			'text',
		],
		'html' => function ($tag) {

			// check if external link
			if ($domain = parse_url($tag->value)) {

				if (isset($domain['host'])) {

					if (empty($tag->text)) {
						$tag->text = $domain['host'];
					}

					return toLink($tag->value, $tag->text);
				}
			}

			// check if page exists internally
			if ($page = kirby()->page($tag->value)) {

				// take title as link text
				if (empty($tag->text)) {
					$tag->text = $page->title();
				}

				return Html::a($tag->value, $tag->text, [
					'title'  => 'Go to "' . $tag->text . '"'
				]);
			}

			return toKeyword($tag->value, $tag->text);
		}
	],

	/**
	 * (user: Moritz Ebeling)
	 * creates link to user profile
	 */
	'user' => [
		'attr' => [],
		'html' => function ($tag) {
			if( $user = kirby()->users()->findBySlug( Str::slug($tag->user) ) ){
				return $user->toLink();
			}
			return $tag->user;
		}
	],

];
