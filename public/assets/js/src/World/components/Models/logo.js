import { GLTFLoader } from './../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel.js';


async function loadLogo(isLaptop) {

    const loader = new GLTFLoader();
    var logoModel;
    if(isLaptop)
    logoModel = await loader.loadAsync('assets/models/Logo.glb');
    else
    logoModel = await loader.loadAsync('assets/models/LogoPhone.glb');


    const logo = setupModel(logoModel);
    if (isLaptop) {
        logo.rotation.set(-Math.PI / 2, Math.PI, 0.5);
        logo.position.set(-250, -90, 700);
        logo.scale.set(3, 3, 3);
    } else {
        logo.rotation.set(+Math.PI / 2,0, Math.PI/5);
        logo.position.set(0,500,0);
        logo.scale.set(4,4,4);
    }

    return logo;

}

export { loadLogo }
