<?php

use Kirby\Cms\App as Kirby;

require_once __DIR__ . '/functions.php';

Kirby::plugin('cda/max-liebling-house', [

    'options' => [
        'pageid' => '1937-doka-32-073-34-770',
        'path' => 'https://documentary-architecture.fra1.digitaloceanspaces.com/cda/assets/liebling-house/',
        'cache' => true
    ],

    'blueprints' => [
        'liebling-house/fields/worlditem' => __DIR__ . '/blueprints/worlditem.yml',
        'pages/collection_liebling-house' => __DIR__ . '/blueprints/collection.yml',
    ],

    'siteMethods' => [
        'maxLieblingHouse' => function () {
            return $this->page('1937-doka-32-073-34-770');
        }
    ],

    'controllers' => [
        'collection_liebling-house' => function ($page) {
            switch ($page->depth()) {
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

                $cache = kirby()->cache('cda.max-liebling-house');
                $data  = $cache->get('worlditems');

                if ($data === null) {

                    $data = [
                        'entities' => getBoundEntityData(),
                        'tours' => getTourData()
                    ];

                    $cache->set('worlditems', $data, 1440);
                }

                return [
                    'status' => 'ok',
                    'data'   => $data
                ];
            }
        ]
    ],
]);
