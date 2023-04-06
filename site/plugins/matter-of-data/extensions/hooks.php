<?php

use Kirby\Toolkit\Str;
use Kirby\Filesystem\F;

return [

	'page.changeSlug:after' => function ($newPage, $oldPage) {
		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newPage, $oldPage);
	},

	'page.changeTitle:after' => function ($newPage) {
		$newTitle = $newPage->content()->title()->value();

		$newPage->update([
			'title' => $newTitle
		]);
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

	'file.changeName:after' => function ($newFile, $oldFile) {
		
		if ($newFile->template() != 'file_image') {
			return;
		}

		/*
		* when filename is changed, all pages, where this image is used as thumbnail, should be updated
		*/
		searchReplaceFields($oldFile->id(), $newFile->id(), 'thumbnail');
	},

	'file.create:after' => function ($file) {

		if ($file->template() != 'file_image') {
			return;
		}

		$update = $file->updateDateModified( true, true );

		$name = Str::slug(F::name($file->filename()));
		$exif = $file->exif();

		// prefill date field
		$pattern = "/(?!\D)((1[5-9]|20)[0-9](0s|[0-9]((-(0[1-9]|1[012]))(-(0[1-9]|[12][0-9]|3[01]))?)?))(?=\D)/";
		preg_match($pattern, $name, $matches);

		if (isset($matches[0])) {
			// extract date from filename
			$update['date'] = $matches[0];
		} else if ($timestamp = $exif->timestamp()) {
			// extract date fron exif
			$update['date'] = date('Y-m-d', $timestamp);
		}

		// @todo extract location from exif and save into file
		// if ($exif->location()->lat() && $exif->location()->lng()) {
		// 	$update['location_start'] = Yaml::encode([[
		// 		'lat' => $exif->location()->lat(),
		// 		'lon' => $exif->location()->lng()
		// 	]]);
		// }

		/*
		* sanitize and change name
		* update fields
		*/
		$file->changeName($name)->update($update);
	},

	'file.update:after' => function ($newFile, $oldFile) {
		
		if ($newFile->template() != 'file_image') {
			return;
		}

		$newFile->updateDateModified();

		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newFile, $oldFile);

	},

];
