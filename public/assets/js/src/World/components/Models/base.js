import { GLTFLoader } from './../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FrontSide, Mesh } from './../../../../node_modules/three/build/three.module.js';
import { setupModel } from './setupModel.js';

let base;

async function loadBase(isLaptop) {
    const loader = new GLTFLoader();
    var baseModel;
    if (isLaptop) {
        baseModel = await loader.loadAsync('assets/models/fantasySet.glb');
    } else {
        baseModel = await loader.loadAsync('assets/models/fantasy_set_Mobile/scene.gltf');
    }
    base = setupModel(baseModel);
    base.scale.set(2, 2, 2)
    if (isLaptop) {
        base.traverse(function (object) {
            if (object instanceof Mesh) {
                object.geometry.computeVertexNormals();
                if (object.material) {
                    const mat = object.material;
                    mat.tranparent = false;
                    mat.side = FrontSide;
                }
            }
            object.castShadow = true;
            object.receiveShadow = true;

        });
    }else{
        base.position.set(-500,500,680);
    }

    return base;
}

export { loadBase }
