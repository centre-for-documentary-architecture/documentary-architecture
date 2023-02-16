<?php

use Kirby\Cms\Collection;
use Kirby\Cms\Page;
use Kirby\Template\Template;

/*
* Entities
* collection of entities
*/
class Entities extends Collection
{
    public function dataAbstract( string $srcset = 'medium' ): array
    {
        $array = [];
        foreach( $this as $page ){
            $array[] = $page->dataAbstract( $srcset );
        }
        return $array;
    }
    public function dataPreview( string $srcset = '' ): array
    {
        $array = [];
        foreach( $this as $page ){

            $item = $page->dataAbstract('large');
            $item['view'] = $page->dataView();

            $array[] = $item;

        }
        return $array;
    }
    public function geoJson(): array
    {
        $array = [];
		foreach( $this as $page ){

            if( $geoJson = $page->geoJson() ){
                $array[] = $geoJson;
            }

		}
		return $array;
    }
    public function toLinks(): string
    {
        $links = [];
		foreach( $this as $page ){

			$links[] = $page->toLink();

		}
		return implode(', ', $links);
    }
}

/*
* Entity
* such as collection|item|file
*/
class Entity extends Page
{
    public function layout(): string
    {
        return 'multipanel';
    }
    public function view(): ?string
	{

        if( $this->thumbnail() ){
            return 'image';
        }
        return 'collection';

    }
    public function template(): Kirby\Template\Template
    {
        if ($this->template !== null){
            return $this->template;
        }
        $intended = $this->kirby()->template('entity');
        if ($intended->exists() === true){
            return $this->template = $intended;
        }
        return $this->template = $this->kirby()->template('default');
    }
    /*
    * entity concepts
    */
    public function contexts()
	{
		// entities
		return $this->content()->contexts()->toEntities();

    }
    public function contextualized()
	{

		// entities
		return $this->content()->contextualized()->toEntities();

    }
    public function collection()
	{

		if( $this->hasChildren() ){

            return $this->children()->listed();

		}
		return $this->contextualized();

	}
    public function worlditem(): ?string
	{
		// entities
		if( $this->content()->worlditem()->exists() && $this->content()->worlditem()->isNotEmpty() ){

			return $this->content()->worlditem()->value();

		}
		return null;

    }
    /*
    * pagination
    */
    public function dataPagination( int $includeAllSiblings = 0 ): array
	{

		if( $this->hasNextListed() ){
			$next = $this->nextListed()->dataAbstract( '' );
		} else {
			$next = false;
		}

		if( $this->hasPrevListed() ){
			$prev = $this->prevListed()->dataAbstract( '' );
		} else {
			$prev = false;
		}

		$siblings = $this->siblings()->listed();
		$length = $siblings->count();

		if( $includeAllSiblings === 0 ){
			$siblings = false;
		} else {
			$siblings = $siblings->dataAbstract('');
        }

        $parent = $this->parents()->last();

		return [
			'length' => $length,
			'next' => $next,
			'current' => $this->dataAbstract(''),
            'prev' => $prev,
            'parent' => $parent->dataAbstract(''),
			'siblings' => $siblings
		];

    }
    /*
	* data representations
    */
    public function dataSet(): array
	{

        $content = $this->dataGeneral();
        $content['content'] = $this->dataContent();
        $content['view'] = $this->dataView();
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
    /*
    * data tabs
    */
    public function tabHeader(): array
	{

		return [
			'type' => 'header',
			'content' => [
                'h1' => $this->title()->wbr()->value(),
                'h2' => $this->content()->additional_title()->html()->value(),
                'p' => $this->content()->description()->kirbytext()->value()
            ]
		];

    }
    public function tabInfo(): ?array
	{
        $info = array_merge( $this->dataIndividualFields(), $this->dataProperties() );

        // sources todo
        // $sources = $this->content()->sources()->toStructure();
        // if( $sources->count() > 0 ){
        //     $info[] = [
        //         'key' => 'Sources',
        //         'value' => $this->content()->sources_legacy()->toSources()
        //     ];
        // }
        
        if( empty($info) ){
            return null;
        }
		return [
			'type' => 'table',
			'headline' => 'Info',
            'content' => $info
		];

    }
    public function tabContexts(): ?array
	{

        if( $contexts = $this->contexts()->dataAbstract('small') ){} else {
            return null;
        }
		return [
            'type' => 'collection',
            'headline' => 'Contexts',
            'layout' => 'list',
            'columns' => 1,
			'content' => $contexts
		];

    }
    public function tabMeta(): array
	{
        /*
        type
        tags
        credits
        sources (moved to info)
        signature
        created
        modified
        license + download WIP
        */
        // →
        $type = $this->entity();
        $typ = $this->type();
        if( $typ != $type ){
            $type .= '<wbr><i>→</i>' . $typ;
        }
        if( $cat = $this->category() ){
            $type .= '<wbr><i>→</i>' . $cat;
        }
		$content = [
            [
                'key' => 'Type',
                'value' => $type
            ],
            [
                'key' => 'Signature',
                'value' => wbr( $this->id() )
            ]
        ];

        if( $this->content()->credits()->isNotEmpty() ){
            foreach( $this->content()->credits()->yaml() as $credit ){
                $content[] = [
                    'key' => $credit['title'],
                    'value' => $credit['person']
                ];
            }
        }

        if( $this->content()->date_modified()->isNotEmpty() ){
            $content[] = [
                'key' => 'Dataset modified',
                'value' => $this->date_modified()->toDateKeyword()
            ];
        }
        if( $this->content()->date_created()->isNotEmpty() ){
            $content[] = [
                'key' => 'Dataset created',
                'value' => $this->date_created()->toDateKeyword()
            ];
        }

        if( $this->research_methods()->isNotEmpty() ){
            $content[] = [
                'key' => 'Keywords',
                'value' => $this->content()->research_methods()->toKeywords()
            ];
        }

        if( $this->copyright()->isNotEmpty() ){
            $content[] = [
                'key' => 'Copyright',
                'value' => $this->content()->copyright()->value()
            ];
        }

        /*
        license ?
        if( $this->license()->isNotEmpty() ){
            $content[] = [
                'key' => 'License',
                'value' => $this->content()->license()->split()
            ];
        }
        */

        if( $this->entity() === 'file' && $fileinfo = $this->fileinfo() ){
            $content[] = [
                'key' => 'File',
                'value' => $fileinfo
            ];
        }

		return [
			'type' => 'table',
			'headline' => 'Meta',
			'content' => $content
		];

    }
    /*
    * data fields
    */
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->date_new()->isNotEmpty() ){
            $content[] = [
                'key' => 'Date',
                'value' => $this->date_new()->toDateKeyword()
            ];
        }
        if( $this->location_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Location start',
                'value' => $this->location_start()->toLocation()
            ];
        }

		return $content;

    }
    public function dataProperties(): array
	{
		$content = [];
        foreach( $this->properties()->toBlocks() as $block ){
            $title = false;
            $value = false;

            if( $block->title()->isNotEmpty() ){
                $title = (string)$block->title();
            }
            if( $block->type() === 'text' && $block->text()->isNotEmpty() ){
                $value = (string)$block->text()->kirbytext();
            }
            if( $block->type() === 'entities' ){
                $value = '';
                foreach( $block->entities()->toPages() as $entity ){
                    $value .= Html::tag('p',[
                        Html::tag('a', $entity->title(), [
                            'href' => $entity->url()
                        ])
                    ]);
                }
            }

            if( !$value ){
                continue;
            }
            $content[] = [
                'key' => $title,
                'value' => $value
            ];
        }
		return $content;
    }
    /*
    * view
    */
    public function dataView()
	{

        switch ( $this->view() ){
            case 'image':

                return [
                    'type' => 'image',
                    'headline' => 'Preview',
                    'content' => [
                        'html' => $this->thumbnail()->responsiveImage('large')
                    ]
                ];

                break;

            case 'collection':

                $collection = $this->collection();
                $count = $collection->count();
                $pagination = option('centre-for-documentary-architecture.matter-of-data.pagination');

                if( $pagination < $count ){

                    $next = $this->url().'?collection&page=2';

                } else {
                    $next = false;
                }

                return [
                    'type' => 'collection',
                    'headline' => 'Collection',
                    'total' => $count,
                    'layout' => 'cards',
                    'page' => 1,
                    'next' => $next,
                    'content' => $collection->limit( $pagination )->dataAbstract('large')
                ];

                break;

        }
        return null;

    }
    public function geoJson(): ?array
    {

        // https://geojson.org
        if( !$this->content()->location_start()->exists() ){
            return null;
        }

        $loc = $this->content()->location_start()->yaml();
        if( !isset( $loc[0] ) ){
            return null;
        }
        if( !$loc[0]['lon'] || !$loc[0]['lat'] ){
            return null;
        }

        $properties = $this->dataAbstract('small');
        $properties['location'] = $loc[0];

        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [ $loc[0]['lon'], $loc[0]['lat'] ]
            ],
            'properties' => $properties
        ];

    }

    public function schema(): array {
        $schema = array_merge( parent::schema(),[
            'headline' => (string)$this->additional_title(),
            'dateModified' => $this->date_modified()->toDate('Y-m-d'),
            'datePublished' => $this->date_created()->toDate('Y-m-d'),
            'description' => (string)$this->description(),
            'editor' => [],
        ]);

        if( $this->copyright()->isNotEmpty() ){
            $schema['copyrightYear'] = $this->date_created()->toDate('Y-m-d');
            $schema['copyrightHolder'] = (string)$this->copyright();
        }
        
        if( $user = $this->user_modified()->toUser() ){
            $schema['editor'][] = [
                '@type' => 'Person',
                'name' => (string)$user->name(),
            ];
        }

        if( $image = $this->thumbnail() ){
            $schema['image'] = $image->url();
        }

        return $schema;
    }

}



class EntitySource extends Page
{
    public function declaration(): Kirby\Cms\Field
    {
        return $this->content()->declaration()->or( $this->title() );
    }
}
