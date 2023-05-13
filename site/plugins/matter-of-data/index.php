<?php

namespace Kirby\Cms;

use Kirby\Cms\App as Kirby;

load([
	'Kirby\\Cms\\DefaultBlock'            => 'extensions/blockModels/DefaultBlock.php',
	'Kirby\\Cms\\Entity'                  => 'extensions/pageModels/Entity.php',
	'Kirby\\Cms\\EntityCollection'        => 'extensions/pageModels/EntityCollection.php',
	'Kirby\\Cms\\EntityFile'              => 'extensions/pageModels/EntityFile.php',
	'Kirby\\Cms\\EntityFile3d'            => 'extensions/pageModels/EntityFile3d.php',
	'Kirby\\Cms\\EntityFileAudio'         => 'extensions/pageModels/EntityFileAudio.php',
	'Kirby\\Cms\\EntityFileImage'         => 'extensions/pageModels/EntityFileImage.php',
	'Kirby\\Cms\\EntityFileVideo'         => 'extensions/pageModels/EntityFileVideo.php',
	'Kirby\\Cms\\LieblingHouseCollection' => 'extensions/pageModels/LieblingHouseCollection.php',
	'Kirby\\Cms\\PageArchive'             => 'extensions/pageModels/PageArchive.php',
	'Kirby\\Cms\\PageArchiveImages'       => 'extensions/pageModels/PageArchiveImages.php',
], __DIR__);

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
