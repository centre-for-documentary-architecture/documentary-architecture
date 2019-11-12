<?php

snippet('header');

snippet('navigation/history');

?>

<header id="top" class="black content">

    <h1><?= $site->title() ?></h1>

</header>

<main class="black">
    <?php snippet('about/about',[ 'about' => $page ]); ?>
</main>

<?php

snippet('footer');
