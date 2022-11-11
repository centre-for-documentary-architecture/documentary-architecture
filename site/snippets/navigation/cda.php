<aside id="cda">

  <div class="bar cda vertical" onclick="openAboutBar(event)" title="More info on <?= $site->title() ?>">

    <a class="logo abbr"><?= svg('assets/img/cda-logo-bar.svg') ?></a>
    <a class="logo full" onclick="closeAboutBar(event)"><?= svg('assets/img/cda-logo-full.svg') ?></a>
    <button class="bar-close" onclick="closeAboutBar(event)" title="Close">&times;</button>

    <div class="about">
        <?php snippet('about/about') ?>
    </div>

  </div>

  <div class="glass" onclick="closeAboutBar(event)"></div>

</aside>
