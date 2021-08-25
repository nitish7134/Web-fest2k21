import { AmbientLight, DirectionalLight, HemisphereLight, PointLight } from './../../../node_modules/three/build/three.module.js';

function createLights() {

	const pointlight = new PointLight(0xf9d71c, 5);
	pointlight.castShadow = true; // default false
	pointlight.position.set(100,200,60);
	pointlight.decay = 0.1;
	pointlight.shadow.mapSize.width = 512; // default
	pointlight.shadow.mapSize.height = 512; // default
	pointlight.shadow.camera.near = 0.5; // default
	pointlight.shadow.camera.far = 800; // default

	const ambiLight = new AmbientLight(0xFFFFFF, 4);
	return {pointlight, ambiLight };
}

export { createLights };