<?php

namespace Kirby\Cms;

class EntityFile3d extends EntityFile
{

    public function view()
    {
        if ($file = $this->content_files()->toFile()) {
            if ($file->extension() === 'fbx') {
                return [
                    'type' => '3d',
                    '3d' => [
                        'fbx' => $file->url()
                    ]
                ];
            }
        }
        if( $file = $this->image() ){
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
        return false;
    }

    /**
     * @todo
     */
    public function fileinfo(): string
    {
        $info = ['fbx'];
        if ($file = $this->content_files()->toFile()) {
            $info[] = $file->niceSize();
        }
        return implode(', ', $info);
    }
}
