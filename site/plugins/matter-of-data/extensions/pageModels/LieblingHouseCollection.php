<?php

namespace Kirby\Cms;
use Kirby\Cms\Field;

class LieblingHouseCollection extends EntityCollection
{

    public function type(): string
    {
        return 'liebling-house';
    }

    public function category()
    {
        $values = [
            'liebling-house',
            'overview',
            'tour',
            'tourstop'
        ];
        return new Field($this, 'category', $values[ $this->depth() ]);
    }
    
}
