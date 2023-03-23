<?php

/*
* hooks
* https://getkirby.com/docs/reference/plugins/extensions/hooks
*/



return [

	/*
	* page
	*/
	'page.changeNum:after' => function ($newPage) {
		flushCache($newPage->id());
	},
	'page.changeSlug:after' => function ($newPage, $oldPage) {
		flushCache($newPage->id());
		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newPage, $oldPage);
	},
	'page.changeStatus:after' => function ($newPage) {
		flushCache($newPage->id());
	},
	'page.changeTemplate:after' => function ($newPage) {
		flushCache($newPage->id());
	},
	'page.changeTitle:after' => function ($newPage) {

		flushCache($newPage->id());

		$newTitle = $newPage->content()->title()->value();

		$newPage->update([
			'title' => $newTitle
		]);
	},
	'page.create:after' => function ($page) {
		$update = [];

		if ($page->date_created()->exists()) {
			$update['date_created'] = date('Y-m-d H:i');
		}
		if ($page->user_created()->exists()) {
			$update['user_created'] = Yaml::encode($this->user()->email());
		}

		if (!empty($update)) {
			$page->update($update);
		}
		$page->changeStatus('unlisted');
	},
	'page.delete:after' => function ($page) {
		flushCache($page->id());
	},
	'page.duplicate:after' => function ($duplicatePage) {
		$update = [];

		if ($duplicatePage->date_created()->exists()) {
			$update['date_created'] = date('Y-m-d H:i');
		}
		if ($duplicatePage->date_modified()->exists()) {
			$update['date_modified'] = date('Y-m-d H:i');
		}

		if (!empty($update)) {
			$duplicatePage->update($update);
		}
	},
	'page.update:after' => function ($newPage, $oldPage) {
		$update = [];

		if ($newPage->date_modified()->exists()) {
			// override date
			$update['date_modified'] = date('Y-m-d H:i');
		}
		if ($newPage->user_modified()->exists()) {
			// override user
			$update['user_modified'] = Yaml::encode($this->user()->email());
		}

		if (!empty($update)) {
			$newPage->update($update);
		}

		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newPage, $oldPage);

		flushCache($newPage->id());
	},

	/*
	* file
	*/
	'file.changeName:after' => function ($newFile, $oldFile) {
		if ($newFile->template() != 'file_image') {
			return;
		}

		flushCache($newFile->id());

		/*
		* when filename is changed, all pages, where this image is used as thumbnail, should be updated
		*/
		searchReplaceFields($oldFile->id(), $newFile->id(), 'thumbnail');
	},
	'file.create:after' => function ($file) {
		if ($file->template() != 'file_image') {
			return;
		}

		// basic info
		$update = [
			'date_created' => date('Y-m-d H:i'),
			'user_created' => Yaml::encode($this->user()->email()),
		];

		$name = Str::slug(F::name($file->filename()));
		$exif = $file->exif();

		// prefill date field
		$pattern = "/(?!\D)((1[5-9]|20)[0-9](0s|[0-9]((-(0[1-9]|1[012]))(-(0[1-9]|[12][0-9]|3[01]))?)?))(?=\D)/";
		preg_match($pattern, $name, $matches);

		if (isset($matches[0])) {
			// extract date from filename
			$update['date_new'] = $matches[0];
		} else if ($timestamp = $exif->timestamp()) {
			// extract date fron exif
			$update['date_new'] = date('Y-m-d', $timestamp);
		}

		if ($exif->location()->lat() && $exif->location()->lng()) {
			$update['location_start'] = Yaml::encode([[
				'lat' => $exif->location()->lat(),
				'lon' => $exif->location()->lng()
			]]);
		}

		/*
		* sanitize and change name
		* update fields
		*/
		$file->changeName($name)->update($update);
	},
	'file.delete:after' => function ($file) {
		flushCache($file->id());
	},
	'file.replace:after' => function ($newFile) {
		flushCache($newFile->id());
	},
	'file.update:after' => function ($newFile, $oldFile) {
		if ($newFile->template() != 'file_image') {
			return;
		}

		flushCache($newFile->id());

		$update = [
			'date_modified' => date('Y-m-d H:i'),
			'user_modified' => Yaml::encode($this->user()->email()),
		];

		$newFile->update($update);

		require_once __DIR__ . '/../functions/syncContexts.php';
		syncContexts($newFile, $oldFile);
	},

];
