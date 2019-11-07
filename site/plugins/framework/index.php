<?php

function archivePath( string $base, string $filter = '', string $research = '', array $query = [] ): string
{
    $url = implode( '/', array_filter([ $base, $filter, $research ]) );
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

                if( isset( $query['filter'] ) && $filter === 'all' ){
                    $filter = $query['filter'];
                }
                unset( $query['filter'] );

                if( isset( $query['research'] ) && $research === '' ){
                    $research = $query['research'];
                }
                unset( $query['research'] );

                if( isset( $query['page'] ) ){
                    $page = $query['page'];
                } else {
                    $page = 1;
                }

                $archive = kirby()->site()->archive();
                if( $archiveFiltered = $archive->find( $filter ) ){
                    $archive = $archiveFiltered;
                    $archiveFiltered = '';
                } else {
                    $archiveFiltered = 'all';
                }

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
                    $next = archivePath( $archive->url(), $archiveFiltered, $research, $nextQuery );
                }

                if( $page == 1 ){
                    // new query

                    $data = $archive->dataGeneral();

                    $data['url'] = archivePath( $archive->url(), $archiveFiltered, $research, $query );
                    $data['options'] = $archive->dataOptions();
                    $data['results'] = [
                        'type' => 'collection',
                        'headline' => 'Results',
                        'total' => $count,
                        'page' => 1,
                        'next' => $next,
                        'content' => $results->limit( $pagination )->dataAbstract()
                    ];

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
