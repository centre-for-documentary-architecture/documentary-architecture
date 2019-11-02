<?php

/**
 * liebling-house 3d world
 */

 /*
 * is called a_liebling-hosue to be loaded before the framework plugin
 * */

require_once __DIR__.'/functions.php';

/*
* unfortunately it is not possible to move the EntityCollectionLieblingHouse class in here as well
*/

Kirby::plugin('centre-for-documentary-architecture/liebling-house', [

    'blueprints' => [
        'liebling-house/fields/worlditem' => __DIR__ . '/blueprints/worlditem.yml',
        'pages/collection_liebling-house' => __DIR__ . '/blueprints/collection.yml',
    ],

    'siteMethods' => [
        'lieblingHouse' => function () {
            return $this->page('1937-doka-32-073-34-770');
        }
    ],

    'options' => [
        'cache.worlditems' => true
    ],

    'controllers' => [
        'collection_liebling-house' => function ($page) {
            switch ( $page->depth() ) {
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
            'action'  => function () {

                $kirbyCache = kirby()->cache('centre-for-documentary-architecture.liebling-house.worlditems');
                $cacheContent  = $kirbyCache->get('liste4');

                // there's nothing in the cache, so let's fetch it
                if ($cacheContent === null) {

                    $cacheContent = [
                        'entities' => getBoundEntityData(),
                        'tours' => getTourData()
                    ];

                    $duration = 30; // minutes
                    $kirbyCache->set('liste4', $cacheContent, $duration);

                }

                return [
                    'status' => 'ok',
                    'data'   => $cacheContent
                ];

            }
        ]
    ],
]);
