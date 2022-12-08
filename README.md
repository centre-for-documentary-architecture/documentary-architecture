# CDA Archive Website

## Stack
- PHP 7
- [Kirby](https://getkirby.com/docs/guide/tour) CMS
- HTML, (S)CSS, JS
- [Svelte](https://svelte.dev/) JS Framework

## Development

Install
```
git clone --recursive -–depth 1 https://github.com/moritzebeling/documentary-architecture.org.git
cd documentary-architecture.org

# to install sass
npm install -g sass

# to install svelte
cd site/plugins/framework/assets
npm install
```

Update modules
```
git submodule foreach git pull origin master
```

Run
```
# php server
composer start

# compile sass on save
sass --watch --style=compressed assets/scss:assets/css

# svelte
cd assets/frontend/app
npm run dev
```

## Deploy
Before deploy, compile svelte frontend
```
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
- **[Sitemapper](https://gitlab.com/kirbyzone/sitemapper)**

## Web APIs
The website offeres some public APIs

- To get a JSON representation of the currently viewed page, just append `.json` to the url.
- To get a list of all Liebling-House Tours and Tourstops and all 3D-world-linked elements, call

```
/i/liebling-house/worlditems.json
```
