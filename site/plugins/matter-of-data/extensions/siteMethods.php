<?php

return [

	'archive' => function ($type = false) {
		if ($page = $this->page('archive/' . $type)) {
			return $page;
		}
		return $this->page('archive');
	},

	/**
     * @kql-allowed
     */
	'entitiy' => function ($id) {
		if ($page = $this->page($id)) {
			return $page;
		}
		if ($file = $this->file($id)) {
			return $file->toImageEntity();
		}
		return null;
	},

	'schema' => function (): array {

		$image = $this->image();
		$image = $image ? $image->url() : null;

		$links = [];
		foreach ($this->links()->toStructure() as $link) {
			$links[] = (string)$link->href();
		}

		$members = [];
		foreach ($this->team()->toUsers() as $user) {
			$members[] = [
				'@type' => 'Person',
				'name' => (string)$user->name(),
			];
		}

		return [
			'@context' => 'https://schema.org',
			'@type' => 'Organization',
			'@id' => $this->url(),
			'alternateName' => 'CDA',
			'description' => (string)$this->description(),
			'email' => (string)$this->email(),
			'founder' => [
				'@type' => 'Person',
				'name' => 'Ines Weizman'
			],
			'foundingDate' => '2015',
			'foundingLocation' => [
				'@type' => 'PostalAddress',
				'name' => 'Bauhaus-University Weimar',
				'addressLocality' => 'Weimar',
				'country' => 'Germany',
			],
			'keywords' => $this->tags()->split(),
			'knowsLanguage' => ['en', 'de'],
			'legalName' => 'Centre for Documentary Architecture e.V.',
			'location' => [
				'@type' => 'PostalAddress',
				'addressLocality' => 'Berlin',
				'country' => 'Germany',
			],
			'logo' => $this->url() . '/assets/img/cda-logo-full.svg',
			'member' => $members,
			'additionalType' => 'Researcher',
			'image' => $image,
			'name' => (string)$this->title(),
			'sameAs' => $links,
			'url' => $this->url(),
		];
	},

];
