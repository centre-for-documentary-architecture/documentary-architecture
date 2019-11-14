<!DOCTYPE html>

<head>

  <title>CDA: Centre for Documentary Architecture</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <?= css('media/plugins/centre-for-documentary-architecture/interim/css/interim.min.css'); ?>

</head>

<body>
  <main class="flex-vertical">
    <div class="flex-horizontal top">
      <div class="width-bigger text white">
        <h1>The Matter of Data</h1>
        <h2>Tracing the Materiality of »Bauhaus Modernism«</h2>
        <h2>Auf den Spuren der »Bauhaus-Moderne«</h2>
      </div>
      <div class="width-smaller image black">
        <figure>
          <div class="frame">
            <div class="gradient"></div>
            <div class="strip">
              <img width="100%" height="auto" src="<?= url('media/plugins/centre-for-documentary-architecture/interim/img/terrazzo-l.jpg') ?>" />
            </div>
          </div>
          <figcaption>2018-doka-32.073-34.770-terrazzo-electron-microscopy-8.jpg</figcaption>
        </figure>
      </div>
    </div>
    <div class="flex-horizontal bottom black">
      <div class="width-bigger text">
        <div class="events">

          <div class="event tel-aviv">
            <div class="date">
              <span class="start">19<span class="dot">.</span>9<span class="dot">.</span>19</span><span class="end"><span class="dash">&mdash;</span>1<span class="dot">.</span>4<span class="dot">.</span>20<br />&nbsp;</span>
            </div>
            <div class="location">
              <span class="city">Tel Aviv</span><span class="venue">Liebling<br />House</span>
            </div>
          </div>

          <div class="event weimar">
            <div class="date">
              <span class="start">27<span class="dot">.</span>9<span class="dot">.</span>19</span><span class="end"><span class="dash">&mdash;</span>3<span class="dot">.</span>11<span class="dot">.</span>19<br />&nbsp;</span>
            </div>
            <div class="location">
              <span class="city">Weimar</span><span class="venue">Bauhaus-<br />Museum</span>
            </div>
          </div>

          <div class="event online">
            <div class="date">
              <span class="start">12<span class="dot">.</span>11<span class="dot">.</span>19</span>
            </div>
            <div class="location">
              <span class="city">Website Relaunch</span>
            </div>
          </div>

        </div>

        <div class="website">
          <a class="" href="https://documentary-architecture.org">documentary-architecture.org under construction</a>
          <a href="https://www.instagram.com/documentary_architecture/" target="_blank">Instagram</a>
        </div>
      </div>
      <div class="width-smaller image">
        <figure>
          <div class="frame">
            <div class="gradient"></div>
            <div class="strip">
              <img width="100%" height="auto" src="<?= url('media/plugins/centre-for-documentary-architecture/interim/img/rollo-l.jpg') ?>" />
            </div>
          </div>
          <figcaption>2018-doka-32.073-34.770-door-frame.fbx</figcaption>
        </figure>
      </div>
    </div>
  </main>
  <script>
    'use strict'
    let boxheight = window.innerHeight * 0.5;
    function resize() {
      boxheight = window.innerHeight * 0.5;
    }
    window.onresize = resize;
    let strips = document.getElementsByClassName('strip');
    let frames = [];
    window.onload = (event) => {
      let direction = 1;
      for (const strip of strips) {
        let img = strip.firstElementChild;
        let height = img.offsetHeight;
        for (let i = 1; i < 100; i++) {
          strip.appendChild( img.cloneNode(false) );
        }
        let frame = {
          strip: strip,
          direction: direction,
          offset: 0,
          height: height
        }
        frame.offset = - frame.height * 50 * frame.direction * frame.direction;
        frames.push( frame );
        frame.strip.style.top = frame.offset+'px';
        direction -= direction * 2;
      }
      console.log( frames );
    };
    // https://github.com/mikolalysenko/mouse-wheel
    function mouseWheelListen(element, callback, noScroll) {
      if(typeof element === 'function') {
        noScroll = !!callback
        callback = element
        element = window
      }
      var lineHeight = 1;
      var listener = function(ev) {
        if(noScroll) {
          ev.preventDefault()
        }
        var dx = ev.deltaX || 0
        var dy = ev.deltaY || 0
        var dz = ev.deltaZ || 0
        var mode = ev.deltaMode
        var scale = 1
        switch(mode) {
          case 1:
            scale = lineHeight
          break
          case 2:
            scale = window.innerHeight
          break
        }
        dx *= scale
        dy *= scale
        dz *= scale
        if(dx || dy || dz) {
          return callback(dx, dy, dz, ev)
        }
      }
      element.addEventListener('wheel', listener)
      return listener
    }
    mouseWheelListen(function(dx, dy) {
      scroll = dy * 0.5;
      for (const frame of frames) {
        frame.offset += scroll * frame.direction;

        frame.strip.style.top = frame.offset+'px';
      }
    }, true);
  </script>
  <div class="background"></div>
</body>
</html>
