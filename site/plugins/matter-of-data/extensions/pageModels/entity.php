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

    public function view()
    {
        return [
            'type' => 'collection',
            'query' => 'page("'.$this->id().'").contextualized.toEntities',
            'layout' => 'cards',
        ];
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

        /**
         * occupation
         * 
         * material
         * manufacturer
         * architects
         * members
         * projects
         * 
         * bio
         * 
         * individual properties
        */

        $properties = [];
        
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
        
        /**
         * convert tags to entities
         */

        $fields = [
            'material' => 'Material',
            'manufacturer' => 'Manufacturer',
            'architects' => 'Architects',
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
         * text
         */

        if ($this->content()->bio()->isNotEmpty()) {
            $properties[] = [
                'type' => 'text',
                'content' => [
                    'title' => 'Bio',
                    'text' => (string)$this->content()->bio()->kirbytext(),
                ],
            ];
        }

        /**
         * individual properties
         */

        $blocks = $this->content()->properties()->toBlocks();
        foreach ($blocks as $block) {
            $properties[] = $block->toProperty();
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
        if ($this->entity() == 'item' && $this->description()->isEmpty()) {
            $fields[] = 'Description';
        }
        if (!$this->image()) {
            $fields[] = 'Thumbnail';
        }

        if ($this->intendedTemplate() == 'item_building' && $this->architects()->isEmpty()) {
            $fields[] = 'Architect';
        }
        if ($this->intendedTemplate() == 'item_object' && $this->material()->isEmpty()) {
            $fields[] = 'Material';
        }
        if ($this->intendedTemplate() == 'item_object' && $this->manufacturer()->isEmpty()) {
            $fields[] = 'Manufacturer';
        }
        if ($this->intendedTemplate() == 'item_organisation' && $this->members()->isEmpty()) {
            $fields[] = 'Members';
        }
        if ($this->intendedTemplate() == 'item_person' && $this->occupation()->isEmpty()) {
            $fields[] = 'Occupation';
        }
        if ($this->intendedTemplate() == 'item_person' && $this->projects()->isEmpty()) {
            $fields[] = 'Projects';
        }
        if ($this->intendedTemplate() == 'item_person' && $this->bio()->isEmpty()) {
            $fields[] = 'Bio';
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
