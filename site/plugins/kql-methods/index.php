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

        'structureToLinks' => function ($field) {

            $links = [];
            foreach( $field->toStructure() as $row ){
                $links[] = [
                    'href' => (string)$row->href(),
                    'title' => $row->title()->isNotEmpty() ? (string)$row->title() : parse_url($row->href())['host'],
                ];
            }

            return $links;
    
        },
        
        'ifTrueThen' => function ($field, $fallback) {

            if (!$field->isTrue()) {
                return $field;
            }
    
            if ($fallback instanceof self) {
                return $fallback;
            }
    
            $field = clone $field;
            $field->value = $fallback;
            return $field;
    
        },
        
    ],
    
    'usersMethods' => [
        'findByNameSlug' => function ( string $slug ) {
            return $this->filter(function ($user) use ($slug) {
                return $slug == Str::slug( $user->name() );
            })->first();
        }
    ]

]);