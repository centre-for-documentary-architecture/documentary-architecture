# On Nov 2nd, we moved here from Bitbucket ⚠️
This is a shallow clone of [https://bitbucket.org/cdaweimar/the-matter-of-data](https://bitbucket.org/cdaweimar/the-matter-of-data). This repo is missing the history of the 600+ commits made already.

# CDA Archive Website

## Stack
- PHP 7
- [Kirby](https://getkirby.com/docs/guide/tour) CMS
- HTML, (S)CSS, JS

And partially

- JSON API
- [Svelte](https://svelte.dev/) JS Framework

## Dev setup
Clone this repo including all submodules to your disk and cd into the project.
```
git clone --recursive {giturl}
```

**1. PHP 7**
To run the website you need PHP 7 installed.
Run [locally:8000](http://localhost:8000/) with
```
php -S localhost:8000 kirby/router.php
```

**2. SCSS**
All style definitions are made within `assets/scss/...` and are compiled to CSS in `assets/css` upon save.
For VS Code, I use [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) which auto includes all needed css prefixes. Make sure to also compile a sourcemap.
Settings in VS Code `settings.json`:
```json
{
    ...
    "liveSassCompile.settings.formats":[
        {
            "format": "expanded",
            "extensionName": ".css",
            "savePath": "~/../css"
        },
        {
            "format": "compressed",
            "extensionName": ".min.css",
            "savePath": "~/../css"
        }
    ],
    "liveSassCompile.settings.excludeList": [ 
        "kirby/**",
        "site/**" 
    ]
}
```

**3. Svelte**
Some frontent pages are delivered blank by Kirby and are filled with Svelte, using data from the API. Svelte is a JS framework like react, but instead of having its own runtime, it is complied to vanilla JS before being shipped to the browser. The whole Svelte thing lives in a Kirby Plugin at `site/plugins/framework`. `cd` over there and run
```
npm install
npm run dev
```
However, you don’t have to do the Svelte thing to work on the rest of the site.

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

- To get a JSON representation of the currently viewed page, just append `.json`tho the url.
- To get a list of all Liebling-House Tours and Tourstops and all 3D-world-linked elements, call

```
http://localhost:8000/i/liebling-house/worlditems.json
```
