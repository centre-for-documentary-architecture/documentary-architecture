<?php

use Kirby\Toolkit\Str;
use Kirby\Filesystem\F;

return [

	'page.changeSlug:after' => function ($newPage, $oldPage) {
		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newPage, $oldPage);
	},

	'page.changeTitle:after' => function ($newPage) {
		$newPage->updateDateModified( true );
	},

	'page.create:after' => function ($page) {
		$page->updateDateModified( true );
	},

	'page.duplicate:after' => function ($duplicatePage) {
		$duplicatePage->updateDateModified( true );
	},

	'page.update:after' => function ($newPage, $oldPage) {
		$newPage->updateDateModified();

		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newPage, $oldPage);
	},

	'file.create:after' => function ($file) {
		if ($file->template() == 'file_image') {
			
			$filename = Str::slug( F::name( $this->filename() ) );

			$update = $file->updateDateModified( true, true );
			
			$date = $file->extractDateFromFilenameOrExif( $filename );
			if( $date ){
				$update['date'] = $date;
			}

			$file->changeName($filename)->update($update);

		}		
	},

	'file.update:after' => function ($newFile, $oldFile) {
		if ($newFile->template() == 'file_image') {

			$newFile->updateDateModified();

			require_once __DIR__ . '/../functions/syncContexts.php';
			syncContexts($newFile, $oldFile);

		}
	},

];
