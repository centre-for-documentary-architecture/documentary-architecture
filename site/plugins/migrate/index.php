<?php

use Kirby\Cms\App as Kirby;
use  Kirby\Data\Yaml;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/remove-field',
            'action'  => function () {

                $kirby = kirby();
                $kirby->impersonate('kirby');

                $pages = $kirby->site()->page('1937-doka-32-073-34-770')->index( true );

                $collection = $pages->filter(function( $item ){
                    if( $item->date_created()->isNotEmpty() ){
                        return true;
                    }
                    if( $item->date_modified()->isNotEmpty() ){
                        return true;
                    }
                    if( $item->user_created()->isNotEmpty() ){
                        return true;
                    }
                    if( $item->user_modified()->isNotEmpty() ){
                        return true;
                    }
                    return false;
                });

                dump( $collection );
                
                if( $collection->count() < 1 ){
                    echo 'done';
                    exit;
                }

                // foreach( $collection->limit( 15 ) as $item ){
                //     $item->update([
                //         'date_modified2' => Yaml::encode([
                //             'created' => (string)$item->date_created(),
                //             'modified' => (string)$item->date_modified(),
                //             'created_by' => (string)$item->user_created(),
                //             'modified_by' => (string)$item->user_modified(),
                //         ]),
                //         'date_created' => null,
                //         'date_modified' => null,
                //         'user_created' => null,
                //         'user_modified' => null,
                //     ]);
                //     echo 'updated: ' . $item->title() . '<br>';
                // }

                // echo '<meta http-equiv="refresh" content="1">';
                exit;

            }
        ],
    ]
]);
