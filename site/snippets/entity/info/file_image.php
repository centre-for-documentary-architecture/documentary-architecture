<?php if( $page->date_start()->isNotEmpty() ): ?>
    <dt>Date of Recording</dt>
    <dd><?= $page->date_start()->toDateKeyword() ?></dd>
<?php endif ?>

<?php if( $page->location_start()->isNotEmpty() ): ?>
    <dt>Location of Recording</dt>
    <dd><?= $page->location_start()->toLocation() ?></dd>
<?php endif ?>

<?php
$starring = $page->starring()->toPages();
if( $starring->count() > 0 ): ?>
    <dt class="fullwidth">Starring</dt>
    <dd class="fullwidth">
    <?php
    $echo = [];
    foreach( $starring as $star ):
        $echo[] = $star->toLink();
    endforeach;
    echo implode(', ',$echo);
    ?>
    </dd>
<?php endif; ?>