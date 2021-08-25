
import { Vector3, PerspectiveCamera } from './../../../node_modules/three/build/three.module.js';
import { getGhost } from './Models/character.js'

let camera;
const lookatDist = 400;
const offsetDist = 400;
function createCamera(container, isLaptop) {

    camera = new PerspectiveCamera(50, container.innerWidth / container.innerHeight, 1, 5000);
    
    if(!isLaptop){
        camera.position.set(-500, 1200, 1200)
    }
    camera.tick = (delta) => {
        if (isLaptop) {
            const ghost = getGhost();
            var sinthetaby2 = ghost.quaternion.y;
            var costhetaby2 = ghost.quaternion.w;
            var dir = new Vector3(2 * sinthetaby2 * costhetaby2, 0, 2 * costhetaby2 * costhetaby2 - 1);

            const lookat = new Vector3();
            lookat.add(ghost.position).addScaledVector(dir, lookatDist);

            const offset = new Vector3();
            offset.add(ghost.position).addScaledVector(dir, -offsetDist).add(new Vector3(0, 150, 50));

            camera.lookAt(lookat);
            const alpha =  0.16; /* 1-Math.pow(0.001,delta) */
            camera.position.lerp(offset,alpha);
        }else{
          
        }
    }
    return camera;
}

export { createCamera };