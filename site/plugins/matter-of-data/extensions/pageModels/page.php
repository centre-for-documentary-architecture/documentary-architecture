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
}
