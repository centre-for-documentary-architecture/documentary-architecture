<?php
Kirby::plugin('cda/get', [
  'routes' => [
    [
      'pattern' => [
        'get',
        'get/',
        'get/start'
      ],
      'method' => 'GET|OPTIONS',
      'language' => '*',
      'action'  => function ( $language ) {

        $kirby = kirby();
        $cacheId = $language . '/start';

        // cache
        $cache = $kirby->cache('get');
        if( option('cache.get',false) ){
          $cacheData = $cache->get($cacheId);
          if( $cacheData !== null ){
            return $cacheData;
          }
        }

        $return = $kirby->site()->homePage()->render(['get' => true]);

        $cache->set($cacheId, $return, option('cache-expires',1440) );
        return $return;
      }
    ],
    [
      'pattern' => [
        'get/(:all)'
      ],
      'method' => 'GET|OPTIONS',
      'language' => '*',
      'action'  => function ( $language, $pathname = '' ) {

        $kirby = kirby();

        // request path
        $cacheId = $pathname;
        if( $querystring = $language . '/' . $kirby->request()->query()->toString() ){
          $cacheId .= '?' . trim( $querystring, '=' );
        }

        // cache
        $cache = $kirby->cache('get');
        if( option('cache.get',false) ){
          $cacheData = $cache->get( $cacheId );
          if( $cacheData !== null ){
            return $cacheData;
          }
        }

        if ( $requested = $kirby->page($pathname) ) {
          // page
        } else if( $requested = $kirby->file($pathname)->toImageEntity() ) {
          // file
        } else {
          // error
          return $kirby->site()->errorPage()->render(['get' => true]);
        }

        $template = $requested->template()->name();

        $query = get();
        if( isset( $query['page'] ) && $query['page'] ){
            $page = $query['page'];
        } else {
            $page = 1;
        }
        $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination',40);
        $offset = ( $page * $pagination ) - $pagination;

        if( $template === 'entity' ){
          // entity

          if( isset( $query['collection'] ) ){

            $collection = $requested->collection();
            $count = $collection->count();

            if( $offset + $pagination < $count ){
              $next = $requested->url().'?collection&page='. ( $page+1 );
            } else {
              $next = false;
            }

            $data = [
              'page' => $page,
              'total' => $count,
              'next' => $next,
              'content' => $collection->offset( $offset )->limit( $pagination )->dataAbstract()
            ];

          } else {

            $data = $requested->dataSet();

          }

          $return = [
          	'status' => 200,
          	'data'   => $data
          ];

        } else if( $template === 'archive' ){

          // ------------------------------

          if( isset( $query['research'] ) && $query['research'] ){
              $research = $query['research'];
          } else {
              $research = '';
          }
          $results = $requested->results( $research );
          $count = $results->count();

          if( $offset + $pagination < $count ){
            $nextQuery = $query;
            $nextQuery['page'] = $page + 1;
            $next = $requested->url().'?'.http_build_query( $nextQuery );
          } else {
            $next = false;
          }

          if( $page == 1 ){
              // new query

              $archive = $kirby->site()->archive();
              $data = $archive->dataGeneral();
              $filter = $requested->slug();
              if( $filter === $archive->slug() ){
                $filter = false;
              }

              $data['url'] = $requested->url();
              if( $research ){
                $data['url'] .= '?'.http_build_query(['research' => $research]);
              }
              $data['archive'] = [
                  'url' => $requested->url(),
                  'filter' => $filter,
                  'query' => $research,
                  'filters' => $archive->dataFilters(),
              ];
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

          // archive
          $return = [
          	'status' => 200,
          	'data'   => $data
          ];

          // ------------------------------


        } else {

          // html page
          $return = $requested->render(['get' => true]);

        }

        $cache->set($cacheId, $return, option('cache-expires',1440) );
        return $return;

      }
    ]
  ]
]);
