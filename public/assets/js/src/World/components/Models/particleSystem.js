import { ParticleSystem, Geometry, ParticleBasicMaterial, ImageUtils, Vector3, AdditiveBlending, Object3D, TextureLoader } from './../../../../node_modules/three/build/three.module.js';
import { gateLocations } from './../portalLocations.js';

const Gate = gateLocations();

let objs = new Object3D();
function loadParticleSystem(cssDivs) {
    var particleCount = 1800;
    var particles = new Geometry();
    var pMaterial = new ParticleBasicMaterial({
        color: 0x257ca3,
        size: 6,
        map: ImageUtils.loadTexture(
            // "assets/images/particle.jpg"
            "assets/texture/sprite.png"
        ),
        blending: AdditiveBlending,
    });

    for (var p = 0; p < particleCount; p++) {

        var x, y, z;
        x = Math.random() * 4 - 2;
        y = Math.random() * 4 - 2;
        z = Math.random() * 4 - 2;

        var norm = 1 / (Math.sqrt(x * x + y * y + z * z));
        var radius = Math.random() * 16;

        var pX = radius * x * norm,
            pY = radius * y * norm,
            pZ = radius * z * norm,
            particle = new Vector3(pX, pY, pZ);
        particles.vertices.push(particle);
    }

    var particleSystem = new ParticleSystem(particles, pMaterial);

    particleSystem.sortParticles = true;

    var parts = [];
    for (var i = 0; i < 4; i++) {
        var prt = particleSystem.clone();
        prt.position.set(Gate[i].position.x, Gate[i].position.y, Gate[i].position.z);
        parts.push(prt);
        objs.add(prt);
    }

    for (var i = 0; i < cssDivs.length; i++){
        objs.add(cssDivs[i]);
    }
    objs.tick = (delta) => {
        for (var i = 0; i < 4; i++) parts[i].rotation.y += 0.1;
    }
    return objs;
}


export { loadParticleSystem };