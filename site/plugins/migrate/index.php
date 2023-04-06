<?php

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/remove-field',
            'action'  => function () {

                $kirby = kirby();
                $kirby->impersonate('kirby');

                $pages = $kirby->site()->archive()->children()->index( true );
                // $files = $kirby->site()->archive('images')->images();

                $collection = $pages->filter(function( $item ){
                    if( $item->date_end()->isNotEmpty() ){
                        return true;
                    }
                    return false;
                });

                dump( $collection );
                
                if( $collection->count() < 1 ){
                    echo 'done';
                    exit;
                }

                foreach( $collection->limit( 10 ) as $item ){

                    $item->update([
                        'date_end' => null,
                    ]);

                    echo 'updated: ' . $item->title() . '<br>';

                }

                echo '<meta http-equiv="refresh" content="1">';
                exit;

            }
        ],
    ]
]);
