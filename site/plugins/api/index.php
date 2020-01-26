<?php
Kirby::plugin('centre-for-documentary-architecture/api', [
  'routes' => [
    [
      'pattern' => [
        'api',
        'api/(:all)'
      ],
      'action'  => function ( $pathname = '' ) {

        $kirby = kirby();
        $query = get();
        $status = 200;

        if( $pathname === '' ){
          $page = $kirby->site()->homePage();
        } else if ( $page = $kirby->page($pathname) ) {
          // good, it’s a page
        } else if( $page = $kirby->file($pathname) ) {
          // good, it’s a file
        } else {
          // not found
          $status = 400;
          $page = $kirby->site()->errorPage();
        }

        if( $page->template() === 'archive' || $page->template() === 'json' ){

          $data = $page->dataAbstract();

          return [
          	'status' => $status,
          	'query'  => $query,
            'type'   => $type,
          	'data'   => $data,
            'cached' => false
          ];

        } else {

          return $page;

        }

      }
    ]
  ]
]);
