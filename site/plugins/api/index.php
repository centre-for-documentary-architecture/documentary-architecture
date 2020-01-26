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

        $request = $pathname;
        if( $querystring = $kirby->request()->query()->toString() ){
          $request .= '?' . trim( $querystring, '=' );
        }

        if ( $page = $kirby->page($pathname) ) {
          // good, it’s a page
        } else if( $page = $kirby->file($pathname)->toImageEntity() ) {
          // good, it’s a file
        } else {
          // error
          return $kirby->site()->errorPage()->render(['get' => true]);
        }

        $template = $page->template()->name();

        if( $template !== 'archive' && $template !== 'entity' ){
          return $page->render(['get' => true]);
        }

        $data = $page->dataAbstract();

        return [
        	'status' => 200,
        	'request'  => $request,
        	'data'   => $data,
          'cached' => false,
          'template' => $template
        ];

      }
    ]
  ]
]);
