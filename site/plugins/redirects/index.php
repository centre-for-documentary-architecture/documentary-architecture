<?php

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/redirects', [
    'routes' => [
        [
            /*
            redirect /de/* urls to regular urls
            */
            'pattern' => '/de/(:all)',
            'action'  => function (string $path) {
                go('/' . $path, 301);
            }
        ],
    ]
]);
