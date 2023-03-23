<?php

/*
* Entity > Collection
*/
class EntityCollection extends Entity
{

    public function entity(): string
    {
        return 'collection';
    }
    public function theme(): string
    {
        return 'white';
    }
    public function collection()
    {

        // select options
        if ($this->content()->content_collection()->exists()) {

            switch ($this->content_collection()->value()):

                case 'children':
                    return $this->children()->listed();

                case 'contextualized':
                    return $this->contextualized();

                case 'contexts':
                    return $this->contexts();

                case 'pages':
                    $collection = $this->content_pages()->toPages()->listed();
                    if ($collection->count() === 1 && $collection->first()->template('archive')) {

                        // if 1 archive was selected, return all child entities
                        return $collection->first()->children()->listed();
                    }
                    return $collection;

            endswitch;
        }
        // default page behaviour
        if ($this->hasChildren()) {

            return $this->children()->listed();
        }
        return $this->contextualized();
    }
    public function tabHeader(): array
    {
        if ($this->content()->content_text()->isNotEmpty()) {
            $text = $this->content()->content_text()->kirbytext()->value();
        } else {
            $text = $this->content()->description()->kirbytext()->value();
        }
        return [
            'type' => 'header',
            'content' => [
                'h1' => $this->title()->wbr()->value(),
                'h2' => $this->content()->additional_title()->html()->value(),
                'p' => $text
            ]
        ];
    }
    public function tabInfo(): ?array
    {

        $thisInfo = $this->dataProperties();

        if ($this->content()->represents_entity_switch()->isTrue() && $entity = $this->content()->represents_entity()->toEntity()) {
            $entityInfo = array_merge($entity->dataIndividualFields(), $entity->dataProperties());
        } else {
            $entityInfo = [];
        }

        $info = array_values(array_merge($thisInfo, $entityInfo));

        if (empty($info)) {
            return null;
        }

        return [
            'type' => 'table',
            'headline' => 'Info',
            'content' => $info
        ];
    }
    public function dataContent(): array
    {

        $content = [
            $this->tabHeader()
        ];
        if ($this->view() != 'collection') {
            $content[] = $this->tabCollection();
        }
        $content[] = $this->tabInfo();
        $content[] = $this->tabContexts();
        $content[] = $this->tabMeta();
        return array_values(array_filter($content));
    }
    public function content_headline(): Kirby\Cms\Field
    {
        return new Field($this, 'content_headline', 'Collection');
    }
    public function tabCollection(): array
    {

        $layout = $this->content_layout()->or('cards')->value();

        switch ($layout):
            case 'gallery':

                $output = $this->collection()->dataPreview();

                break;
            case 'list':

                $thumbs = 'small';

            case 'entityinfo':
            default:

                $thumbs = 'medium';

                $output = $this->collection()->dataAbstract($thumbs);

                break;
        endswitch;

        return [
            'type' => 'collection',
            'headline' => $this->content_headline()->html()->value(),
            'layout' => $layout,
            'content' => $output
        ];
    }
    public function view(): ?string
    {

        if ($this->content()->content_presentation()->exists() && $this->content()->content_presentation()->isNotEmpty()) {

            return $this->content()->content_presentation()->value();
        }
        return 'collection';
    }
    public function dataView() //: ?array
    {

        switch ($this->view()) {
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
                $pagination = option('cda.matter-of-data.pagination');

                if ($pagination < $count) {

                    $next = $this->url() . '?collection&page=2';
                } else {
                    $next = false;
                }

                $output = $collection->limit($pagination);
                $layout = $this->content_layout()->or('cards')->value();

                $columns = 1;
                if ($this->cardSize()->isNotEmpty()) {
                    if ($this->cardSize()->value() === 'small') {
                        $columns = 2;
                    }
                }

                switch ($layout) {
                    case 'gallery':

                        $output = $output->dataPreview();

                        break;
                    case 'list':

                        $output = $output->dataAbstract('small');

                        break;
                    default:

                        $output = $output->dataAbstract('medium');

                        break;
                }

                return [
                    'type' => 'collection',
                    'headline' => $this->content_headline()->html()->value(),
                    'count' => $count,
                    'layout' => $layout,
                    'columns' => $columns,
                    'page' => 1,
                    'next' => $next,
                    'content' => $output
                ];

                break;

            case 'map':

                // dump( $this->collection()->geoJson() );
                return [
                    'type' => 'map',
                    'headline' => 'Map',
                    'content' => $this->collection()->geoJson()
                ];

                break;
        }
        return null;
    }
}

/*
* Entity > Collection > Liebling House
*/
class LieblingHouseCollection extends EntityCollection
{
    public function type(): string
    {
        return 'liebling-house';
    }
    public function view(): ?string
    {
        return 'liebling-house';
    }
    public function dataView(): ?array
    {

        $url = $this->kirby()->site()->url();
        $assetPath = option('cda.max-liebling-house.path');
        return [
            'type' => 'liebling-house',
            'headline' => 'Virtual 3D World',
            'content' => [
                'worlditemStart' => $this->worlditem(),
                'worlditemsList' => url($url . '/i/liebling-house/worlditems.json'),
                'unityLoader' => url($assetPath . 'Build/UnityLoader.js'),
                'unityJson' => url($assetPath . 'Build/liebling-house-world.json')
            ]
        ];
    }
    public function category(): string
    {

        switch ($this->depth()) {
            case 1:
                return 'overview';
                break;
            case 2:
                return 'tour';
                break;
            default:
                return 'tourstop';
                break;
        }
    }
    public function content_layout(): Kirby\Cms\Field
    {

        switch ($this->depth()) {
            case 1:
                return new Field($this, 'content_layout', 'cards');
                break;
            case 2:
                return new Field($this, 'content_layout', 'list');
                break;
            default:
                return new Field($this, 'content_layout', 'gallery');
                break;
        }
    }
    public function content_headline(): Kirby\Cms\Field
    {

        if ($this->depth() === 1) {
            return new Field($this, 'content_headline', 'Follow a guided Promenade');
        }
        return new Field($this, 'content_headline', '');
    }
    public function dataSet(): array
    {

        $content = $this->dataGeneral();
        $content['content'] = $this->dataContent();
        $content['view'] = $this->dataView();
        if ($this->category() === 'tourstop') {
            $content['pagination'] = $this->dataPagination(1);
        }
        return $content;
    }
    public function dataAbstract(string $srcset = ''): array
    {
        $data = [
            'url' => $this->url(),
            'title' => $this->title()->value(),
            'template' => $this->template()->name(),
            'worlditem' => $this->worlditem(),
            'count' => $this->countCollection()
        ];

        if ($srcset && $thumbnail = $this->thumbnail()) {
            $data['thumbnail'] = $this->thumbnail()->dataThumbnail($srcset);
        }

        return $data;
    }
}
