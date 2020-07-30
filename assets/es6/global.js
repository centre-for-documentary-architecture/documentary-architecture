/*
* measurements
*/
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var scrollThreshold = 180;
var isScrolled = false;
var scrollPosition = 0;
function scrollControl(){
    var pos = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
    if( pos == scrollPosition ){
        return undefined;
    }
    scrollPosition = pos;
    var is = false;
    if( scrollPosition > scrollThreshold ){
        is = true;
    }
    if( isScrolled === is ){
        return isScrolled;
    } else {
        isScrolled = is;
    }
    if( is === true ){
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}

window.onload = function() {
    scrollControl();
    aboutBar = document.getElementById('cda');
}

window.onresize = function(){
    console.log('onresize');
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    scrollControl();
}

window.onscroll = function() {
    scrollControl();
};

var aboutBar;
function toggleAboutBar(){
  document.body.classList.toggle('about-open');
  aboutBar.classList.toggle('open');
}
function openAboutBar(){
  document.body.classList.add('about-open');
  aboutBar.classList.add('open');
}
function closeAboutBar( e ){
  document.body.classList.remove('about-open');
  aboutBar.classList.remove('open');
  e.stopPropagation();
}
