<?php

namespace Kirby\Cms;

use Kirby\Toolkit\Str;

class PageArchive extends Page
{

    public function recentlyEditedPages($unlisted = false)
    {
        $pages = $unlisted ? $this->index() : $this->index()->listed();

        return $pages->sortBy(function ($child) {
            return $child->date_modified()->toObject()->modified()->toDate();
        }, 'desc');

    }

    public function pagesWithIncompleteDataset($unlisted = false)
    {
        $pages = $unlisted ? $this->index() : $this->index()->listed();
        return $pages->filter(function ($child) {

            return $child->date()->isEmpty();
        }, 'desc');
    }

    public function entities()
    {
        return $this->children()->children();
    }

    public function items()
    {
        return $this->children()->listed()->filter(function ($child) {
            return Str::startsWith($child->intendedTemplate(), 'items_');
        });
    }

    public function category(): string
    {
        return '';
    }

    public function filter(string $filter = '')
    {
        if ($found = $this->find($filter)) {
            return $found;
        }
        return $this;
    }

    public function archive()
    {
        return $this->site()->archive();
    }

    /*
    * results
    */

    public function results(string $query = '')
    {

        if ($query === '') {
            return $this->recentlyEditedPages();
        }

        return $this->entities()->listed()->bettersearch($query, [
            'fields' => [
                'title',
                'additional_title',
                'research_methods',
                'tags',
                'content_text',
                'description',
                'category',
                'transcript',
                'credits',
                'date',
                'starring',
                'occupation',
                'sources'
            ]
        ]);
    }

}

class PageArchiveFilter extends PageArchive {}

class PageArchiveImages extends PageArchiveFilter
{

    public function children()
    {
        $images = [];
        foreach ($this->images() as $image) {

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