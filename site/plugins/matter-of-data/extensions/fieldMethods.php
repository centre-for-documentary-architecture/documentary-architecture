<?php

/*
* fieldMethods
* https://getkirby.com/docs/reference/plugins/extensions/field-methods
*/

return [

	'toLink' => function ($field, $text = false){
		return toLink( $field->value, $text );
	},
	'toKeyword' => function ($field){
		return toKeyword( $field->value );
	},
	'toKeywords' => function ($field){
		return toKeywords( $field->value );
	},
	'toDateKeyword' => function ($field){
		return toDateKeyword( $field->value() );
	},
	'toLocation' => function ($field, $glue = "<br>"){
		return toLocation( $field->yaml()[0], $glue );
	},
	'toUserOrKeyword' => function ($field){
		return toUserOrKeyword( $field->value() );
	},
	'toEntities' => function ($field){
		$entities = new Entities();
		$kirby = kirby();
		foreach ($field->toData('yaml') as $link){
			if( $page = $kirby->page( $link ) ){
				// this is a page
				$entities->add( $page );
			} else if( $image = $kirby->file( $link ) ){
				// this is a file
				$entities->add( $image->toImageEntity() );
			}
		}
		return $entities;
	},
	'toEntity' => function ($field){
		return $field->toEntities()->first();
	},

	'toSources' => function ($field){
		$sources = [];
		foreach( $field->toPages() as $source ){
			$sources[] = toSource( $source->content()->declaration()->value(), $source->content()->website()->value(), $source->content()->title() );
		}
		return $sources;
	},

	'after' => function ($field, $text = ''){

		if ($field->isEmpty()){
            return null;
        }
		$field->value = $field->value() . $text;
		return $field;

	},

	'before' => function ($field, $text = ''){

		if ($field->isEmpty()){
            return null;
        }
		$field->value = $text . $field->value();
		return $field;

	},

	'toSlug' => function ($field){

		if ($field->isEmpty()){
            return null;
        }
		$field->value = Str::slug( $field->value() );
		return $field;

	},

	'wbr' => function ($field){

		if ($field->isEmpty()){
            return null;
        }
		$field->value = wbr( $field->value() );
		return $field;

	},

];
