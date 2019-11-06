<?php

use Kirby\Cms\PluginAssets;

/**
* matter-of-data plugin
*/

// import functions
require_once __DIR__.'/functions/helpers.php';
require_once __DIR__.'/functions/anchors.php';
require_once __DIR__.'/functions/formats.php';
require_once __DIR__.'/functions/searchReplaceFields.php';

// import models
require_once __DIR__.'/extensions/pageModels/page.php';
require_once __DIR__.'/extensions/pageModels/entity.php';
require_once __DIR__.'/extensions/pageModels/entityCollection.php';
require_once __DIR__.'/extensions/pageModels/entityItem.php';
require_once __DIR__.'/extensions/pageModels/entityFile.php';

Kirby::plugin('centre-for-documentary-architecture/matter-of-data', [

	'options' => [
		'pagination' => 40,
		'space' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/',
		// alias as placeholder
		'cdn' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/',
		// tru edge cdn address:
		// 'cdn' => 'https://documentary-architecture.fra1.cdn.digitaloceanspaces.com/cda/',
	],

	'routes' => [
        [
			'pattern' => 'archive/images/(:any)',
			'action'  => function ( $any ) {
				return kirby()->file('archive/images/'.$any)->toImageEntity();
			}
		],
		[
            'pattern' => 'team/(:any)',
            'action'  => function ( $any ) {

				$user = kirby()->users()->filter(function($user) use ($any){
					return Str::slug( $user->name() ) === $any;
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
		],
		[
            'pattern' => 'media/plugins/(:any)/(:any)/(:all).(json|map|unityweb)',
            'env'     => 'media',
            'action'  => function (string $provider, string $pluginName, string $filename, string $extension) {
                return PluginAssets::resolve($provider . '/' . $pluginName, $filename . '.' . $extension);
            }
        ],
	],

	'components' => [
		'file::url' => function (Kirby $kirby, $file) {
            if( $file->type() === 'video' ){
                return $kirby->url() . '/content/' . $file->parent()->diruri() . '/' . $file->filename();
            } else {
                return $file->mediaUrl();
            }
		}
	],

	'pageModels'   => [

		// archive
		'items'              => 'PageArchive',
		'items_document'     => 'PageArchive',
		'items_landmark'     => 'PageArchive',
		'items_material'     => 'PageArchive',
		'items_object'       => 'PageArchive',
		'items_organisation' => 'PageArchive',
		'items_person'       => 'PageArchive',
		'items_publication'  => 'PageArchive',

		'archive'            => 'PageArchive',
		'files'              => 'PageArchive',
		'files_3d'           => 'PageArchive',
		'files_audio'        => 'PageArchive',
		'files_video'        => 'PageArchive',
		'files_image'        => 'PageArchiveImages',

		'author'             => 'PageArchive',

		// entity

		// collection
		'collection'		 => 'EntityCollection',
		'collection_liebling-house' => 'LieblingHouseCollection',

		// item
		'item'               => 'EntityItem',
		'item_document'      => 'EntityItem',
		'item_landmark'      => 'EntityItemLandmark',
		'item_material'      => 'EntityItemMaterial',
		'item_object'        => 'EntityItemObject',
		'item_organisation'  => 'EntityItemOrganisation',
		'item_person'        => 'EntityItemPerson',
		'item_event'         => 'EntityItemEvent',
		'item_publication'   => 'EntityItemPublication',

		// file
		'file'               => 'EntityFile',
		'file_3d'            => 'EntityFile3d',
		'file_audio'         => 'EntityFileAudio',
		'file_video'         => 'EntityFileVideo',
		'file_image'         => 'EntityFileImage',

		'item_source'        => 'EntitySource',

		'home' => 'HomePage'

	],
	'pageMethods'  => require_once __DIR__.'/extensions/pageMethods.php',
	'pagesMethods' => require_once __DIR__.'/extensions/pagesMethods.php',

	'siteMethods'  => require_once __DIR__.'/extensions/siteMethods.php',

	'fileMethods' =>  require_once __DIR__.'/extensions/fileMethods.php',
	'userMethods' =>  require_once __DIR__.'/extensions/userMethods.php',

	'fields'       => require_once __DIR__.'/extensions/fields.php',
	'fieldMethods' => require_once __DIR__.'/extensions/fieldMethods.php',

	'controllers'  => require_once __DIR__.'/extensions/controllers.php',
	'hooks' 	   => require_once __DIR__.'/extensions/hooks.php',
	'tags' 		   => require_once __DIR__.'/extensions/tags.php',

]);
