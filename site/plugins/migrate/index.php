<?php

function text2text( $block, $title ){
    return [
        'title' => $title,
        'text' => $block['value'],
    ];
}

function website2text( $block, $title ){
    $url = $block['value'];
    $host = parse_url($url, PHP_URL_HOST);
    $host = str_replace('www.', '', $host);
    return [
        'title' => $title,
        'text' => "(link: $url text: $host)",
    ];
}

function migrateBlock( $block, $title ){
    $type = $block['_key'];
    if( $type === 'text' ){
        return [
            'content' => text2text( $block, $title ),
            'type' => 'text'
        ];
    }
    if( $type === 'website' ){
        return [
            'content' => website2text( $block, $title ),
            'type' => 'text'
        ];
    }
}

function builder2blocks( $builder ){
    $blocks = [];
    foreach($builder as $item){
        $type = $item['_key'];
        if( $type !== 'all2' ){
            continue;
        }
        if( count($item['kombi']) > 1 ){
            continue;
        }
        $title = $item['title'];
        foreach( $item['kombi'] as $sub ){
            $blocks[] = migrateBlock( $sub, $title );
        }
    }
    return $blocks;
}

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/migrate',
            'action'  => function(){

                // echo '<meta http-equiv="refresh" content="3">';

                $kirby = kirby();

                $pages = $kirby->site()->index();
                echo count($pages) . ' pages<br />';

                $i = 0;
                $s = 0;
                foreach($pages as $page){
                    if( !$page->properties()->exists() ){
                        $s++;
                        continue;
                    }

                    $page->update([
                        'properties' => null
                    ]);

                    echo $page->id() . '<br />';
                    $i++;

                    if( $i >= 20 ){
                        break;
                    }
                }
                echo $i . ' pages updated<br />';
                echo $s . ' pages skipped<br />';
            }
        ],
    ]
]);
