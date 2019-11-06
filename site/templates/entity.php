<?php

snippet('header');

snippet('footer', [
    'include' => [
        js('media/plugins/centre-for-documentary-architecture/framework/public/bundle.js', ['defer'=>true]),
        css('media/plugins/centre-for-documentary-architecture/framework/public/bundle.css')
    ]
]);
