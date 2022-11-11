    </div><!-- .page-wrapper -->

    <?php if( !$page->isHomePage() ): ?>
      <?= js( option('frontend-js'), ['defer'=>true]) ?>
      <?= css( option('frontend-css') ) ?>
    <?php endif ?>

    <?= js('assets/es6/global.js', true) ?>
    <?= js( option('cdn').'/assets/js/lazysizes.min.js', true) ?>
    <?= js( option('cdn').'/assets/js/smooth-scroll.min.js') ?>

    <script>
      var scroll = new SmoothScroll('a.smooth[href*="#"]',{
        speed: 500,
        offset: 28
      });
    </script>

    <noscript>Please enable JavaScript in your browser to view this page.</noscript>

</body>
</html>
