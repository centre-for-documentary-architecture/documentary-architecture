<?php if( $page->date_start()->isNotEmpty() ): ?>
    <dt>Manufactured</dt>
    <dd><?= $page->date_start()->toDateKeyword() ?></dd>
<?php endif ?>

<?php if( $page->material()->isNotEmpty() ): ?>
    <dt>Material</dt>
    <dd><?= $page->material()->toKeywords() ?></dd>
<?php endif ?>

<?php if( $page->manufacturer()->isNotEmpty() ): ?>
    <dt>Manufacturer</dt>
    <dd><?= $page->manufacturer()->toKeyword() ?></dd>
<?php endif ?>