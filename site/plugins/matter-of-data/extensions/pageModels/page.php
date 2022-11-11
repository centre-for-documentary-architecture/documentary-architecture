<?php

// https://getkirby.com/docs/reference/plugins/extensions/page-models


class HomePage extends Page
{
    public function title(): Kirby\Cms\Field
    {
        // return $this->site()->title();
        return new Field( $this, 'title', 'Start');
    }
    public function dataBreadcrumbs(): array
	{
        return [ $this->site()->dataAbstract() ];
    }
    public function theme(): string
	{
		return '';
	}
    public function json( bool $full = false ): array
	{
        $data = parent::json( $full );

        $projects = $this->site()->children()->listed()->template(['collection','collection_liebling-house']);
        $publications = $this->site()->archive('publications')->highlights()->toPages();

		return array_merge($data,[
            'header' => [
                'text' => (string)$this->site()->title(),
                'video' => [
                    'sizes' => [
                        1080 => option('cdn').'/assets/videos/CDA-intro-short-1080.mp4',
                        720 => option('cdn').'/assets/videos/CDA-intro-short-720.mp4',
                        480 => option('cdn').'/assets/videos/CDA-intro-short-480.mp4',
                        360 => option('cdn').'/assets/videos/CDA-intro-short-360.mp4'
                    ],
                ]
            ],
            'projects' => $projects->json(),
            'publications' => $publications->json(),
        ]);
	}
}
