<?php

namespace Kirby\Cms;

class EntityFile extends Entity
{

    public function filename()
    {
        return $this->title();
    }

    public function fileinfo(): string
    {
        $info = [];
        if ($file = $this->file()) {
            $info[] = $file->extension();
            $info[] = $file->niceSize();
        }
        return implode(', ', $info);
    }

    public function dataTranscript(): ?array
    {
        $transcripts = $this->transcript()->toStructure();
        if ($transcripts->count() < 1) {
            return null;
        }

        $content = [];
        foreach ($transcripts as $transcript) {
            $content[] = [
                'language' => (string)$transcript->language(),
                'text' => (string)$transcript->text()->kirbytext()
            ];
        }

        return $content;
    }
}