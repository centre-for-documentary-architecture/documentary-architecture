<?php

namespace Kirby\Cms;

use Kirby\Cms\Collection;

class Entities extends Collection
{

    public function geoJson(): array
    {
        $array = [];
        foreach ($this as $page) {
            if ($geoJson = $page->geoJson()) {
                $array[] = $geoJson;
            }
        }
        return $array;
    }

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
        if ($this->thumbnail()) {
            return 'image';
        }
        return 'collection';
    }

    /*
    * entity concepts
    */
    // public function contexts()
    // {
    //     // entities
    //     return $this->content()->contexts()->toEntities();
    // }

    public function collection()
    {
        if ($this->hasChildren()) {
            return $this->children()->listed();
        }
        return $this->contextualized();
    }

    /**
     * @kql-allowed
     */
	public function countCollection() {
		if ($this->hasChildren()) {
            return $this->children()->count();
        }
		return $this->contextualized()->toEntities()->count() ?? 1;
	}

    public function geoJson(): ?array
    {

        // @todo
        // https://geojson.org
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

        if ($image = $this->thumbnail()) {
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