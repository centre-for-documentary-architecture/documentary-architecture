<?php

use Kirby\Cms\App as Kirby;

Kirby::plugin('cda/migrate', [
    'routes' => [
        [
            'pattern' => '/migrate-locations',
            'action'  => function () {

                $kirby = kirby();
                $archive = $kirby->site()->archive('images');

                $result = [];

                $n = 0;

                foreach ($archive->images()->offset($n)->limit(50) as $item) {

                    $contexts = $item->contexts()->toPages()->filterBy('intendedTemplate', 'item_building');

                    if ($contexts->count() !== 1) {
                        continue;
                    }

                    $context = $contexts->first();

                    $location = $item->location_new()->yaml();

                    $new = $location;
                    $new['inherit'] = [(string)$context->uuid()];

                    if ($new['inherit']) {
                        $new['location'] = [];
                    } else {
                        continue;
                    }

                    // $item->update([
                    //     'location_new' => $new
                    // ]);

                    $result[] = [
                        'title' => (string)$item->title(),
                        'context' => (string)$context->title(),
                        'old' => $location,
                        'new' => $new
                    ];
                }

                return $result;
            }
        ],
    ]
]);
