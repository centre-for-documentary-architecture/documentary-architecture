<?php

namespace Kirby\Cms;

class EntityCollection extends Entity
{

    /**
     * @todo
     */
    public function collection()
    {
        // select options
        if ($this->content_collection()->exists()) {

            switch ($this->content_collection()->value()):

                case 'children':
                    return $this->children()->listed();

                case 'contextualized':
                    return $this->contextualized()->toEntities();

                case 'contexts':
                    return $this->contexts()->toEntities();

                case 'pages':
                    $collection = $this->content_pages()->toPages()->listed();
                    if ($collection->count() === 1 && $collection->first()->intendedTemplate('archive')) {

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
        return $this->contextualized()->toEntities();
    }
}
