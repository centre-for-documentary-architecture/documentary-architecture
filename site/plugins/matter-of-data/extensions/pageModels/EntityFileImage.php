<?php

namespace Kirby\Cms;

use Kirby\Cms\Field;

/**
 * Entity > File > Image
 * this class lets an image imitate page behaviour
 */
class EntityFileImage extends EntityFile
{

    public function type(): string
    {
        return 'image';
    }

    public function filename(): string
    {
        return $this->uid();
    }

    public function title(): Field
    {
        return new Field($this, 'title', $this->uid());
    }

    public function view()
    {
        $file = $this->file();

        if ($this->is_360()->isTrue()) {
            return [
                'type' => '360',
                'image' => [
                    'id' => $file->id(),
                    'width' => $file->width(),
                    'height' => $file->height(),
                    'alt' => $file->alt(),
                ],
            ];
        }

        return [
            'type' => 'image',
            'image' => [
                'id' => $file->id(),
                'width' => $file->width(),
                'height' => $file->height(),
                'alt' => $file->alt(),
            ],
        ];
    }

    /**
     * @kql-allowed
     */
    public function transparent(): bool
    {
        if ($this->is_transparent()->isTrue()) {
            return true;
        }
        return in_array($this->category()->toSlug(), [
            'photogrammetry',
            'object',
            '3d-modelling',
        ]);
    }

    /**
     * convert this EntityFileImage back to image object
     */
    public function file(string $filename = null, string $in = 'files'): File
    {
        return $this->kirby()->file($this->id());
    }

    /**
     * @kql-allowed
     * alias to $this->file()
     */
    public function image(string $filename = null): File
    {
        return $this->file();
    }

    /**
     * @kql-allowed
     */
    public function adminUrl(): string
    {
        return $this->file()->panel()->url();
    }
}