<?php

namespace Kirby\Cms;

use Kirby\Cms\App as Kirby;

require_once __DIR__ . '/extensions/blockModels/DefaultBlock.php';
require_once __DIR__ . '/extensions/pageModels/Entity.php';
require_once __DIR__ . '/extensions/pageModels/EntityCollection.php';
require_once __DIR__ . '/extensions/pageModels/EntityFile.php';
require_once __DIR__ . '/extensions/pageModels/EntityFile3d.php';
require_once __DIR__ . '/extensions/pageModels/EntityFileAudio.php';
require_once __DIR__ . '/extensions/pageModels/EntityFileImage.php';
require_once __DIR__ . '/extensions/pageModels/EntityFileVideo.php';
require_once __DIR__ . '/extensions/pageModels/LieblingHouseCollection.php';
require_once __DIR__ . '/extensions/pageModels/PageArchive.php';
require_once __DIR__ . '/extensions/pageModels/PageArchiveImages.php';

require_once __DIR__ . '/functions/helpers.php';
require_once __DIR__ . '/functions/anchors.php';

Kirby::plugin('cda/matter-of-data', [

	'pageModels'   => [
		'archive'            => 'Kirby\Cms\PageArchive',
		'collection'		 => 'Kirby\Cms\EntityCollection',
		'collection_liebling-house' => 'Kirby\Cms\LieblingHouseCollection',

		'items'              => 'Kirby\Cms\PageArchive',
		'items_building'     => 'Kirby\Cms\PageArchive',
		'items_material'     => 'Kirby\Cms\PageArchive',
		'items_object'       => 'Kirby\Cms\PageArchive',
		'items_organisation' => 'Kirby\Cms\PageArchive',
		'items_person'       => 'Kirby\Cms\PageArchive',
		'items_publication'  => 'Kirby\Cms\PageArchive',
		'files'              => 'Kirby\Cms\PageArchive',
		'files_3d'           => 'Kirby\Cms\PageArchive',
		'files_audio'        => 'Kirby\Cms\PageArchive',
		'files_video'        => 'Kirby\Cms\PageArchive',
		'files_image'        => 'Kirby\Cms\PageArchiveImages',

		'item'               => 'Kirby\Cms\Entity',
		'item_building'      => 'Kirby\Cms\Entity',
		'item_material'      => 'Kirby\Cms\Entity',
		'item_object'        => 'Kirby\Cms\Entity',
		'item_organisation'  => 'Kirby\Cms\Entity',
		'item_person'        => 'Kirby\Cms\Entity',
		'item_event'         => 'Kirby\Cms\Entity',
		'item_publication'   => 'Kirby\Cms\Entity',
		'file'               => 'Kirby\Cms\EntityFile',
		'file_3d'            => 'Kirby\Cms\EntityFile3d',
		'file_audio'         => 'Kirby\Cms\EntityFileAudio',
		'file_video'         => 'Kirby\Cms\EntityFileVideo',
		'file_image'         => 'Kirby\Cms\EntityFileImage',
	],

	// @todo extend similar blueprints programmatically

	'siteMethods'  => require_once __DIR__ . '/extensions/siteMethods.php',
	'pageMethods'  => require_once __DIR__ . '/extensions/pageMethods.php',
	'fileMethods'  => require_once __DIR__ . '/extensions/fileMethods.php',

	'userMethods'  => require_once __DIR__ . '/extensions/userMethods.php',
	'usersMethods' => require_once __DIR__ . '/extensions/usersMethods.php',

	'tags' 		   => require_once __DIR__ . '/extensions/kirbytags.php',
	'fields'       => require_once __DIR__ . '/extensions/fields.php',
	'fieldMethods' => require_once __DIR__ . '/extensions/fieldMethods.php',

	'blockModels' => [
		'Kirby\\Cms\\Block' => DefaultBlock::class,
	],

	'hooks' 	   => require_once __DIR__ . '/extensions/hooks.php',

]);
