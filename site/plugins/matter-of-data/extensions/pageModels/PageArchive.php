<?php

namespace Kirby\Cms;

class PageArchive extends Page
{

    public function entities()
    {
        return $this->children()->children();
    }

    /**
     * @todo
     */
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

    public function image(string $filename = null)
    {
        if ($filename === null) {
            return null;
        }
        return parent::image($filename);
    }
}