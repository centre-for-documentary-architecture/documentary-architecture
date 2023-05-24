<?php

namespace Kirby\Cms;

class EntityFileAudio extends EntityFile
{

    public function view()
    {
        if ($file = $this->audio()->first()) {
            return [
                'type' => 'audio',
                'audio' => [
                    'url' => $file->url(),
                    'mime' => $file->mime(),
                    'duration' => $this->content()->duration()->or('1:00')->value()
                ]
            ];
        }
        return false;
    }

    /**
     * @todo
     */
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
