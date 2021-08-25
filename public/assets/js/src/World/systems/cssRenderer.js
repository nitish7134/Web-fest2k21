import { CSS2DRenderer } from '../../../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js';
//import { CSS2DRenderer } from '../../../node_modules'

// var cssRenderer;
function createCSSrenderer(container) {
    const cssRenderer = new CSS2DRenderer();
    cssRenderer.setSize(container.clientWidth, container.clientHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';
    document.body.appendChild(cssRenderer.domElement);

    // console.log(cssRenderer);
    return cssRenderer;
}

export { createCSSrenderer }