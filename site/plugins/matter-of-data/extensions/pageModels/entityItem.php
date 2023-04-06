<?php

namespace Kirby\Cms;

/*
* Entity > Item
*/
class EntityItem extends Entity
{
    public function entity(): string
    {
        return 'item';
    }
    public function view(): ?string
    {
        if ($this->collection()->count() > 0) {
            return 'collection';
        } else if ($this->thumbnail()) {
            return 'image';
        }
        return null;
    }
    public function collection()
    {
        return $this->contextualized();
    }
}

/*
* Entity > Item > Person
*/
class EntityItemPerson extends EntityItem
{
    public function dataIndividualFields(): array
    {

        $content = [];

        $dates = [];
        if ($this->date()->isNotEmpty()) {
            $dates[] = $this->date()->toDateKeyword();
        }
        if ($dates !== []) {
            $content[] = [
                'key' => 'Born',
                'value' => implode('<br />', $dates)
            ];
        }

        $dates = [];
        if ($dates !== []) {
            $content[] = [
                'key' => 'Died',
                'value' => implode('<br />', $dates)
            ];
        }

        if ($this->occupation()->isNotEmpty()) {
            $content[] = [
                'key' => 'Occupation',
                'value' => $this->content()->occupation()->toKeywords()
            ];
        }
        if ($this->projects()->isNotEmpty()) {
            $projects = [];
            foreach ($this->content()->projects()->split() as $project) {
                if ($entity = entity($project)) {
                    $projects[] = $entity->dataAbstract();
                } else {
                    $projects[] = keywordDataAbstract($project);
                }
            }
            $content[] = [
                'key' => 'Projects',
                'type' => 'collection',
                'value' => $projects
            ];
        }
        if ($this->bio()->isNotEmpty()) {
            $content[] = [
                'key' => 'Bio',
                'value' => $this->content()->bio()->kirbytext()->value()
            ];
        }

        return $content;
    }
}

/*
* Entity > Item > building
*/
class EntityItemBuilding extends EntityItem
{
    public function dataIndividualFields(): array
    {

        $content = [];

        if ($this->date()->isNotEmpty()) {
            $content[] = [
                'key' => 'Construction',
                'value' => $this->content()->date()->toDateKeyword()
            ];
        }
        if ($this->architects()->isNotEmpty()) {
            $architects = [];
            foreach ($this->content()->architects()->split() as $architect) {
                if ($entity = entity($architect)) {
                    $architects[] = $entity->dataAbstract();
                } else {
                    $architects[] = keywordDataAbstract($architect);
                }
            }
            $content[] = [
                'key' => 'Architects',
                'type' => 'collection',
                'value' => $architects
            ];
        }

        return $content;
    }
    public function entityInfo(): string
    {
        $info = [];

        if ($this->architects()->isNotEmpty()) {
            $architects = [];
            foreach ($this->content()->architects()->split() as $architect) {
                if ($page = $this->kirby()->page($architect)) {
                    $architects[] = $page->title();
                } else {
                    $architects[] = $architect;
                }
            }
            $info[] = implode(', ', $architects);
        }

        if ($this->location()->isNotEmpty()) {
            $loc = $this->content()->location()->yaml()[0];
            $info[] = implode(', ', array_filter([
                $loc['streetaddress'],
                trim($loc['postalcode'] . ' ' . $loc['addresslocality']),
                strtoupper($loc['addresscountry'])
            ]));
        }

        if ($this->date_new()->isNotEmpty()) {
            $info[] = $this->content()->date_new()->value();
        }

        return implode('<br />', $info);
    }
}

/*
* Entity > Item > Object
*/
class EntityItemObject extends EntityItem
{
    public function dataIndividualFields(): array
    {

        $content = [];

        if ($this->date()->isNotEmpty()) {
            $content[] = [
                'key' => 'Production date',
                'value' => $this->content()->date()->toDateKeyword()
            ];
        }

        if ($this->material()->isNotEmpty()) {
            $materials = [];
            foreach ($this->content()->material()->split() as $material) {
                $materials[] = toPageOrKeyword($material);
            }
            $content[] = [
                'key' => 'Material',
                'value' => implode(', ', $materials)
            ];
        }

        if ($this->manufacturer()->isNotEmpty()) {
            $manufacturers = [];
            foreach ($this->content()->manufacturer()->split() as $manufacturer) {
                $manufacturers[] = toPageOrKeyword($manufacturer);
            }
            $content[] = [
                'key' => 'Manufacturer',
                'value' => implode(', ', $manufacturers)
            ];
        }

        return $content;
    }
}

/*
* Entity > Item > Material
*/
class EntityItemMaterial extends EntityItem {}


/*
* Entity > Item > Organisation
*/
class EntityItemOrganisation extends EntityItem
{
    public function dataIndividualFields(): array
    {

        $content = [];

        if ($this->date()->isNotEmpty()) {
            $content[] = [
                'key' => 'Founded',
                'value' => $this->date()->toDateKeyword()
            ];
        }

        if ($this->date_end()->isNotEmpty()) {
            $content[] = [
                'key' => 'Terminated',
                'value' => $this->content()->date_end()->toDateKeyword()
            ];
        }

        if ($this->location_start()->isNotEmpty()) {
            $locations = [];
            foreach ($this->content()->location_start()->yaml() as $location) {
                $locations[] = toLocation($location);
            }
            $content[] = [
                'key' => 'Location',
                'value' => implode(', ', $locations)
            ];
        }

        if ($this->members()->isNotEmpty()) {
            $members = [];
            foreach ($this->content()->members()->split() as $member) {
                $members[] = toPageOrKeyword($member);
            }
            $content[] = [
                'key' => 'Members',
                'value' => implode(', ', $members)
            ];
        }

        return $content;
    }
}


class EntityItemPublication extends EntityItem
{
    public function theme(): string
    {
        return 'white';
    }
    public function dataIndividualFields(): array
    {

        $content = [];

        if ($this->date()->isNotEmpty()) {
            $content[] = [
                'key' => 'Release',
                'value' => $this->content()->date()->toDateKeyword()
            ];
        }

        if ($this->content()->details()->isNotEmpty()) {
            foreach ($this->content()->details()->yaml() as $credit) {
                $content[] = [
                    'key' => $credit['title'],
                    'value' => $credit['person']
                ];
            }
        }

        if ($this->publisher()->isNotEmpty()) {
            $content[] = [
                'key' => 'Published by',
                'value' => $this->publisher()->value()
            ];
        }

        return $content;
    }
}

/*
* Entity > Item > Event
*/
class EntityItemEvent extends EntityItem
{
    public function dataIndividualFields(): array
    {

        $content = [];

        if ($this->date()->isNotEmpty()) {
            $date = $this->content()->date()->toDateKeyword();
            if ($this->date_end()->isNotEmpty()) {
                $date .= ' &minus; ' . $this->date_end()->toDateKeyword();
            }
            $content[] = [
                'key' => 'Dates',
                'value' => $date
            ];
        }

        if ($this->timeline()->isNotEmpty()) {
            $timeline = [];
            foreach ($this->timeline()->yaml() as $event) {

                $date = false;

                $location = false;
                if (isset($event['location'])) {
                    $location = toLocation($event['location'][0]);
                }

                $timeline[] = implode('<br />', [$date, $location]);
            }
            $content[] = [
                'key' => 'Timeline',
                'value' => $timeline
            ];
        }

        return $content;
    }
}
