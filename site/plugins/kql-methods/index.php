<?php 

use Kirby\Cms\App as Kirby;
use Kirby\Toolkit\Str;

Kirby::plugin('cda/kql-methods', [
    
    'fieldMethods' => [

        'toSlug' => function ($field) {
            if ($field->isNotEmpty()) {
                $field->value = Str::slug( $field->value );
            }
            return $field;
        },

        'structureToLinks' => function ($field, bool $includeTitle = true ) {

            $links = [];
            foreach( $field->toStructure() as $row ){
                if( $includeTitle ){
                    $links[] = [
                        'href' => (string)$row->href(),
                        'title' => $row->title()->isNotEmpty() ? (string)$row->title() : parse_url($row->href())['host']
                    ];
                } else {
                    $links[] = (string)$row->href();
                }
            }

            return $links;
    
        },
        
        'ifTrueThen' => function ($field, $fallback) {
            if (!$field->isTrue()) {
                return null;
            }
            return $fallback;    
        },
        
    ],
    
    'usersMethods' => [

        /**
         * @kql-allowed
         */
        'findBySlug' => function ( string $query ) {
            return $this->filter(function ($user) use ($query) {
                return $query == $user->slug();
            })->first();
        },

        /**
         * @kql-allowed
         */
        'slug' => function () {
            return Str::slug( $this->name() );
        },

    ]

]);