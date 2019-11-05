<?php

$classlist = [];
if( isset( $class ) ){
	$classlist[] = $class;
}

if( isset( $open ) ){
	$classlist[] = 'open';
}

$type = $page->entityType();
$file = false;

switch ($type[0]){
	case 'file':
		switch ($type[1]){
			case '3d':
				$file = $page->content_files()->toFile();
				break;
			case 'video':
				$file = $page->videos()->first();
				break;
			default:
				$file = $page->file();
				break;
		}
		break;
	default:
		$file = $page->thumbnail();
		break;
}

?>
<section class="section accordion meta card <?= implode(' ',$classlist) ?>">
	<h3 class="section--header">Meta</h3>
	<dl class="section--content table">

		<dt>Type</dt>
		<dd>
			<?php
			$category = $page->entityType();
			if( $page->category()->isNotEmpty() ){
				$category[] =  $page->category()->value();
			}
			echo toKeywords( $category, false, ' / ');
			?>
		</dd>

		<?php if( $page->tags()->isNotEmpty() ): ?>
			<dt>Tags</dt>
			<dd><?= $page->tags()->toKeywords() ?></dd>
		<?php endif ?>

		<?php
		$credits = $page->credits()->toStructure();
		if( $credits->count() > 0 ): ?>
			<dt class="fullwidth">Credits</dt>
			<dd class="fullwidth">
			<?php
			foreach( $credits as $item ): ?>
				<div>
				<?php if( $item->person()->isEmpty() ){
					continue;
				}
				$users = $item->person()->split();
				foreach( $users as $i => $user ){
					$users[$i] = toUserOrKeyword( $user );
				}
				$users = implode( ', ', $users );
				if( $item->title()->isNotEmpty() ){
					echo $item->title().': '.$users;
				} else {
					echo $users;
				}
				?>
				</div>
			<?php endforeach; ?>
			</dd>
		<?php endif; ?>

		<?php
		$sources = $page->sources()->toEntities();
		if( $sources->count() > 0 ): ?>
			<dt>Sources</dt>
			<dd><?php
			foreach( $sources as $item ): ?>

				<div><?= $item->toLink(); ?></div>

			<?php endforeach; ?>
			</dd>
		<?php endif; ?>



		<?php if( $page->copyright()->isNotEmpty() ): ?>
			<dt>Copyright</dt>
			<dd><?= $page->copyright()->toKeyword() ?></dd>
		<?php endif ?>



		<dt class="fullwidth">Signature</dt>
		<dd class="fullwidth"><?= $page->id() ?></dd>

		<?php if( $page->date_modified()->isNotEmpty() ): ?>
			<dt>Dataset modified</dt>
			<dd>
				<?php if( $page->date_modified()->isNotEmpty() ): ?>
					<div class="date-modified"><?= $page->date_modified()->toDateKeyword() ?></div>
				<?php endif ?>
			</dd>
		<?php endif ?>

		<?php if( $page->date_created()->isNotEmpty() ): ?>
			<dt>Dataset created</dt>
			<dd>
				<?php if( $page->date_created()->isNotEmpty() ): ?>
					<div class="date-created"><?= $page->date_created()->toDateKeyword() ?></div>
				<?php endif ?>
			</dd>
		<?php endif ?>

		<?php if( $type[0] === 'file' && $file ): ?>
			<dt>File</dt>
			<dd><?php
			$echo = [];
			switch ($type[1]){
				case 'image':
					$echo[] = $file->width().' × '.$file->height().' px';
					break;
				case 'video':
				case 'audio':
					if( $page->duration()->isNotEmpty() ){
						$echo[] = $page->duration().' min';
					}
					break;
			}
			if( $file ){
				$echo[] = toKeyword( strtoupper( $file->extension() ));
				$echo[] = F::nicesize( F::size( $file->root() ));
			}
			echo implode(', ',$echo);
			?></dd>
		<?php endif; ?>

		<?php if( $page->allowDownload()->isTrue() ): ?>
			<dt>Usage under <?= $page->licence() ?> Licence</dt><dd><?= $file->downloadLink() ?></dd>
		<?php endif ?>

	</dl>
</section>
