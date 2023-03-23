<?php

// https://getkirby.com/docs/reference/plugins/extensions/page-models

// archive
class PageArchive extends Page
{
    public function layout(): string
    {
        return 'multipanel';
    }
    public function template()
    {
        if ($this->template !== null) {
            return $this->template;
        }
        $intended = $this->kirby()->template('archive');
        if ($intended->exists() === true) {
            return $this->template = $intended;
        }
        return $this->template = $this->kirby()->template('default');
    }
    public function recentlyEditedPages($unlisted = false)
    {
        $pages = $unlisted ? $this->index() : $this->index()->listed();
        return $pages->sortBy(function ($child) {
            return $child->date_modified()->toDate();
        }, 'desc');
    }
    public function pagesWithIncompleteDataset($unlisted = false)
    {
        $pages = $unlisted ? $this->index() : $this->index()->listed();
        return $pages->filter(function ($child) {

            return $child->date_new()->isEmpty();
        }, 'desc');
    }
    public function entities()
    {
        return $this->children()->children();
    }
    public function items()
    {
        return $this->children()->listed()->filter(function ($child) {
            return str::startsWith($child->intendedTemplate(), 'items_');
        });
    }
    public function category(): string
    {
        return '';
    }
    public function dataFilters(string $query = ''): array
    {
        $filters = $this->site()->archive()->children()->listed();

        $items = $filters->filter(function ($filter) {
            return $filter->entity() === 'items';
        })->dataAbstract();

        $files = $filters->filter(function ($filter) {
            return $filter->entity() === 'files';
        })->dataAbstract();

        $all = $this->dataAbstract();
        $all['title'] = 'Search all';

        return [
            [
                'buttons' => [$all]
            ],
            [
                'headline' => 'Items',
                'buttons' => $items
            ],
            [
                'headline' => 'Files',
                'buttons' => $files
            ],
        ];
    }
    public function filter(string $filter = '')
    {
        if ($found = $this->find($filter)) {
            return $found;
        }
        return $this;
    }
    public function archive()
    {
        return $this->site()->archive();
    }
    /*
    * results
    */
    public function results(string $query = '')
    {

        if ($query === '') {
            return $this->recentlyEditedPages();
        }

        return $this->entities()->listed()->bettersearch($query, [
            'fields' => ['title', 'additional_title', 'research_methods', 'tags', 'content_text', 'description', 'category', 'transcript', 'credits', 'date_new', 'date_end', 'location_start', 'location_end', 'starring', 'occupation', 'sources']
        ]);
    }
    public function dataAbstract(string $srcset = 'medium')
    {

        $content = [
            'url' => $this->url(),
            'title' => 'CDA ' . $this->title()->value(),
            'template' => 'archive',
            'classlist' => $this->classlist(),
            'filter' => '',
            'worlditem' => null
        ];

        return $content;
    }
}

class PageArchiveFilter extends PageArchive
{
    public function template(): Kirby\Cms\Template
    {
        if ($this->template !== null) {
            return $this->template;
        }
        $intended = $this->kirby()->template('archive');
        if ($intended->exists() === true) {
            return $this->template = $intended;
        }
        return $this->template = $this->kirby()->template('default');
    }
    public function dataAbstract(string $srcset = ''): array
    {

        $content = [
            'url' => $this->parent()->url() . '?filter=' . $this->slug(),
            'filter' => $this->slug(),
            'template' => 'archive',
            'title' => $this->title()->value(),
            'count' => $this->countCollection()
        ];

        return $content;
    }
    public function dataBreadcrumbs(): array
    {
        return $this->parent()->dataBreadcrumbs();
    }
}

class PageArchiveImages extends PageArchiveFilter
{
    public function children()
    {
        $images = [];

        foreach ($this->images() as $image) {

            $images[] = [
                'slug'     => $image->filename(),
                'num'      => 0,
                'model'    => 'file_image',
                'template' => 'file_image',
                'content'  => $image->content()->toArray()
            ];
        }

        return Pages::factory($images, $this);
    }
}
