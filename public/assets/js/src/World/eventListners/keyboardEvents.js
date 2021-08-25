import { setAction } from './../components/Models/character.js';
import { checkCollision, resetRealGhost } from './../components/Models/character.js'


const movement = {
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    enter: false,
    sprint: false
};
function KeyboardEvents() {
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function onKeyDown(event) {
    // event.preventDefault();

    // console.log("KEY PRESSED DOWN: " + event.keyCode);

    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ 	movement.moveForward = true; break;

        case 40: /*down*/
        case 83: /*S*/ 	 movement.moveBackward = true; break;

        case 37: /*left*/
        case 65: /*A*/ movement.moveLeft = true; break;

        case 39: /*right*/
        case 68: /*D*/ movement.moveRight = true; break;

        case 32: /* space */ setAction(5); if (checkCollision()) movement.enter = true; break;

        case 16: /* shift */setAction(9); movement.sprint = true; break;

    }
}

function onKeyUp(event) {

    //event.preventDefault();
    switch (event.keyCode) {

        case 38: /*up*/
        case 87: /*W*/ movement.moveForward = false; break;

        case 40: /*down*/
        case 83: /*S*/ 	 movement.moveBackward = false; break;

        case 37: /*left*/
        case 65: /*A*/ 	 movement.moveLeft = false; break;

        case 39: /*right*/
        case 68: /*D*/ movement.moveRight = false; break;

        case 32: setAction(3); movement.enter=false; resetRealGhost(); break;

        case 16: setAction(3); movement.sprint = false; break;

    }
}
function getMovement() {
    return movement;
}

function stopEnter() {
    movement.enter = false;
}
export { KeyboardEvents, getMovement, stopEnter };