<?php

namespace Kirby\Cms;

use Kirby\Cms\Block;

class DefaultBlock extends Block
{
    public function toProperty()
    {

        $type = $this->type();
        $content = $this->content();
        $data = $this->content()->toArray();

        if ($content->text()->isNotEmpty()) {
            $data['text'] = $content->text()->kirbytext()->value();
        }

        if ($type === 'entities') {
            $type = 'collection';
            foreach ($content->entities()->toEntities() as $item) {
                /**
                 * @todo this mimics the KQL output, which is not really nice, but works for now
                 */
                $data['items'][] = $item->kqlAbstract();
            }
            unset($data['entities']);
        }

        return [
            'type' => $type,
            'content' => $data,
        ];
    }
}
