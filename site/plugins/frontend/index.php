<?php

function archivePath( string $base, string $filter = '', array $query = [] ): string
{
    $url = implode( '/', array_filter([ $base, $filter ]) );
    if( $query = http_build_query( array_filter($query) ) ){
        return $url .'?'. $query ;
    }
    return  $url;
}

Kirby::plugin('centre-for-documentary-architecture/frontend', [

    'routes' => [
        [
            'pattern' => [
                'archive.json',
                'archive/(:any).json'
            ],
            'action'  => function ( $filter = '' ) {

                // https://getkirby.com/docs/reference/objects/request
                $query = get();

                if( $filter !== '' ){
                    $query['filter'] = $filter;
                } else if ( isset( $query['filter'] ) ){
                    $filter = $query['filter'];
                }

                if( !isset( $query['research'] ) ){
                    $query['research'] = '';
                }
                $research = $query['research'];

                if( isset( $query['page'] ) ){
                    $page = $query['page'];
                } else {
                    $page = 1;
                }

                $mainArchive = kirby()->site()->archive();
                /*
                if( $archiveFiltered = $mainArchive->find( $filter ) ){
                    $archive = $archiveFiltered;
                } else {
                    $archive = $mainArchive;
                    $filter = '';
                }
                */

                $archive = kirby()->site()->archive()->filter( $filter );
                $results = $archive->results( $research );

                $count = $results->count();
                $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination');
                $offset = ( $page * $pagination ) - $pagination;

                if( $offset + $pagination > $count ){
                    $next = false;
                } else {
                    $nextQuery = $query;
                    $nextQuery['page'] = $page + 1;
                    $next = archivePath( $mainArchive->url(), '', $nextQuery );
                }

                if( $page == 1 ){
                    // new query

                    $data = $archive->dataGeneral();

                    $data['url'] = archivePath( $mainArchive->url(), $filter, ['research' => $query['research']] );
                    $data['archive'] = [
                        'url' => $mainArchive->url(),
                        'filter' => $filter,
                        'query' => $query['research'],
                        'filters' => $mainArchive->dataFilters(),
                    ];
                    $data['results'] = [
                        'type' => 'collection',
                        'headline' => 'Results',
                        'total' => $count,
                        'page' => 1,
                        'next' => $next,
                        'content' => $results->limit( $pagination )->dataAbstract()
                    ];
                    /*
                    if( isset($query['research']) && $query['research'] != '' ){
                      // $data['title'] .= ': '.$query['research'];
                      // $data['url'] .= '?'.http_build_query(['research' => $query['research'] ]);
                    }
                    */

                } else {

                    $data = [
                        'total' => $count,
                        'page' => $page,
                        'next' => $next,
                        'content' => $results->offset( $offset )->limit( $pagination )->dataAbstract()
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
                $cached = true;

                if ($jsonCacheData === null) {
                    $cached = false;

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
                    $jsonCache->set($jsonCacheId, $jsonCacheData, option('cache-expires',1440) );

                }

				return [
                    'status' => 'ok',
                    'query'  => $query,
                    'cache' => $cached,
                    'data'   => $jsonCacheData
                ];

            }
		],
	],

]);
