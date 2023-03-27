<?php

use Kirby\Cms\App as Kirby;

// import functions
require_once __DIR__ . '/functions/helpers.php';
require_once __DIR__ . '/functions/anchors.php';
require_once __DIR__ . '/functions/formats.php';
require_once __DIR__ . '/functions/searchReplaceFields.php';

// import models
require_once __DIR__ . '/extensions/pageModels/page.php';
require_once __DIR__ . '/extensions/pageModels/archive.php';
require_once __DIR__ . '/extensions/pageModels/entity.php';
require_once __DIR__ . '/extensions/pageModels/entityCollection.php';
require_once __DIR__ . '/extensions/pageModels/entityItem.php';
require_once __DIR__ . '/extensions/pageModels/entityFile.php';

function flushCache($id, $cache = true)
{
	$kirby = kirby();
	if ($cache === true) {
		$kirby->cache('cda.get')->remove($id);
		return;
	}
	$kirby->cache($cache)->remove($id);
}

Kirby::plugin('cda/matter-of-data', [

	'options' => [
		'pagination' => 40,
	],

	'routes' => [
		[
			'pattern' => 'archive/images/(:any)',
			'action'  => function ($any) {
				return kirby()->file('archive/images/' . $any)->toImageEntity();
			}
		],
		[
			'pattern' => 'team/(:any)',
			'action'  => function ($any) {

				$user = kirby()->users()->filter(function ($user) use ($any) {
					return Str::slug($user->name()) === $any;
				})->first();

				$content = $user->content()->toArray();
				$content['user'] = $user;
				return Page::factory([
					'slug' => $any,
					'template' => 'archive',
					'model' => 'author',
					'content' => $content,
					'query' => $any
				]);
			}
		]
	],

	'components' => [
		'file::url' => function (Kirby $kirby, $file) {
			if ($file->type() === 'video') {
				return $kirby->url() . '/content/' . $file->parent()->diruri() . '/' . $file->filename();
			} else {
				return $file->mediaUrl();
			}
		}
	],

	'pageModels'   => [

		// archive
		'archive'            => 'Kirby\Cms\PageArchive',

		'items'              => 'Kirby\Cms\PageArchiveFilter',
		'items_building'     => 'Kirby\Cms\PageArchiveFilter',
		'items_material'     => 'Kirby\Cms\PageArchiveFilter',
		'items_object'       => 'Kirby\Cms\PageArchiveFilter',
		'items_organisation' => 'Kirby\Cms\PageArchiveFilter',
		'items_person'       => 'Kirby\Cms\PageArchiveFilter',
		'items_publication'  => 'Kirby\Cms\PageArchiveFilter',

		'files'              => 'Kirby\Cms\PageArchiveFilter',
		'files_3d'           => 'Kirby\Cms\PageArchiveFilter',
		'files_audio'        => 'Kirby\Cms\PageArchiveFilter',
		'files_video'        => 'Kirby\Cms\PageArchiveFilter',
		'files_image'        => 'Kirby\Cms\PageArchiveImages',

		'author'             => 'Kirby\Cms\PageArchiveFilter',

		// entity

		// collection
		'collection'		 => 'Kirby\Cms\EntityCollection',
		'collection_liebling-house' => 'Kirby\Cms\LieblingHouseCollection',

		// item
		'item'               => 'Kirby\Cms\EntityItem',
		'item_building'      => 'Kirby\Cms\EntityItemBuilding',
		'item_material'      => 'Kirby\Cms\EntityItemMaterial',
		'item_object'        => 'Kirby\Cms\EntityItemObject',
		'item_organisation'  => 'Kirby\Cms\EntityItemOrganisation',
		'item_person'        => 'Kirby\Cms\EntityItemPerson',
		'item_event'         => 'Kirby\Cms\EntityItemEvent',
		'item_publication'   => 'Kirby\Cms\EntityItemPublication',

		// file
		'file'               => 'Kirby\Cms\EntityFile',
		'file_3d'            => 'Kirby\Cms\EntityFile3d',
		'file_audio'         => 'Kirby\Cms\EntityFileAudio',
		'file_video'         => 'Kirby\Cms\EntityFileVideo',
		'file_image'         => 'Kirby\Cms\EntityFileImage',

		'item_source'        => 'Kirby\Cms\EntitySource',

		'home' => 'Kirby\Cms\HomePage'

	],
	'pageMethods'  => require_once __DIR__ . '/extensions/pageMethods.php',
	'pagesMethods' => require_once __DIR__ . '/extensions/pagesMethods.php',

	'siteMethods'  => require_once __DIR__ . '/extensions/siteMethods.php',

	'fileMethods' =>  require_once __DIR__ . '/extensions/fileMethods.php',
	'userMethods' =>  require_once __DIR__ . '/extensions/userMethods.php',

	'fields'       => require_once __DIR__ . '/extensions/fields.php',
	'fieldMethods' => require_once __DIR__ . '/extensions/fieldMethods.php',

	'hooks' 	   => require_once __DIR__ . '/extensions/hooks.php',
	'tags' 		   => require_once __DIR__ . '/extensions/tags.php',

]);
