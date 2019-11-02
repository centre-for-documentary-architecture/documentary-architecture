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

	// check if this page has contexts at all
	if( $page->content()->contexts()->exists() ){

		// get old and new state
		$oldField = $oldPage->content()->contexts()->yaml();
		$newField = $page->content()->contexts()->yaml();

		// check for those that were listed previously but are not anymore
		$removeFrom = array_diff($oldField, $newField);
		foreach( $removeFrom as $r ){
			// convert to page object
			$removeFromPage = page( $r );
			if( !$removeFromPage ){ continue; }
			// get other pages contextualized entities and remove this
			$contextualized_old = $removeFromPage->content()->contextualized()->yaml();
			$contextualized = array_diff( $contextualized_old, [ $page->id() ] );
			$removeFromPage->update([ 'contextualized' => Yaml::encode( $contextualized ) ]);
		}

		// loop all pages that are listed now
		foreach( $page->content()->contexts()->toPages() as $p ){
			$contextualized = $p->content()->contextualized()->yaml();
			if( !in_array( $page->id(), $contextualized ) ){
				// add to other page, if not listed already
				$contextualized[] = $page->id();
				$p->update([ 'contextualized' => Yaml::encode( $contextualized ) ]);
			}
		}

	}
	// from here on it’s the same but vice versa
	if( $page->content()->contextualized()->exists() ){

		$oldField = $oldPage->content()->contextualized()->yaml();
		$newField = $page->content()->contextualized()->yaml();

		$removeFrom = array_diff($oldField, $newField);
		foreach( $removeFrom as $r ){
			$removeFromPage = page( $r );
			if( !$removeFromPage ){ continue; }

			$contexts_old = $removeFromPage->content()->contexts()->yaml();
			$contexts = array_diff( $contexts_old, [ $page->id() ] );

			$removeFromPage->update([ 'contexts' => Yaml::encode( $contexts ) ]);
		}

		foreach( $page->content()->contextualized()->toPages() as $p ){
			$contexts = $p->content()->contexts()->yaml();
			if( !in_array( $page->id(), $contexts ) ){
				$contexts[] = $page->id();
				$p->update([ 'contexts' => Yaml::encode( $contexts ) ]);
			}
		}

	}

}