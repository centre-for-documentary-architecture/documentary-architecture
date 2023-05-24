<?php

namespace Kirby\Cms;

class EntityFileVideo extends EntityFile
{

    public function view()
    {
        $source = $this->remote_file()->toObject();
        $filename = (string)$source->filename();

        if( !$filename && $file = $this->image() ){
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

        $sources = [];
        foreach ($source->sizes()->split() as $size) {
            $url = option('cdn') . '/archive/videos/' . $filename . '/' . $filename . '-' . $size . '.mp4';
            $sources[$size] = $url;
        }

        return [
            'type' => 'video',
            'video' => [
                'sources' => $sources,
                'mime' => 'video/mp4',
                'duration' => $this->content()->duration()->or('1:00')->value()
            ]
        ];
    }

    /**
     * @todo
     */
    public function fileinfo(): string
    {
        $info = ['mp4'];
        if ($this->duration()->isNotEmpty()) {
            $info[] = $this->duration();
        }
        return implode(', ', $info);
    }
}