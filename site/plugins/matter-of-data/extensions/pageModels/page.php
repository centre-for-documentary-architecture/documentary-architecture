<?php

// https://getkirby.com/docs/reference/plugins/extensions/page-models

class HomePage extends Page
{
    public function title(): Kirby\Cms\Field
    {
        // return $this->site()->title();
        return new Field($this, 'title', 'Start');
    }
    public function dataBreadcrumbs(): array
    {
        return [$this->site()->dataAbstract()];
    }
    public function theme(): string
    {
        return '';
    }
    public function json(bool $full = false): array
    {
        $data = parent::json($full);

        $projects = $this->site()->children()->listed()->template(['collection', 'collection_liebling-house']);
        $publications = $this->site()->archive('publications')->highlights()->toPages();

        return array_merge($data, [
            'projects' => $projects->json(),
            'publications' => $publications->json(),
        ]);
    }
}
