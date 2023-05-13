<?php

namespace Kirby\Cms;

class EntityFileAudio extends EntityFile
{

    /**
     * @todo
     */
    public function view(): ?string
    {
        if ($this->audio()->count() > 0) {
            return 'audio';
        }
        return null;
    }

    public function fileinfo(): string
    {
        $info = [];
        if ($this->duration()->isNotEmpty()) {
            $info[] = $this->duration();
        }
        if ($file = $this->file()) {
            $info[] = $file->extension();
            $info[] = $file->niceSize();
        }
        return implode(', ', $info);
    }
}
