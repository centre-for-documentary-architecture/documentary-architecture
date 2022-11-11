<?php

/**
 * liebling-house 3d world
 *
 * is called a_liebling-hosue to be loaded before the frontend plugin
 * unfortunately it is not possible to move the EntityCollectionLieblingHouse class in here as well
 * it deosn’t seem to be possible to consume the .unityweb files from the cdn :(
 */

require_once __DIR__.'/functions.php';

Kirby::plugin('centre-for-documentary-architecture/liebling-house', [

    'options' => [
        // https://documentary-architecture.fra1.cdn.digitaloceanspaces.com/cda/
        // 'path' => 'assets/apps/liebling-house/'
        'path' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/liebling-house/'
    ],

    'blueprints' => [
        'liebling-house/fields/worlditem' => __DIR__ . '/blueprints/worlditem.yml',
        'pages/collection_liebling-house' => __DIR__ . '/blueprints/collection.yml',
    ],

    'siteMethods' => [
        'lieblingHouse' => function (){
            return $this->page('1937-doka-32-073-34-770');
        }
    ],

    'controllers' => [
        'collection_liebling-house' => function ($page){
            switch ( $page->depth() ){
                case 3:
                    $category = 'tourstop';
                    $collection = $page->contextualized()->toEntities();
                    break;
                case 2:
                    $category = 'tour';
                    $collection = $page->children()->listed();
                    break;
                default:
                    $category = 'overview';
                    $collection = $page->children()->listed();
                    break;
            }
            return [
                'category' => $category,
                'collection' => $collection
            ];
        },
    ],

    'routes' => [
        [
            'pattern' => 'i/liebling-house/worlditems.json',
            'action'  => function (){

                $cached = true;
                $kirbyCache = kirby()->cache('worlditems');
                $cacheContent  = $kirbyCache->get('liste4');

                // there's nothing in the cache, so let's fetch it
                if( $cacheContent === null ){

                    $cacheContent = [
                        'entities' => getBoundEntityData(),
                        'tours' => getTourData()
                    ];

                    $kirbyCache->set('liste4', $cacheContent, option('cache-expires', 1440) );
                    $cached = false;

                }

                return [
                    'status' => 'ok',
                    'cache' => $cached,
                    'data'   => $cacheContent
                ];

            }
        ]
    ],
]);
