import { GLTFLoader } from './../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { AnimationMixer, Vector3, FrontSide, Mesh, Group } from './../../../../node_modules/three/build/three.module.js';
import { setupModel } from './setupModel.js';
import { getMovement, stopEnter } from '../../eventListners/keyboardEvents.js';

import { gateLocations } from './../portalLocations.js';

let ghost;
let realGhost;

let gScale = 0.65;
var character;
let mixer;
let yoffset = -100;
// let velocity = 0;

let velocity = 0;
let acc = 0;

const sprintAcc = 25;
const accel = 10;
let omega = 0.05;
let gates = gateLocations();

var lastAction, activeAction, actions = [];
function setAction(i) {
    if (actions[i] != activeAction) {
        lastAction = activeAction;
        activeAction = actions[i];
        lastAction.fadeOut(.2);
        activeAction.reset();
        activeAction.fadeIn(.2);
        activeAction.play();
    }
}

function resetRealGhost() {
    realGhost.scale.set(gScale, gScale, gScale);
    realGhost.rotation.z = 0;
    stopEnter();

}
function enterOnKeyPress(model) {
    // Code here for fading out of the model and rotation
    if (model.scale.x > 0) {
        model.rotation.z += 0.04;
        model.scale.x -= 0.01;
        model.scale.z -= 0.01;
        model.scale.y -= 0.01;
    } else {
        window.open(gates[(checkCollision().i)].link);
        resetRealGhost();
        var e = new KeyboardEvent('keyup', { "keyCode": 32 });
        document.dispatchEvent(e);
    }
}

function moveOnKeyPress(movement, model) {
    acc = 0.0;
    if (movement.moveForward && !movement.moveBackward) {
        if (movement.sprint)
            acc = sprintAcc;
        else
            acc = accel;
    }
    if (movement.moveBackward && !movement.moveForward) {
        if (movement.sprint)
            acc = -sprintAcc;
        else
            acc = -accel;
        
    }
    velocity += (acc - velocity) * 0.1;
    if (velocity < 0.1 && velocity > -0.1)
        velocity = 0;
    model.translateZ(velocity);
    if (ghost.position.x > 1750)
        ghost.position.x = 1750;
    if (ghost.position.x < -1300)
        ghost.position.x = -1300;

    if (ghost.position.z > 1500)
        ghost.position.z = 1500;
    if (ghost.position.z < -1500)
        ghost.position.z = -1500;
    if (velocity >= 0) {
        if (movement.moveLeft && !movement.moveRight) {
            model.rotateY(omega)
        } else if (movement.moveRight && !movement.moveLeft) {
            model.rotateY(-omega)
        }
    } else {
        if (movement.moveLeft && !movement.moveRight) {
            model.rotateY(-omega)
        } else if (movement.moveRight && !movement.moveLeft) {
            model.rotateY(+omega)
        }
    }




}

async function loadCharacter() {


    const loader = new GLTFLoader();
    character = await loader.loadAsync('assets/models/spook/scene.gltf');

    //ghost = setupModel(character);
    realGhost = setupModel(character);

    ghost = new Group();
    ghost.add(realGhost);
    ghost.position.set(-300, yoffset, 450);
    //  ghost.position.set(0, yoffset, 0);
    realGhost.scale.set(gScale, gScale, gScale);
    ghost.rotation.set(0, 3 * Math.PI / 4, 0);
    ghost.traverse(function (object) {
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


    //****************************** */


    const animations = character.animations;
    mixer = new AnimationMixer(ghost);
    for (var i = 0; i < animations.length; i++) {
        actions.push(mixer.clipAction(animations[i]));
    }
    actions[3].play();
    lastAction = actions[3];
    activeAction = actions[3];

    //****************************** */

    ghost.tick = (delta) => {
        mixer.update(delta);
        const movement = getMovement();

        moveOnKeyPress(movement, ghost);
        if (movement.enter) {
            enterOnKeyPress(realGhost);
        }
    }

    return ghost;
}

function getGhostPosition() {
    return ghost.position;
}
function getGhost() {
    return ghost;
}

function checkCollision() {
    for (var i = 0; i < gates.length; i++) {
        if (ghost.position.distanceTo(gates[i].position) < 100) {
            const flag = true;
            return { i, flag };
        }
    }
    return false;
}

export { loadCharacter, getGhostPosition, getGhost, setAction, checkCollision, resetRealGhost }


