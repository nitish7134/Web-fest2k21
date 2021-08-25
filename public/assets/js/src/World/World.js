//components
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { getCssElements } from './components/Models/createCssElement.js';

//components->models
import { loadCharacter } from './components/Models/character.js';
import { loadParticleSystem } from './components/Models/particleSystem.js';
import { loadBase } from './components/Models/base.js'
import { loadLogo } from './components/Models/logo.js'
import { loadBillboards } from './components/Models/billboards.js'

// systems
import { createCSSrenderer } from './systems/cssRenderer.js';
import { createRenderer } from './systems/renderer.js';
import { createControls } from './systems/controls.js';
import { Loop } from './systems/Loop.js';
//import { loadStats } from './systems/stats.js';

//eventListeners
import { Resizer } from './eventListners/Resizer.js';
import { ClickEvent } from './eventListners/clickListener.js';
import { KeyboardEvents } from './eventListners/keyboardEvents.js';



//let goal;
let camera;
let renderer;
let scene;
let loop;
let cssRenderer;
let controls;
class World {
    constructor(container, isLaptop) {
        this.isLaptop = isLaptop;
        scene = createScene();

        camera = createCamera(container, isLaptop);

        renderer = createRenderer(container);
        container.appendChild(renderer.domElement);
        scene.add(camera);
        if (isLaptop) {
            cssRenderer = createCSSrenderer(container);
            container.appendChild(cssRenderer.domElement);
            const keyboardEvents = KeyboardEvents();
            loop = new Loop(camera, scene, renderer, cssRenderer);
            loop.updatables.push(camera);


        } else {
            loop = new Loop(camera, scene, renderer, cssRenderer);
            controls = createControls(camera, renderer.domElement);
            loop.updatables.push(controls);
        }

        // let stats = loadStats();
        // container.appendChild(stats.dom);
        // loop.updatables.push(stats);


        const { pointlight, ambiLight } = createLights();
        scene.add(ambiLight);
        scene.add(pointlight);


        const resizer = new Resizer(container, camera, renderer, cssRenderer);
        const clickEvents = ClickEvent(camera, scene, this.isLaptop, controls);

    }

    async init() {

        const base = await loadBase(this.isLaptop);
        scene.add(base);
        
        const logo = await loadLogo(this.isLaptop)
        scene.add(logo);

        const { events,rewards,quiz,exhibitions } = await loadBillboards(this.isLaptop);
        scene.add(events,rewards,quiz ,exhibitions);

        if (this.isLaptop) {
            const ghost = await loadCharacter();
            scene.add(ghost);
            loop.updatables.push(ghost);
            var cssDivs = getCssElements();
            var objs = loadParticleSystem(cssDivs);
            scene.add(objs);
            console.log("Objs:",objs)
            loop.updatables.push(objs);
        }
        console.log("updatables",loop.updatables);
    }

    render() {
        renderer.render(scene, camera);
        if (this.isLaptop)
            cssRenderer.render(scene, camera);
    }

    start() {
        loop.start();
        if (this.isLaptop) {
            cssRenderer.render(scene, camera);
        }

    }

    stop() {
        loop.stop();
        if (this.isLaptop)
            cssRenderer.setAnimationLoop(null);

    }
}

export { World };