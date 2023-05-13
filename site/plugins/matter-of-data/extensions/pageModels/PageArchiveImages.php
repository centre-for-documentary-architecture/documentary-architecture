<?php

namespace Kirby\Cms;

class PageArchiveImages extends PageArchive
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
