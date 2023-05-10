<?php

return [

	/**
	 * @kql-allowed
	 */
	'findBySlug' => function ( string $query ) {
		return $this->filter(function ($user) use ($query) {
			return $query == $user->slug();
		})->first();
	},

];
