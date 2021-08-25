import { Scene,Fog } from './../../../node_modules/three/build/three.module.js';

function createScene() {
    const scene = new Scene();
    // scene.fog = new Fog(0xCCCCCC,100,2000);
    return scene;
}

export { createScene };