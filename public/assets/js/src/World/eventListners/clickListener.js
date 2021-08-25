import { Raycaster, Vector3 } from './../../../node_modules/three/build/three.module.js';
import { gateLocations } from './../components/portalLocations.js';
import { TWEEN } from './../../../node_modules/three/examples/jsm/libs/tween.module.min.js';


let raycaster;
const gates = gateLocations();

const checkPoint = new Vector3(-150, 100, 420);
function GetWhichSystem(pos) {
    for (var i = 0; i < gates.length; i++) {
        if (pos.distanceTo(gates[i].position) < 100) {
            const flag = true;
            return { i, flag };
        }
    }
    return false;
}
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, duration * 1000)
    })
}
function ClickEvent(camera, scene, isLaptop, controls) {
    function tapOrClick(event) {

        var mouse;
        if (event.clientX) {
            mouse = {
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1
            };
        }
        else {
            mouse = {
                x: (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1,
                y: -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1
            };
        }
        raycaster = new Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (isLaptop) {
            if (intersects.length && intersects[0].object.type == 'Points') {
                var sys = GetWhichSystem(intersects[0].point);
                if (sys.flag) {
                    window.open(gates[sys.i].link);
                }
            }
        } else {
            for (var i = 0; i < gates.length; i++) {
                if (intersects.length && intersects[0].object.name === gates[i].houseName) {
                    /* controls.target.copy(gates[i].gatePosition);
                    controls.minDistance = 0;
                    var tweenToGate = new TWEEN.Tween(camera.position).to(gates[i].gatePosition, 4000)
                    var tweenToCheckpoint = new TWEEN.Tween(camera.position).to(checkPoint, 4000)
                        .easing(TWEEN.Easing.Linear.None)
                        .start().onComplete(() => {
                            tweenToGate.easing(TWEEN.Easing.Linear.None)
                                .start().onComplete(() => {
                                    controls.reset();
                                    window.open(gates[i].link);
                                });
                        }) */
                    window.open(gates[i].link,"_self")
                    return;
                }
            }
        }
    }
    window.addEventListener('click', tapOrClick, false);
    window.addEventListener("touchend", tapOrClick, false);

}

export { ClickEvent }