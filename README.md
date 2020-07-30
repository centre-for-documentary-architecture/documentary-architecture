# CDA Archive Website

## Stack
- PHP 7
- [Kirby](https://getkirby.com/docs/guide/tour) CMS
- HTML, (S)CSS, JS
- [Svelte](https://svelte.dev/) JS Framework

## Install
Get a shallow clone including all submodules
```
git clone --recursive -–depth 1 https://github.com/moritzebeling/documentary-architecture.org.git
```
Update modules
```
git submodule foreach git pull origin master
```
Go there
```
cd documentary-architecture.org
```
Install sass
```
npm install -g sass
```
Install svelte
```
cd site/plugins/framework/assets
npm install
```

## Run
Run PHP
```
php -S localhost:8000 kirby/router.php
```
Compile SCSS upon save
```
sass --watch --style=compressed assets/scss:assets/css
```
Run Svelte
```
cd assets/frontend/app
npm run dev
npm run build
```

## Used tools
- **[Reflex](http://reflexgrid.com)** responsive CSS grid system
- **[Lazysizes](https://github.com/aFarkas/lazysizes)** lazyloading responsive images
- **[SmoothScroll](http://github.com/cferdinandi/smooth-scroll)**
- **[Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/)**
- **[Three.js](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene)**
    - [FBX Loader](https://threejs.org/examples/?q=fbx#webgl_loader_fbx)
    - [OrbitControls](https://threejs.org/examples/?q=orbit#misc_controls_orbit)
    - [Equirectangular Panorama](https://threejs.org/examples/?q=panorama#webgl_panorama_equirectangular)
- **[UnityLoader](https://docs.unity3d.com/Manual/webgl-gettingstarted.html)**

## Web APIs
The website offeres some public APIs

- To get a JSON representation of the currently viewed page, just append `.json` to the url.
- To get a list of all Liebling-House Tours and Tourstops and all 3D-world-linked elements, call

```
http://localhost:8000/i/liebling-house/worlditems.json
```
