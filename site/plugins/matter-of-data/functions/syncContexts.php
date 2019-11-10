<?php

/*
* update contextualized of contexts ;)
*
* when adding contexts to a page, those listed pages shall have this page listed under contextualized
* this bilateral connection needs to be updated when one of those is updated, moved, renamed, duplicated
*/

function syncContexts( $page, $oldPage ){

	/*
	* i agree, this is essentially 2 times the same code block, but not exactly...
	* would be nice to compact it into one
	*/

	$pageId = $page->id();
	$pageContent = $page->content('en');

	// check if this page has contexts at all
	if( $pageContent->contexts()->exists() ){

		// get old and new state
		$oldContexts = $oldPage->content('en')->contexts()->yaml();
		$newContexts = $pageContent->contexts()->yaml();

		// check for those that were listed previously but are not anymore
		$removeFrom = array_diff($oldContexts, $newContexts);
		foreach( $removeFrom as $e ){
			// convert to page object
			$removeFromEntity = entity( $e );
			if( !$removeFromEntity ){ continue; }
			// get other pages contextualized entities and remove this
			$contextualized_old = $removeFromEntity->content('en')->contextualized()->yaml();
			$contextualized = array_diff( $contextualized_old, [ $pageId ] );
			$removeFromEntity->update([ 'contextualized' => Yaml::encode( $contextualized ) ],'en');
		}

		// loop all pages that are listed now
		$addTo = array_diff($newContexts, $oldContexts);
		foreach( $addTo as $e ){
			$addToEntity = entity( $e );
			if( !$addToEntity ){ continue; }

			$contextualized = $addToEntity->content('en')->contextualized()->yaml();
			if( !in_array( $pageId, $contextualized ) ){
				// add to other page, if not listed already
				$contextualized[] = $pageId;
				$addToEntity->update([ 'contextualized' => Yaml::encode( $contextualized ) ],'en');
			}
		}


	}
	// from here on it’s the same but vice versa
	if( $pageContent->contextualized()->exists() ){

		$oldContextualized = $oldPage->content('en')->contextualized()->yaml();
		$newContextualized = $pageContent->contextualized()->yaml();

		$removeFrom = array_diff($oldContextualized, $newContextualized);
		foreach( $removeFrom as $e ){
			$removeFromEntity = entity( $e );
			if( !$removeFromEntity ){ continue; }

			$contexts_old = $removeFromEntity->content('en')->contexts()->yaml();
			$contexts = array_diff( $contexts_old, [ $pageId ] );

			$removeFromEntity->update([ 'contexts' => Yaml::encode( $contexts ) ],'en');
		}

		$addTo = array_diff($newContextualized, $oldContextualized);
		foreach( $addTo as $e ){
			$addToEntity = entity( $e );
			if( !$addToEntity ){ continue; }

			$contexts = $addToEntity->content('en')->contexts()->yaml();
			if( !in_array( $pageId, $contexts ) ){
				$contexts[] = $pageId;
				$addToEntity->update([ 'contexts' => Yaml::encode( $contexts ) ],'en');
			}
		}

	}

}
