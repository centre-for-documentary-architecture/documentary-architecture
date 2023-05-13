<?php

namespace Kirby\Cms;

class EntityFileVideo extends EntityFile
{

    /**
     * @todo
     */
    public function view(): ?string
    {
        return 'video';
    }

    /**
     * @todo
     */
    public function srcset(): ?array
    {

        $sources = $this->remote_file();

        if (!$sources->exists() || $sources->isEmpty()) {
            return [];
        }

        foreach ($sources->yaml() as $source) {

            $sizes = explode(', ', $source['sizes']);

            $srcset = [];
            $first = true;

            foreach ($sizes as $size) {

                if ($first === true) {
                    $first = false;
                    $media = '';
                    $width = 9999999;
                } else {
                    $width = ceil($size / 9 * 16);
                    $media = 'all and (max-width:' . $width . 'px)';
                }

                $url = option('cdn') . '/archive/videos/' . $source['filename'] . '/' . $source['filename'] . '-' . $size . '.mp4';

                $srcset[] = [
                    'mime' => 'video/mp4',
                    'url' => $url,
                    'media' => $media,
                    'width' => $width
                ];
            }

            return array_reverse($srcset);
        }
    }

    public function fileinfo(): string
    {
        $info = ['mp4'];
        if ($this->duration()->isNotEmpty()) {
            $info[] = $this->duration();
        }
        return implode(', ', $info);
    }
}