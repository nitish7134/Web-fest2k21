import { CSS2DObject } from '../../../../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js';
import { gateLocations } from '../portalLocations.js';

var locations = gateLocations();


var locations = gateLocations();
function getCssElements() {
    var cssDivs = [];
    for (var i = 0; i < locations.length; i++) {
        const eventName = document.createElement('div');
        eventName.className = 'label';
        eventName.textContent = locations[i].name;
        eventName.style.marginTop = '-1em';
        const eventLabel = new CSS2DObject(eventName);
        eventLabel.position.set(locations[i].position.x,locations[i].position.y+10,locations[i].position.z);
        cssDivs.push(eventLabel);
    }

    // console.log(cssDivs);
    return cssDivs;
}

export { getCssElements };