<?php

namespace Kirby\Cms;

use Kirby\Cms\Collection;

class Entities extends Collection
{

    public function toLinks(): string
    {
        $links = [];
        foreach ($this as $page) {

            $links[] = $page->toLink();
        }
        return implode(', ', $links);
    }

}

class Entity extends Page
{

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
	public function image(?string $filename = null) {

        if( $image = $this->thumbnail()->toFile() ){
            return $image;
        }

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
        if( $this->date()->isEmpty() ){
            $fields[] = 'Date';
        }
        if( $this->intendedTemplate() == 'item_person' && $this->description()->isEmpty() ){
            $fields[] = 'Description';
        }
        if( !$this->image() ){
            $fields[] = 'Image';
        }
        if( $this->location()->isEmpty() && $this->locations()->isEmpty() ){
            $fields[] = 'Location';
        }
        return implode(', ',$fields);
    }

}