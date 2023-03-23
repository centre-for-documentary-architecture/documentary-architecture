<?php

/*
* tags
* https://getkirby.com/docs/reference/plugins/extensions/kirbytags
*/

return [
	'tag' => [
		/*
		* custom kirbytag (tag: Tel Aviv) that creates an archive query
		*/
		'attr' => [],
		'html' => function ($tag) {
			return toKeyword($tag->value);
		}
	],
	'keyword' => [
		/*
		* alias of tag
		*/
		'attr' => [],
		'html' => function ($tag) {
			return toKeyword($tag->value);
		}
	],
	'date' => [
		/*
		* overriding (date: YYYY-MM-DD) that creates 3 query links
		*/
		'attr' => [],
		'html' => function ($tag) {
			return toDateKeyword($tag->date);
		}
	],
	'location' => [
		/*
		* custom kirbytag (location: Tel Aviv, country: IL) that opens several archive queries
		*/
		'attr' => [
			'street', 'zip', 'city', 'country', 'lat', 'lon'
		],
		'html' => function ($tag) {
			return toLocation([
				'title' => $tag->value,
				'streetaddress' => $tag->street,
				'postalcode' => $tag->zip,
				'addresslocality' => $tag->city,
				'addresscountry' => $tag->country,
				'lat' => $tag->lat,
				'lon' => $tag->lon
			]);
		}
	],
	/**
	 * Link
	 */
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
	'user' => [
		/*
		* custom kirbytag (user: Moritz Ebeling) that creates a link to that user profile
		*/
		'attr' => [],
		'html' => function ($tag) {

			return toKeyword($tag->value);
		}
	],
	'source' => [
		'attr' => [
			'author', 'date', 'publisher', 'website', 'country'
		],
		'html' => function ($tag) {

			if ($page = kirby()->page($tag->value)) {
				$tag->value = $page->title();
				$tag->website = $page->url();
			}

			return toSource([
				'title' => $tag->value,
				'author' => $tag->author,
				'date' => $tag->date,
				'publisher' => $tag->publisher,
				'website' => $tag->website,
				'country' => $tag->country
			]);
		}
	],
];
