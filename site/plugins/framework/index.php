<?php

function archivePath( string $base, string $research = '', array $query = [] ): string
{
    $url = trim( implode( '/', [ $base, $research ] ), "/" );
    if( $query !== [] ){
        return $url .'?'. http_build_query($query);
    }
    return  $url;
}

Kirby::plugin('centre-for-documentary-architecture/framework', [

    'options' => [
        'cache.json' => true,
        'expires' => 5
    ],

    'routes' => [
        [
            'pattern' => [
                'archive.json',
                'archive/(:any).json',
                'archive/(:any)/(:any).json'
            ],
            'action'  => function ( $filter = 'all', $research = '' ) {

                // https://getkirby.com/docs/reference/objects/request
                $query = get();

                if( isset( $query['filter'] ) && $filter !== 'all' ){
                    $filter = $query['filter'];
                    unset( $query['filter'] );
                }
                if( isset( $query['research'] ) && $research !== '' ){
                    $research = $query['research'];
                    unset( $query['research'] );
                }

                if( isset( $query['page'] ) ){
                    $page = $query['page'];
                } else {
                    $page = 1;
                }

                $archive = kirby()->site()->archive()->filter( $filter );
                $results = $archive->results( $research );

                $count = $results->count();
                $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination');

                if( $page > 1 ){

                    // nth page of a existing query
                    $offset = ( $page * $pagination ) - $pagination;

                    if( $offset + $pagination < $count ){

                        $nextQuery = $query;
                        $nextQuery['page'] = $page + 1;
                        $next = archivePath( $archive->archive()->url(), $research, $nextQuery );

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

                    $data['url'] = archivePath( $archive->archive()->url(), $research, $query );

                    if( $pagination < $count ){

                        $nextQuery = $query;
                        $nextQuery['page'] = $page + 1;
                        $next = archivePath( $archive->archive()->url(), $research, $nextQuery );

                    } else {
                        $next = false;
                    }

                    // $data['options'] = $archive->dataOptions();

                    $data['results'] = [
                        'type' => 'collection',
                        'headline' => 'Results',
                        'total' => $count,
                        'page' => 1,
                        'next' => $next,
                        'content' => $results->limit( $pagination )->dataAbstract()
                    ];

                }

				return [
                    'status' => 'ok',
                    'filter' => $filter,
                    'research' => $research,
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
