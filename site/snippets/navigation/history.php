<nav class="bar history horizontal white">
    <ol>
    <?php foreach( $site->breadcrumb() as $crumb ):
        $current = $crumb->is( $page );
        ?>
        <li <?php e( $current, 'class="current"'); ?>>
            <a href="<?php e( $current, '#top', $crumb->url() ) ?>" <?php e( $current, 'class="smooth"'); ?> >
                <?php if( $page->isHomePage() ): ?>
                    <?= html( $site->title() ) ?>
                <?php else: ?>
                    <?= html( $crumb->title() ) ?>
                <?php endif; ?>
            </a>
        </li>
    <?php endforeach; ?>
    </ol>
</nav>
