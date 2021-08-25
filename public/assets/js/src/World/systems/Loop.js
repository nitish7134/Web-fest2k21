import { Clock } from './../../../node_modules/three/build/three.module.js';
import { TWEEN } from './../../../node_modules/three/examples/jsm/libs/tween.module.min.js';
const clock = new Clock();
class Loop {
    constructor(camera, scene, renderer, cssRenderer) {
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.cssRenderer = cssRenderer
        this.updatables = [];
    }

    start() {

        this.renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame

            
            this.tick();

            // render a frame
            this.renderer.render(this.scene, this.camera);
            if (this.cssRenderer)
                this.cssRenderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
        if (this.cssRenderer)
            this.cssRenderer.setAnimationLoop(null);
    }

    tick() {
        // only call the getDelta function once per frame!
        const delta = clock.getDelta();
        TWEEN.update();
        for (const object of this.updatables) {
            object.tick(delta);
        }
    }
}

export { Loop };