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

        $born = '';
        if( $this->date_start()->isNotEmpty() ){
            $born .= $this->content()->date_start()->toDateKeyword();

        }
        if( $this->location_start()->isNotEmpty() ){
            if( $born != '' ){
                $born .= ', ';
            }
            $born .= $this->content()->location_start()->toLocation();
        }
        if( $born != '' ){
            $content[] = [
                'key' => 'Born',
                'value' => $born
            ];
        }

        $died = '';
        if( $this->date_end()->isNotEmpty() ){
            $died .= $this->content()->date_end()->toDateKeyword();

        }
        if( $this->location_end()->isNotEmpty() ){
            if( $died != '' ){
                $died .= ', ';
            }
            $died .= $this->content()->location_end()->toLocation();
        }
        if( $died != '' ){
            $content[] = [
                'key' => 'Died',
                'value' => $died
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
                'value' => implode(', ', $projects)
            ];
        }
        if( $this->bio()->isNotEmpty() ){
            $content[] = [
                'key' => 'Bio',
                'value' => $this->content()->bio()->kirbytext()->value()
            ];
        }
        if( $this->education()->isNotEmpty() ){
            $values = [];
            foreach( $this->education()->toStructure() as $stop ){
                $ed = $stop->date_start()->toDateKeyword().'. ';
                if( $ed === '. ' ){ $ed = ''; }
                $ed .= $stop->text()->kirbytextinline().', ';
                $ed .= $stop->location()->toLocation();
                $values[] = $ed;
            }
            $content[] = [
                'key' => 'Education',
                'value' => $values
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

        $content = [
            [
                'key' => '',
                'value' => $this->declaration()
            ]
        ];

		return $content;

    }
    public function autoDeclaration()
    {
        $content = $this->content('en');

        $declaration = '';

        // Publikation: Author, Author: Title. Subtitle, Publisher, Year

        if( $content->authors()->isNotEmpty() ) {
            $declaration .= $content->authors()->after(': ');
        }

        $declaration .= $this->title().'. ';

        if( $content->additional_title()->isNotEmpty() ) {
            $declaration .= $content->additional_title()->after(', ');
        }

        if( $content->publisher()->isNotEmpty() ) {
            $declaration .= $content->publisher()->after(', ');
        }

        if( $content->date_start()->isNotEmpty() ) {
            $declaration .= $content->date_start();
        }

        return $declaration;
    }
    public function declaration()
    {
        if( $this->content('en')->declaration()->isNotEmpty() ){
            return $this->content('en')->declaration()->value();
        } else {
            return $this->autoDeclaration();
        }
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
                'key' => 'Opening',
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
