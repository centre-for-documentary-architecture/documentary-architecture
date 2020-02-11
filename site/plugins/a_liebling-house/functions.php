<?php

function getBoundEntityData() {
    /**
     * Entities are bound to world items by selecting them from a list. Once
     * selected an entity is bound to an item. This function looks at the field
     * 'worlditem' and determines whether or not it has a value.
     */
    $boundEntities = kirby()->site()->index()->filter(function ($page) {
        return $page->worlditem() != '';
    });

    $entities = [];
    foreach( $boundEntities as $entity ){
        $data = [
            'id' => $entity->id(),
            'slug' => $entity->uid(),
            'entity' => $entity->entity(),
            'type' => $entity->type(),
            'title' => $entity->title()->value(),
            'worlditem' => $entity->worlditem(),
        ];

        $image = $entity->thumbnail();
        if( $entity->type() === 'image' && $image !== null ) {
            $data[ 'imageResources' ] = [
                'high' => $image->thumb(['width'=>2048])->url(),
                'medium' => $image->thumb(['width'=>1024])->url(),
                'low' => $image->thumb(['width'=>512])->url()
            ];
        }
        array_push($entities, $data);
    }
    return $entities;
}

function getTourData() {
    $tours = [];
    foreach( kirby()->site()->lieblingHouse()->children()->listed() as $tour){
        $stops = [];
        // $worldItems = [];
        $i = 1;
        foreach( $tour->children()->listed() as $stop ){
            array_push($stops, [
                'slug' => $stop->uid(),
                'num' => $i,
                'id' => $stop->id(),
                'type' => 'tourstop',
                'title' => $stop->title()->value(),
                'worlditem' => $stop->worlditem(),
                // 'content' => extractTourstopContent($stop) //$content
            ]);
            // array_push($worldItems, $stop->worlditem());
            $i++;
        }

        $tours[ $tour->uid() ] = [
            'id' => $tour->id(),
            'type' => 'tour',
            'title' => $tour->title()->value(),
            'worlditem' => $tour->worlditem(),
            // 'referencedItems' => $worldItems,
            'tourstops' => $stops
        ];
    }
    return $tours;
}

// function extractTourstopContent($stop) {
//     $content_collection = $stop->content_collection()->value();
//     $content = [];
//     switch ( $content_collection ) {
//         case 'pages':
//             $content = $stop->content_pages()->yaml();
//             break;

//         case 'entities':
//             $content = $stop->content_entities()->yaml();
//             break;

//         case 'contexts':
//         case 'contextualized':
//             $content = $stop->{$content_collection}()->yaml();
//             break;

//         case 'children';
//         default:
//             break;
//     }
//     return $content;
// }