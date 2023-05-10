<?php

namespace Kirby\Cms;
use Kirby\Cms\App as Kirby;

require_once __DIR__ . '/functions/helpers.php';
require_once __DIR__ . '/functions/anchors.php';

class HomePage extends Page {}

require_once __DIR__ . '/extensions/pageModels/archive.php';
require_once __DIR__ . '/extensions/pageModels/entity.php';
require_once __DIR__ . '/extensions/pageModels/entityCollection.php';
require_once __DIR__ . '/extensions/pageModels/entityItem.php';
require_once __DIR__ . '/extensions/pageModels/entityFile.php';

Kirby::plugin('cda/matter-of-data', [

	'pageModels'   => [

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

		'collection'		 => 'Kirby\Cms\EntityCollection',
		'collection_liebling-house' => 'Kirby\Cms\LieblingHouseCollection',

		'item'               => 'Kirby\Cms\EntityItem',
		'item_building'      => 'Kirby\Cms\EntityItemBuilding',
		'item_material'      => 'Kirby\Cms\EntityItemMaterial',
		'item_object'        => 'Kirby\Cms\EntityItemObject',
		'item_organisation'  => 'Kirby\Cms\EntityItemOrganisation',
		'item_person'        => 'Kirby\Cms\EntityItemPerson',
		'item_event'         => 'Kirby\Cms\EntityItemEvent',
		'item_publication'   => 'Kirby\Cms\EntityItemPublication',

		'file'               => 'Kirby\Cms\EntityFile',
		'file_3d'            => 'Kirby\Cms\EntityFile3d',
		'file_audio'         => 'Kirby\Cms\EntityFileAudio',
		'file_video'         => 'Kirby\Cms\EntityFileVideo',
		'file_image'         => 'Kirby\Cms\EntityFileImage',

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
	'tags' 		   => require_once __DIR__ . '/extensions/kirbytags.php',

]);
