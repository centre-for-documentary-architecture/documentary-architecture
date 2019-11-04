<?php


Kirby::plugin('centre-for-documentary-architecture/framework', [

    'options' => [
        'cache.json' => true,
        'expires' => 5
    ],

    'routes' => [
        [
            'pattern' => [
                'archive.json',
                'archive/(:any).json'
            ],
            'action'  => function ( $any = false ) {

                $archive = kirby()->site()->archive( $any );

                // https://getkirby.com/docs/reference/objects/request
                $query = get();

                if( isset( $query['research'] ) ){
                    $research = $query['research'];
                } else {
                    $research = '';
                }

                $results = $archive->results( $research );
                $count = $results->count();

                if( !isset( $query['page'] ) ){
                    $page = 1;
                } else {
                    $page = $query['page'];
                }

                $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination');

                if( $page > 1 ){

                    // nth page of a existing query
                    $offset = ( $page * $pagination ) - $pagination;

                    if( $offset + $pagination < $count ){

                        $query['page']++;
                        if( $querystring = http_build_query($query) ){
                            $querystring = '?' . $querystring;
                        }
                        $next = $archive->url().$querystring;

                    } else {
                        $next = false;
                    }

                    $data = [
                        'total' => $count,
                        'page' => $page,
                        'next' => $next,
                        'content' => $results->offset( $offset )->limit( $pagination )->dataAbstract()
                    ];

                } else {

                    // new query
                    $data = $archive->dataGeneral();

                    if( $querystring = http_build_query($query) ){
                        $data['url'] = $data['url'] . '?' . $querystring;
                    }

                    if( $pagination < $count ){

                        $query['page'] = 2;
                        if( $querystring = http_build_query($query) ){
                            $querystring = '?' . $querystring;
                        }
                        $next = $archive->url().$querystring;

                    } else {
                        $next = false;
                    }

                    $data['results'] = [
                        'type' => 'collection',
                        'headline' => 'Results',
                        'total' => $count,
                        'layout' => 'cards',
                        'page' => 1,
                        'next' => $next,
                        'content' => $results->limit( $pagination )->dataAbstract()
                    ];

                }

				return [
                    'status' => 'ok',
                    'query'  => $query,
                    'data'   => $data,
				];

            }
		],
		[
            'pattern' => '(:all).json',
            'action'  => function ( $all ) {

                $kirby = kirby();
                $query = get();

                $jsonCache = $kirby->cache('json');
                $jsonCacheId = $all;
                if( http_build_query($query) != '' ){
                    $jsonCacheId .= '-' . http_build_query($query);
                }
                $jsonCacheData  = $jsonCache->get( $jsonCacheId );
                if( isset( $query['flush'] ) ){
                    $jsonCacheData = null;
                }

                if ($jsonCacheData === null) {

                    if( !$all ){

                        // requested nothing -> home
                        $requested = $kirby->site()->homePage();

                    } else if( $r = $kirby->page( $all ) ){

                        // requested page
                        $requested = $r;

                    } else if ( $r = $kirby->file( $all ) ){

                        // requested file
                        $requested = $r->toImageEntity();

                    }

                    if( isset( $query['collection'] ) ){

                        $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination');

                        if( !isset( $query['page'] ) ){
                            $page = 1;
                        } else {
                            $page = $query['page'];
                        }

                        $collection = $requested->collection();
                        $count = $collection->count();

                        $offset = ( $page * $pagination ) - $pagination;

                        if( $offset + $pagination < $count ){

                            $next = $requested->url().'?collection&page='. ( $page+1 );

                        } else {
                            $next = false;
                        }

                        $return = [
                            'page' => $page,
                            'total' => $count,
                            'next' => $next,
                            'content' => $collection->offset( $offset )->limit( $pagination )->dataAbstract()
                        ];

                    } else {

                        $return = $requested->dataSet();

                    }

                    $jsonCacheData = $return;
                    $jsonCache->set($jsonCacheId, $jsonCacheData, option('centre-for-documentary-architecture.framework.expires'));

                }

				return [
                    'status' => 'ok',
                    'query'  => $query,
                    'data'   => $jsonCacheData
                ];

            }
		],
	],

]);
