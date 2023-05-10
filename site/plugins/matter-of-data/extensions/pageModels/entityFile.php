<?php

namespace Kirby\Cms;
use Kirby\Cms\Field;

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

    /**
     * @todo
     */
    public function view(): ?string
    {
        if ($this->is_360()->isTrue()) {
            return 'panorama';
        }
        return 'image';
    }

    /**
	 * @kql-allowed
	 */
	public function transparent(): bool {
		if( $this->is_transparent()->isTrue() ){
			return true;
		}
		return in_array( $this->category()->toSlug(), [
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
