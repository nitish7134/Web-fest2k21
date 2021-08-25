import { Vector3 } from './../../../node_modules/three/build/three.module.js';
import { OrbitControls } from './../../../node_modules/three/examples/jsm/controls/OrbitControls.js';



function createControls(camera, canvas) {

    const controls = new OrbitControls(camera, canvas);
    
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.maxDistance = 2500;
    controls.enableDamping = true;
    controls.minDistance = 1500;
    controls.minPolarAngle = Math.PI/6;
    controls.maxPolarAngle = 75*Math.PI/180;
    controls.rotateSpeed = 1;
    controls.minAzimuthAngle = -2*Math.PI/6;
    controls.maxAzimuthAngle = 0//Math.PI/6;
    controls.target.copy(new Vector3(225,0,40))
    console.log(controls);
    
    controls.tick = (delta)=>{
        controls.update();
    };

    return controls;
}

export { createControls };
