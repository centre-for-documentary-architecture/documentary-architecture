<nav class="bar history horizontal white">
  <h3>
    <?php if( $page->isHomePage() ): ?>
      <a href="#top" class="smooth">
        <?= html( $site->title() ) ?>
      </a>
    <?php else: ?>
      <a href="<?= $site->homePage()->url() ?>">
        <?= html( $site->title() ) ?>
      </a>
    <?php endif; ?>
  </h3>
</nav>
