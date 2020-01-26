<?php
Kirby::plugin('cda/get', [
  'routes' => [
    [
      'pattern' => [
        'get',
        'get/',
        'get/start'
      ],
      'action'  => function () {
        return kirby()->site()->homePage()->render(['get' => true]);
      }
    ],
    [
      'pattern' => [
        'get/(:all)'
      ],
      'action'  => function ( $pathname = '' ) {

        $kirby = kirby();
        $query = get();

        if ( $page = $kirby->page($pathname) ) {
          // good, it’s a page
        } else if( $page = $kirby->file($pathname) ) {
          // good, it’s a file
        } else {
          // error
          return $kirby->site()->errorPage()->render(['get' => true]);
        }

        if( $page->template() !== 'archive' || $page->template() !== 'entity' ){
          return $page->render(['get' => true]);
        }

        $data = $page->dataAbstract();

        return [
        	'status' => $status,
        	'query'  => $query,
          'type'   => $type,
        	'data'   => $data,
          'cached' => false
        ];

      }
    ]
  ]
]);
