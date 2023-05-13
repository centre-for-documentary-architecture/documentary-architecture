<?php

namespace Kirby\Cms;

class Entity extends Page
{

    public function entity(): string
    {
        return explode('_', $this->intendedTemplate())[0];
    }

    public function type(): string
    {
        return explode('_', $this->intendedTemplate())[1];
    }

    /**
     * @todo
     */
    public function view(): ?string
    {
        if ($this->image()) {
            return 'image';
        }
        return 'collection';
    }

    /**
     * @kql-allowed
     */
    public function image(?string $filename = null)
    {
        if ($image = $this->thumbnail()->toFile()) {
            return $image;
        }
    }

    /**
     * @kql-allowed
     */
    public function properties(): array
    {
        $blocks = $this->content()->properties()->toBlocks();

        $properties = [];
        foreach ($blocks as $block) {
            $properties[] = $block->toProperty();
        }

        /**
         * convert tags to entities
         */

        $fields = [
            'architects' => 'Architects',
            'material' => 'Material',
            'manufacturer' => 'Manufacturer',
            'members' => 'Members',
            'projects' => 'Projects',
        ];

        foreach ($fields as $field => $title) {
            if ($this->content()->$field()->isNotEmpty()) {
                $properties[] = [
                    'type' => 'collection',
                    'content' => [
                        'title' => $title,
                        'items' => $this->content()->$field()->tagsToEntities(),
                    ],
                ];
            }
        }

        /**
         * convert tags to text
         */

        $fields = [
            'occupation' => 'Occupation',
        ];

        foreach ($fields as $field => $title) {
            if ($this->content()->$field()->isNotEmpty()) {
                $properties[] = [
                    'type' => 'text',
                    'content' => [
                        'title' => $title,
                        'text' => (string)$this->content()->$field(),
                    ],
                ];
            }
        }

        if ($this->content()->bio()->isNotEmpty()) {
            $properties[] = [
                'type' => 'text',
                'content' => [
                    'title' => 'Bio',
                    'text' => (string)$this->content()->bio()->kirbytext(),
                ],
            ];
        }

        return $properties;
    }

    /**
     * @todo
     * https://geojson.org
     */
    public function geoJson(): ?array
    {

        if (!$this->content()->location_start()->exists()) {
            return null;
        }

        $loc = $this->content()->location_start()->yaml();
        if (!isset($loc[0])) {
            return null;
        }
        if (!$loc[0]['lon'] || !$loc[0]['lat']) {
            return null;
        }

        $properties = $this->dataAbstract('small');
        $properties['location'] = $loc[0];

        return [
            'type' => 'Feature',
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [$loc[0]['lon'], $loc[0]['lat']]
            ],
            'properties' => $properties
        ];
    }

    public function schema(): array
    {

        $modified = $this->date_modified()->toObject();

        $schema = array_merge(parent::schema(), [
            'headline' => (string)$this->additional_title(),
            'dateModified' => $modified->modified()->toDate('Y-m-d'),
            'datePublished' => $modified->created()->toDate('Y-m-d'),
            'description' => (string)$this->description(),
        ]);

        if ($this->copyright()->isNotEmpty()) {
            $schema['copyrightYear'] = $modified->created()->toDate('Y-m-d');
            $schema['copyrightHolder'] = (string)$this->copyright();
        }

        if ($image = $this->image()) {
            $schema['image'] = $image->url();
        }

        return $schema;
    }

    public function emptyFields()
    {
        $fields = [];
        if ($this->date()->isEmpty()) {
            $fields[] = 'Date';
        }
        if ($this->intendedTemplate() == 'item_person' && $this->description()->isEmpty()) {
            $fields[] = 'Description';
        }
        if (!$this->image()) {
            $fields[] = 'Image';
        }
        /**
         * @todo some items have a locations or timeline field instead of location
         */
        if ($this->location()->toLocation() === false) {
            $fields[] = 'Location';
        }
        return implode(', ', $fields);
    }
}
