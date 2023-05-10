<?php

namespace Kirby\Cms;

class EntityItem extends Entity
{

    public function entity(): string
    {
        return 'item';
    }
    
    public function collection()
    {
        return $this->contextualized();
    }

}

class EntityItemPerson extends EntityItem {}
class EntityItemBuilding extends EntityItem {}
class EntityItemObject extends EntityItem {}
class EntityItemMaterial extends EntityItem {}
class EntityItemOrganisation extends EntityItem {}
class EntityItemPublication extends EntityItem {}
class EntityItemEvent extends EntityItem {}
