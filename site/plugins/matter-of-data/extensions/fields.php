<?php

use Kirby\Data\Yaml;

return [

	'entities' => [
		/*
		* a field that should list all pages (and virtual pages made from images)
		*/
		'extends' => 'pages',
		'methods' => [
			'toPages' => function ($value = null) {
				$pages = [];
				$kirby = kirby();

				foreach (Yaml::decode($value) as $id) {
					if (is_array($id) === true) {
						$id = $id['id'] ?? null;
					}

					if ($id !== null) {
						if ($page = $kirby->page($id)) {
							// this page exists
							$pages[] = $this->pageResponse($page);
						} else if ($image = $kirby->file($id)) {
							// this is a file
							$pages[] = $this->pageResponse($image);
						}
					}
				}

				return $pages;
			}
		]

	],

];
