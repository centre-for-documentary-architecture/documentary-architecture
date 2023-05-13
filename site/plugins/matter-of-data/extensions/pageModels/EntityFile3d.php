<?php

namespace Kirby\Cms;

class EntityFile3d extends EntityFile
{

    /**
     * @todo
     */
    public function view(): ?string
    {
        if ($file = $this->content_files()->toFile()) {
            if ($file->extension() === 'fbx') {
                return '3d';
            }
        }
        return 'image';
    }

    public function fileinfo(): string
    {
        $info = ['fbx'];
        if ($file = $this->content_files()->toFile()) {
            $info[] = $file->niceSize();
        }
        return implode(', ', $info);
    }
}
