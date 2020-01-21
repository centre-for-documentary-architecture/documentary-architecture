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
    // console.log('onload');
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
  aboutBar.classList.toggle('open');
}
function openAboutBar(){
  if( document.body.classList.contains('about') ){
    return;
  }
  aboutBar.classList.add('open');
  console.log('oepn');
}
function closeAboutBar( e ){
  aboutBar.classList.remove('open');
  e.stopPropagation();
  console.log('close');
}


/*
* draggables
* https://www.w3schools.com/howto/howto_js_draggable.asp
*/

// Make the DIV element draggable:
// dragElement(document.getElementById("mydiv"));
var draggables = document.getElementsByClassName('draggable');
for (const draggable of draggables) {
    dragElement(draggable);
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var dragArea = elmnt.getElementsByClassName('drag-area');
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
