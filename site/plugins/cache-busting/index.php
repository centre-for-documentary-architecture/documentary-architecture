<?php

/**
* matter-of-data plugin
*/

use Kirby\Cms\App;
use Kirby\Cms\Url;

Kirby::plugin('centre-for-documentary-architecture/cache-busting', [

	'components' => [

		'css' => function (Kirby $kirby, string $url, $options = null): string {
		  // create fingerprint for cache busting
		  // $fingerprint = md5_file($url);
		  // return $url . '?' . $fingerprint;

		  // as suggested by https://forum.getkirby.com/t/plugin-assets-timestamp/13975/27
		  $relative_url = Url::path($url, false);
          $file_root = $kirby->root('index') . DS . $relative_url;

          if (F::exists($file_root)) {
              return url($relative_url . '?' . F::modified($file_root));
          }

		  return $url;

		},

		'js' => function (Kirby $kirby, string $url, $options = null): string {
			// create fingerprint for cache busting
			// $fingerprint = md5_file($url);
			// return $url . '?' . $fingerprint;

			$relative_url = Url::path($url, false);
			$file_root = $kirby->root('index') . DS . $relative_url;

			if (F::exists($file_root)) {
				return url($relative_url . '?' . F::modified($file_root));
			}

			return $url;

		},

	],

]);
