<?php

Kirby::plugin('cda/redirects', [
    'routes' => [
        [
            /*
            redirect /de/* urls to regular urls
            */
            'pattern' => '/de/(:all)',
            'action'  => function( string $path ){
                return '<meta http-equiv="Refresh" content="0; URL='.kirby()->site()->url().'/'.$path.'" />';
            }
        ],
    ]
]);
