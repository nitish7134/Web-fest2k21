import { WebGLRenderer } from './../../../node_modules/three/build/three.module.js';

function createRenderer(container) {
    // const renderer = new WebGLRenderer({ antialias: true });
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xd3f7f7,1);
    //renderer.setClearColor(0x000000,1);
    renderer.setPixelRatio(container.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    
    renderer.shadowMap.enabled = true;
    renderer.physicallyCorrectLights = true;

    return renderer;
}

export { createRenderer };