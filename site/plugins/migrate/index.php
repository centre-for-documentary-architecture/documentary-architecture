<?php

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/migrate.json',
            'action'  => function(){
                $kirby = kirby();
                return [];
            }
        ],
    ]
]);
