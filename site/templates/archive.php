<?php

if( isset($get) ){

  snippet( 'pages/' . $page->intendedTemplate() );

} else {

  snippet('header');
  snippet('footer');

}
