<?php 

use Kirby\Cms\App as Kirby;

Kirby::plugin('moritzebeling/kirby-thumbs', [
    
    'routes' => [
        [
            'pattern' => 'thumbs/(:all)',
            'action'  => function ( $id ) {

                $image = kirby()->image( $id );

                if( !$image ){
                    return;
                }

                if( $width = get('width', false) ){
                    $image = $image->resize( $width );
                }

                return go( $image->url() );
                
            }
        ],
    ]

]);