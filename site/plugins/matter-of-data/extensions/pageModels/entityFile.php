<?php

/*
* Entity > File
*/
class EntityFile extends Entity
{
    public function entity(): string
    {
        return 'file';
    }
    public function view(): ?string
    {
        return 'image';
    }
    public function filename()
    {
        return $this->title();
    }
    public function collection()
    {
        return $this->contexts();
    }
    public function fileinfo(): ?string
    {
        if( $file = $this->file() ){
            return $file->extension() . ', ' . F::nicesize( F::size( $file->root() ));
        }
        return null;
    }
    public function dataSet(): array
	{

        $content = $this->dataGeneral();
        $content['content'] = $this->dataContent();
        $content['view'] = $this->dataView();

        if( $transcript = $this->dataTranscript() ){
            $content['transcript'] = $transcript;
        }

		return $content;

	}
    public function dataContent(): array
	{

		$content = [
            $this->tabHeader(),
            $this->tabInfo(),
            $this->tabContexts(),
			$this->tabMeta()
		];
		return array_values( array_filter( $content ) );

    }
    public function dataTranscript(): ?array
	{

        if( $this->content()->transcript()->isEmpty() ){
            return [];
        }

		return [
            'title' => 'Transcript',
			'html' => $this->content()->transcript()->kirbytext()->value()
		];

    }
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->date_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Date of recording',
                'value' => $this->content()->date_start()->toDateKeyword()
            ];
        }
        if( $this->location_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Place of recording',
                'value' => $this->content()->location_start()->toLocation()
            ];
        }
        if( $this->starring()->isNotEmpty() ){
            $content[] = [
                'key' => 'Starring',
                'value' => $this->content()->starring()->toKeywords()
            ];
        }

		return $content;

    }
}

/*
* Entity > File > Image
* this class lets an image imitate page behaviour
*
*/
class EntityFileImage extends EntityFile
{
    /*
    * general
    */
    public function type(): string
    {
        return 'image';
    }
    public function classlist(): string
	{
		return 'file image '.$this->category();
	}
    public function filename(): string
    {
        return $this->uid();
    }
    public function title(): Kirby\Cms\Field
    {
        return new Field( $this, 'title', $this->uid() );
    }
    public function view(): ?string
    {
        if( $this->content()->is_360()->isTrue() ){

            return 'panorama';

        }
        return 'image';
    }
    public function dataView()
	{

        if ( $this->view() === 'panorama' ) {

            $return = [
                'type' => 'panorama',
                'headline' => 'Panorama',
                'content' => [
                    'url' => $this->thumbnail()->thumb([ 'width' => 4096, 'height' => 2048, 'crop' => true ])->url()
                ]
            ];

        } else {

            $return = [
                'type' => 'image',
                'headline' => 'Preview',
                'content' => [
                    'html' => $this->thumbnail()->responsiveImage('large')
                ]
            ];

        }

        return $return;

    }
    /*
    * files
    */
    public function file( string $filename = null, string $in = 'files' ): Kirby\Cms\File
    {
        return $this->kirby()->file( $this->id() );
    }
    public function image( string $filename = null ): Kirby\Cms\File
    {
        return $this->file();
    }
    public function thumbnail(): Kirby\Cms\File
    {
        return $this->kirby()->file( $this->id() );
    }
    /*
    * panel
    */
    public function panelPath(): string
    {
        return 'files/' . $this->uid();
    }
    public function panelUrl(bool $relative = false): string
    {
        return $this->parent()->panelUrl($relative) . '/' . $this->panelPath();
    }
}

/*
* Entity > File > Video
*/
class EntityFileVideo extends EntityFile
{
    /*
    * general
    */
    public function type(): string
    {
        return 'video';
    }
    public function view(): ?string
    {
        return 'video';
    }
    public function srcset(): ?array
    {

        $sources = $this->content()->remote_file();

        if( !$sources->exists() || $sources->isEmpty() ){
            return [];
        }

        foreach( $sources->yaml() as $source ){

            $sizes = explode( ', ', $source['sizes'] );

            $srcset = [];
            $first = true;

            foreach( $sizes as $size ){

                if( $first === true ){
                    $first = false;
                    $media = '';
                    $width = 9999999;
                } else {
                    $width = ceil( $size / 9 * 16 );
                    $media = 'all and (max-width:'.$width.'px)';
                }

                $url = option('centre-for-documentary-architecture.matter-of-data.cdn') . 'archive/videos/' . $source['filename'] .'/'. $source['filename'] .'-'. $size.'.mp4';

                $srcset[] = [
                    'mime' => 'video/mp4',
                    'url' => $url,
                    'media' => $media,
                    'width' => $width
                ];

            }

            return array_reverse( $srcset );

        }

    }
    public function dataView(): ?array
	{

        $content = [
            'srcset' => $this->srcset()
        ];

        if( $thumbnail = $this->thumbnail() ){
            $content['poster'] = $thumbnail->thumb(['width' => 1920])->url();
        }

        return [
            'type' => 'video',
            'headline' => 'Video',
            'content' => $content
        ];

    }
    public function fileinfo(): ?string
    {
        if( $file = $this->file() ){
            $info = $this->content()->duration()->value(). ', ';
            return $info . $file->extension() . ', ' . F::nicesize( F::size( $file->root() ));
        }
        return null;
    }
}

/*
* Entity > File > 3d
*/
class EntityFile3d extends EntityFile
{
    /*
    * general
    */
    public function type(): string
    {
        return '3d';
    }
    public function view(): ?string
    {

        if( $file = $this->content()->content_files()->toFile() ){
            if( $file->extension() === 'fbx' ){

                return '3d';

            }
        }
        return 'image';

    }
    public function dataView(): ?array
	{

        if( $this->view() === 'image' ){

            return [
                'type' => 'image',
                'headline' => 'Preview',
                'content' => [
                    'html' => $this->thumbnail()->responsiveImage('large')
                ]
            ];

        }

        $url = $this->site()->url();

        return [
            'type' => '3d',
            'headline' => 'Model',
            'content' => [
                'url' => $this->content()->content_files()->toFile()->url(),
            ]
        ];

    }

}

/*
* Entity > File > Audio
*/
class EntityFileAudio extends EntityFile
{
    /*
    * general
    */
    public function type(): string
    {
        return 'audio';
    }
    public function view(): ?string
    {
        if( $this->audio()->count() > 0 ){
            return 'audio';
        }
        return null;
    }
    public function dataView(): ?array
	{

        if( $this->view() != 'audio' ){
            return null;
        }
        $file = $this->audio()->first();

        return [
            'type' => 'audio',
            'headline' => 'Audio',
            'content' => [
                'url' => $file->url(),
                'mime' => $file->mime(),
                'duration' => $this->content()->duration()->or('1:00')->value()
            ]
        ];

    }
    public function fileinfo(): ?string
    {
        if( $file = $this->file() ){
            $info = $this->content()->duration()->value(). ', ';
            return $info . $file->extension() . ', ' . F::nicesize( F::size( $file->root() ));
        }
        return null;
    }
}
