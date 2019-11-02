<?php if( $page->date_start()->isNotEmpty() ): ?>
    <dt>Founded</dt>
    <dd><?= $page->date_start()->toDateKeyword() ?></dd>
<?php endif ?>

<?php if( $page->date_end()->isNotEmpty() ): ?>
    <dt>Terminated</dt>
    <dd><?= $page->date_end()->toDateKeyword() ?></dd>
<?php endif ?>

<?php if( $page->location_start()->isNotEmpty() ): ?>
    <dt>Location start</dt>
    <dd><?= $page->location_start()->toLocation() ?></dd>
<?php endif ?>

<?php if( $page->persons()->isNotEmpty() ): ?>
    <dt>Members</dt>
    <dd><?= $page->persons()->toKeywords() ?></dd>
<?php endif ?>
