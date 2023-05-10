<?php

namespace Kirby\Cms;

class PageArchive extends Page
{
    
    public function entities()
    {
        return $this->children()->children();
    }

    public function results(string $query = '')
    {

        if (!$query) {
            return $this->kirby()->collection('recentEdits')->listed();
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

    /**
     * Converts images to virtual pages
     */
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