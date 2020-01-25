<?php

/*
* pagesMethods
* https://getkirby.com/docs/reference/plugins/extensions/pages-methods
*/

return [
	'pluckStructure' => function ( $structureField, $innerField = false ) {
		/*
		* needed to suggest autocompletes for fields within structures
		* $field: name of the structure field you want to pluck
		* $innerField: field within the structure field, that you actually want to recieve
		*/
		$structures = $this->pluck( $structureField );
		$return = [];
		foreach( $structures as $structure ){
			foreach( $structure->{$structureField}()->yaml() as $row ){
				if( !$innerField && array_filter($row) ){
					$return[] = $row;
				} else if( $row[$innerField] ){
					$return[] = $row[$innerField];
				}
			}
		}
		return $return;
	},
	'dataAbstract' => function( string $srcset = 'medium' ): array
	{

		$array = [];
		foreach( $this as $page ){

			$array[] = $page->dataAbstract( $srcset );
			
		}
		return $array;
		
	},
	'dataPreview' => function( string $srcset = '' ): array
	{

		$array = [];
        foreach( $this as $page ){

            $item = $page->dataAbstract('large');
            $item['view'] = $page->dataView();
    
            $array[] = $item;

        }
        return $array;
		
	},
	'geoJson' => function (): array
	{

		$array = [];
		foreach( $this as $page ){

			if( $geoJson = $page->geoJson() ){
                $array[] = $geoJson;
            }
			
		}
		return $array;
		
	},

];