<?php

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/migrate',
            'action'  => function () {
                $data = [];
                $pages = kirby()->site()->archive()->entities();
                
                foreach( $pages as $page ){
                    $data[] = [
                        'title' => (string)$page->title()
                    ];
                }

                return $data;
            }
        ],
    ]
]);
