<?php

/*
* controllers
* https://getkirby.com/docs/reference/plugins/extensions/controllers
* https://getkirby.com/docs/guide/templates/controllers
*/

return [

    'home' => function ( $site ) {
        return [
            'projects' => $site
                ->children()
                ->listed()
                ->template(['collection','collection_liebling-house']),
            'publications' => $site
                ->archive('publications')
                ->highlights()
                ->toPages(),
        ];
    },

    /*
    'archive' => function ($site, $page) {

        $query = get('q');

        if( $query ){
            if( $page->depth() === 1 ) {
                /*
                /archive?query
                queries the whole page
                */
                /*
                $collection = $site;
            } else {
                /*
                /archive
                queries archive
                */
                /*
                $collection = $page;
            }
            /*
            * query
            */
            /*
            $collection = $collection->index()->listed()->search( $query );
        } else {
            if( $page->depth() === 1 ) {
                /*
                /archive
                shows all entities
                */
                /*
                $collection = $page->index()->listed();
            } else {
                /*
                /archive/images
                shows children
                */
                /*
                $collection = $page->children()->listed();
            }
        }

        return [
          'query'   => $query,
          'collection' => $collection->limit(40),
        ];

    },
    */


];
