<?php

if( is_array( $data->value()->value() ) ){
	echo implode( ', ', $data->value()->value() );
} else {
	echo $data->value()->kirbytext();
}
