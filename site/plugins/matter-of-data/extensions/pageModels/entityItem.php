<?php

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
        if( $this->collection()->count() > 0 ){
            return 'collection';
        } else if ( $this->thumbnail() ){
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
        if( $this->date_start()->isNotEmpty() ){
            $dates[] = $this->content()->date_start()->toDateKeyword();
        }
        if( $this->location_start()->isNotEmpty() ){
            $dates[] = $this->content()->location_start()->toLocation();
        }
        if( $dates !== [] ){
            $content[] = [
                'key' => 'Born',
                'value' => implode('<br />', $dates)
            ];
        }

        $dates = [];
        if( $this->date_end()->isNotEmpty() ){
            $dates[] = $this->content()->date_end()->toDateKeyword();

        }
        if( $this->location_end()->isNotEmpty() ){
            $dates[] = $this->content()->location_end()->toLocation();
        }
        if( $dates !== [] ){
            $content[] = [
                'key' => 'Died',
                'value' => implode('<br />', $dates)
            ];
        }

        if( $this->occupation()->isNotEmpty() ){
            $content[] = [
                'key' => 'Occupation',
                'value' => $this->content()->occupation()->toKeywords()
            ];
        }
        if( $this->projects()->isNotEmpty() ){
            $projects = [];
            foreach( $this->projects()->split() as $project ){
                $projects[] = toPageOrKeyword( $project );
            }
            $content[] = [
                'key' => 'Projects',
                'type' => 'collection',
                'value' => $projects
            ];
        }
        if( $this->education()->isNotEmpty() ){
            $values = [];
            foreach( $this->education()->toStructure() as $stop ){
                $ed = $stop->date_start()->toDateKeyword().'. ';
                if( $ed === '. ' ){ $ed = ''; }
                $ed .= $stop->text()->kirbytextinline().', ';
                $ed .= $stop->location()->toLocation(', ');
                $values[] = $ed;
            }
            $content[] = [
                'key' => 'Education',
                'value' => $values
            ];
        }
        if( $this->bio()->isNotEmpty() ){
            $content[] = [
                'key' => 'Bio',
                'value' => $this->content()->bio()->kirbytext()->value()
            ];
        }

		return $content;

    }
}

/*
* Entity > Item > Landmark
*/
class EntityItemLandmark extends EntityItem
{
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->date_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Construction',
                'value' => $this->content()->date_start()->toDateKeyword()
            ];
        }
        if( $this->location_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Location',
                'value' => $this->content()->location_start()->toLocation()
            ];
        }
        if( $this->architects()->isNotEmpty() ){
            $architects = [];
            foreach( $this->content()->architects()->split() as $architect ){
                $architects[] = toPageOrKeyword( $architect );
            }
            $content[] = [
                'key' => 'Architects',
                'value' => implode(', ', $architects)
            ];
        }

		return $content;

    }
    public function entityInfo(): string
    {
        $info = [];

        if( $this->architects()->isNotEmpty() ){
            $architects = [];
            foreach( $this->content()->architects()->split() as $architect ){
                if( $page = $this->kirby()->page( $architect )){
                    $architects[] = $page->title();
                } else {
                    $architects[] = $architect;
                }
            }
            $info[] = implode(', ', $architects );
        }

        if( $this->location_start()->isNotEmpty() ){
            $loc = $this->content()->location_start()->yaml()[0];
            $info[] = implode(', ', array_filter([
                $loc['streetaddress'],
                trim( $loc['postalcode'] .' '. $loc['addresslocality'] ),
                strtoupper( $loc['addresscountry'] )
            ]));
        }

        if( $this->date_start()->isNotEmpty() ){
            $info[] = $this->content()->date_start()->value();
        }

        return implode( '<br />', $info );
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

        if( $this->date_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Production date',
                'value' => $this->content()->date_start()->toDateKeyword()
            ];
        }

        if( $this->material()->isNotEmpty() ){
            $materials = [];
            foreach( $this->content()->material()->split() as $material ){
                $materials[] = toPageOrKeyword( $material );
            }
            $content[] = [
                'key' => 'Material',
                'value' => implode(', ', $materials)
            ];
        }

        if( $this->manufacturer()->isNotEmpty() ){
            $manufacturers = [];
            foreach( $this->content()->manufacturer()->split() as $manufacturer ){
                $manufacturers[] = toPageOrKeyword( $manufacturer );
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
class EntityItemMaterial extends EntityItem
{
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->location_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Origin',
                'value' => $this->content()->location_start()->toLocation()
            ];
        }

		return $content;

    }
}


/*
* Entity > Item > Organisation
*/
class EntityItemOrganisation extends EntityItem
{
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->date_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Founded',
                'value' => $this->content()->date_start()->toDateKeyword()
            ];
        }

        if( $this->date_end()->isNotEmpty() ){
            $content[] = [
                'key' => 'Terminated',
                'value' => $this->content()->date_end()->toDateKeyword()
            ];
        }

        if( $this->location_start()->isNotEmpty() ){
            $locations = [];
            foreach( $this->content()->location_start()->yaml() as $location ){
                $locations[] = toLocation( $location );
            }
            $content[] = [
                'key' => 'Location',
                'value' => implode(', ', $locations)
            ];
        }

        if( $this->members()->isNotEmpty() ){
            $members = [];
            foreach( $this->content()->members()->split() as $member ){
                $members[] = toPageOrKeyword( $member );
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
    public function dataIndividualFields(): array
	{

        $content = [];

        if( $this->date_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Release',
                'value' => $this->content()->date_start()->toDateKeyword()
            ];
        }

        if( $this->content()->credits()->isNotEmpty() ){
            foreach( $this->content()->credits()->yaml() as $credit ){
                $content[] = [
                    'key' => $credit['title'],
                    'value' => $credit['person']
                ];
            }
        }

        if( $this->publisher()->isNotEmpty() ){
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

        if( $this->date_start()->isNotEmpty() ){
            $date = $this->content()->date_start()->toDateKeyword();
            if( $this->date_end()->isNotEmpty() ){
                $date .= ' &minus; '.$this->date_end()->toDateKeyword();
            }
            $content[] = [
                'key' => 'Dates',
                'value' => $date
            ];
        }

        if( $this->location_start()->isNotEmpty() ){
            $content[] = [
                'key' => 'Location',
                'value' => $this->content()->location_start()->toLocation()
            ];
        }

        if( $this->timeline()->isNotEmpty() ){
            $timeline = [];
            foreach( $this->timeline()->yaml() as $event ){

                $date = false;
                if( isset( $event['date_start'] ) ){
                    $date = toDateKeyword( $event['date_start'] );
                    if( isset( $event['date_end'] ) ){
                        if( $end = toDateKeyword( $event['date_end'] ) ){
                            $date .= ' &minus; ' . $end;
                        }
                    }
                }

                $location = false;
                if( isset( $event['location'] ) ){
                    $location = toLocation( $event['location'][0] );
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
