<h1><img src="public/sunorhc.svg" width="28" height="28"> Sunorhc.Timeline</h1>

**See the future, reflect on the past. Control time with Sunorhc.Timeline.**  
At last, the long-awaited successor to **jQuery.Timeline** is here.  
Sunorhc.Timeline inherits the useful features of its predecessor and breaks new ground.  

Sunorhc.Timeline is not a library that simply refactors the source code of jQuery.Timeline.  
It is a type-safe application that inherits only the useful specifications of its predecessor and is completely redesigned from scratch in TypeScript.  
We use Vite for development and builds, Vitest for coverage testing, lz-string for event data cache compression, and pino for logger.  

![screenshot-01](https://github.com/ka215/sunorhc.timeline/assets/7112853/84aab710-9aa9-44ca-81fe-12583a40de21)

### Features
- Option settings similar to jQuery.Timeline
- Type-safe robustness and extensibility with TypeScript
- High degree of customization freedom
- High performance with asynchronous event loading
- Supports operation on touch devices

More details will be coming soon, so stay tuned!

## Get Started
To get started, first get the library in one of the following ways:
- `npm install sunorhc.timeline`
- `git clone https://github.com/ka215/sunorhc.timeline.git`
- [Download latest release](https://github.com/ka215/sunorhc.timeline/releases/latest)

The following files stored in the `dists` directory in the package are the core files of the library.
```bash
css/sunorhc.timeline.css
js/sunorhc.timeline.js
```
Each package also includes a gzip compressed file, so please use whichever you need.

### Usage

1. Include the CSS file in the head tag of your HTML and load the JS file before the end of the body tag.
```
<link rel="stylesheet" src="/path/to/css/sunorhc.timeline.css">

<script src="/path/to/js/sunorhc.timeline.js"></script>
```

2. Then, prepare a container element within the body tag to display the timeline.
```
<div id="myTimeline"></div>
```

3. Finally, instantiate the timeline component within the `script` tag to complete the process.
```js
Sunorhc.Timeline.create('myTimeline', { sidebar: { items: [ { type: 'text', label: 'Row 1'} ] } })
```

Note: Currently instantiation will fail unless at least one sidebar item is defined.

Note: The instantiated timeline component is automatically registered to the global Window object. To access the instance after it is created, refer to the `window.SunorhcTimelineInstances` property.

Note: To control the component after it is instantiated, we recommend using asynchronous instantiation, as see below.
```js
(async () => {
    await Sunorhc.Timeline.create('myTimeline', { sidebar: { items: [ { type: 'text', label: 'Row 1'} ] } })
    .then(thisInstance => {
        console.log(window.SunorhcTimelineInstances, thisInstance.getOptions())
    })
})()
```

## Demo Build

[Version 0.9.1 with tester](https://ka215.github.io/sunorhc.timeline/?v0.9.1-2)

## Coverage

[Latest coverages on 11 June, 2024](https://ka215.github.io/sunorhc.timeline/coverage/)

## Contributors

- ka2 (Katsuhiko Maeno) [https://ka2.org/](https://ka2.org/)

## Copyright and License

Code and documentation copyright 2024- the [ka2](https://ka2.org/). Code released under the MIT License.