<?php

/*
* hooks
* https://getkirby.com/docs/reference/plugins/extensions/hooks
*/



return [

	/*
	* page
	*/
	'page.create:after' => function ($page) {
		$update = [];

		if( $page->date_created()->exists() ){
			$update['date_created'] = date('Y-m-d H:i');
		}
		if( $page->user_created()->exists() ){
			$update['user_created'] = Yaml::encode( $this->user()->email() );
		}
		if( $page->protocol()->exists() ){
			// add first entry to protocol
			$update['protocol'] = Yaml::encode([[
				'date' => date('Y-m-d H:i'),
				'user' => $this->user()->email(),
				'comment' => 'Created'
			]]);
		}
		if( $page->properties()->exists() && $page->depth() > 1 && $page->parent()->type_properties()->exists() ){
			// copy defaults from parent
			$update['properties'] = $page->parent()->type_properties();
		}

		if( !empty( $update ) ){
			$page->update( $update, 'en');
		}
		$page->changeStatus('unlisted');
	},

	'page.update:after' => function ( $page, $oldPage ) {
		$update = [];

		if( $page->date_modified()->exists() ){
			// override date
			$update['date_modified'] = date('Y-m-d H:i');
		}
		if( $page->user_modified()->exists() ){
			// override user
			$update['user_modified'] = Yaml::encode( $this->user()->email() );
		}
		if( $page->protocol()->exists() ){
			$protocol = $page->protocol()->yaml();

			/*
			* I tried to collect all the fields that were actually updated and wanted to list them in the comment,
			* but that seems to be really hard.
			* for now, it should be enough to only say "Updated", when:
			* - the last user is the same as right now
			* - the last edit is more than 15 mins ago
			*/

			$last = array_pop( $protocol );
			$new = [
				'date' => date('Y-m-d H:i'),
				'user' => $this->user()->email(),
				'comment' => 'Update'
			];

			if( $last['user'][0] === $this->user()->email() ){
				/*
				* same user as last update
				*/
				if( time() > ( strtotime( $last['date'] ) + (60*30) )){
					/*
					* last update more than 30 mins ago,
					* keep the last update and insert a new one
					*/
					$protocol[] = $last;
				} else {
					/*
					* last update only few mins ago,
					* edit the last one
					*/
					$new['date'] = $last['date'];
					$new['comment'] = $last['comment'];
				}
			} else {
				/*
				* all new update
				*/
				$protocol[] = $last;
			}

			$protocol[] = $new;
			$update['protocol'] = Yaml::encode( $protocol );
		}

		if( !empty( $update ) ){
			$page->update( $update, 'en');
		}

		if( $page->intendedTemplate() === 'item_source' || $page->intendedTemplate() === 'item_publication' ){
			if ( $page->content('en')->declaration()->isEmpty() ){
				$page->update([
					'declaration' => $page->autoDeclaration()
				], 'en');
			}
		}

		require_once __DIR__.'/../functions/syncContexts.php';
		syncContexts( $page, $oldPage );

	},
	'page.duplicate:after' => function ( $page, $oldPage ) {
		$update = [];

		if( $page->date_created()->exists() ){
			$update['date_created'] = date('Y-m-d H:i');
		}
		if( $page->date_modified()->exists() ){
			$update['date_modified'] = date('Y-m-d H:i');
		}

		if( !empty( $update ) ){
			$page->update( $update, 'en');
		}

		require_once __DIR__.'/../functions/syncContexts.php';
		syncContexts( $page, $oldPage );
	},
	'page.changeSlug:after' => function ( $page, $oldPage ) {
		require_once __DIR__.'/../functions/syncContexts.php';
		syncContexts( $page, $oldPage );
	},
	'page.changeTitle:after' => function ($newPage, $oldPage) {

		$currentLang = $newPage->kirby()->languageCode();
		$newTitle = $newPage->content( $currentLang )->title()->value();

		foreach( $newPage->kirby()->languages()->codes() as $lang ){
			if( $currentLang === $lang ){
				continue;
			}
			$newPage->update( [
				'title' => $newTitle
			], $lang );
		}

	},

	/*
	* file
	*/
	'file.create:after' => function( $file ){
		if( $file->template() != 'file_image' ){
			return;
		}

		// basic info
		$update = [
			'date_created' => date('Y-m-d H:i'),
			'user_created' => Yaml::encode( $this->user()->email() ),
		];

		// add protocol
		$update['protocol'] = Yaml::encode([[
			'date' => $update['date_created'],
			'user' => $update['user_created'],
			'comment' => 'Uploaded'
		]]);

		// reconstruct properties from parent page
		if( $file->properties()->exists() && $file->parent()->type_properties()->exists() ){
			// copy defaults from parent
			$update['properties'] = $file->parent()->type_properties();
		}

		$name = Str::slug( F::name( $file->filename() ) );
		$exif = $file->exif();

		// prefill date field
		$pattern = "/(?!\D)((1[5-9]|20)[0-9](0s|[0-9]((-(0[1-9]|1[012]))(-(0[1-9]|[12][0-9]|3[01]))?)?))(?=\D)/";
		preg_match( $pattern, $name, $matches);

		if( isset( $matches[0] ) ){
			// extract date from filename
			$update['date_start'] = $matches[0];
		} else if( $timestamp = $exif->timestamp() ){
			// extract date fron exif
			$update['date_start'] = date( 'Y-m-d', $timestamp );
		}

		if( $exif->location()->lat() && $exif->location()->lng() ){
			$update['location_start'] = Yaml::encode([[
				'lat' => $exif->location()->lat(),
				'lon' => $exif->location()->lng()
			]]);
		}

		/*
		* sanitize and change name
		* update fields
		*/
		$file->changeName( $name )->update( $update, 'en' );

	},
	'file.update:after' => function ( $file, $oldFile ) {
		if( $file->template() != 'file_image' ){
			return;
		}

		$update = [
			'date_modified' => date('Y-m-d H:i'),
			'user_modified' => Yaml::encode( $this->user()->email() ),
		];


		$protocol = $file->protocol()->yaml();
		$last = array_pop( $protocol );
		$new = [
			'date' => $update['date_modified'],
			'user' => $update['user_modified'],
			'comment' => 'Update'
		];
		if( $last['user'][0] === $this->user()->email() ){
			/*
			* same user as last update
			*/
			if( time() > ( strtotime( $last['date'] ) + (60*30) )){
				/*
				* last update more than 30 mins ago,
				* keep the last update and insert a new one
				*/
				$protocol[] = $last;
			} else {
				/*
				* last update only few mins ago,
				* edit the last one
				*/
				$new['date'] = $last['date'];
				$new['comment'] = $last['comment'];
			}
		} else {
			/*
			* all new update
			*/
			$protocol[] = $last;
		}
		$protocol[] = $new;
		$update['protocol'] = Yaml::encode( $protocol );


		$file->update( $update, 'en');

		// require_once __DIR__.'/../syncContexts.php';
		// syncContexts( $file, $oldFile );
	},
	'file.changeName:after' => function ($file, $oldFile) {
		if( $file->template() != 'file_image' ){
			return;
		}

		/*
		* when filename is changed, all pages, where this image is used as thumbnail, should be updated
		*/
		searchReplaceFields( $oldFile->id(), $file->id(), 'thumbnail' );

	}

];
