<?php

// https://getkirby.com/docs/reference/plugins/extensions/page-models

// archive
class PageArchive extends Page
{
    public function template()
    {
        if ($this->template !== null) {
            return $this->template;
        }
        $intended = $this->kirby()->template('archive');
        if ($intended->exists() === true) {
            return $this->template = $intended;
        }
        return $this->template = $this->kirby()->template('default');
    }
    public function recentActivity( $unlisted = false )
    {

        if( !$unlisted ){
            return $this->index()->listed()->sortBy(function ($page) {
                return $page->date_modified()->toDate();
            }, 'desc');
        } else {
            return $this->index()->sortBy(function ($page) {
                return $page->date_modified()->toDate();
            }, 'desc');
        }

    }
    public function entities()
    {
        return $this->children()->children();
    }
    public function items()
    {
        return $this->children()->listed()->filter(function ($child) {
            return str::startsWith($child->intendedTemplate(), 'items_');
        });
    }
    public function category(): string
    {
        return '';
    }
    /*
    * results
    */
    public function results( string $query = '' ){

        if( $query === '' ){
            return $this->recentActivity();
        }

        return $this->index()->listed()->search( $query );

    }
}

class PageArchiveImages extends PageArchive
{

    public function children()
    {
        $images = [];

        foreach ( $this->images() as $image ) {

            $images[] = [
                'slug'     => $image->filename(),
                'num'      => 0,
                'model'    => 'file_image',
                'template' => 'file_image',
                'content'  => $image->content()->toArray()
            ];

        }

        return Pages::factory($images, $this);
    }
}

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
