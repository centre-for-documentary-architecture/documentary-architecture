    </div><!-- .page-wrapper -->

    <?= js( option('frontend-js'), ['defer'=>true]) ?>

    <?= css( option('frontend-css') ) ?>

    <?= js('assets/es6/global.js', true) ?>
    <?= js( option('cdn').'/assets/js/lazysizes.min.js', true) ?>
    <?= js( option('cdn').'/assets/js/smooth-scroll.min.js') ?>

    <script>
      var scroll = new SmoothScroll('a.smooth[href*="#"]',{
        speed: 500,
        offset: 28
      });
    </script>

    <?php snippet('noscript'); ?>

</body>
</html>
