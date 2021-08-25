
const setSize = (container, camera, renderer, cssRenderer) => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    if (cssRenderer) {
        cssRenderer.setSize(container.clientWidth, container.clientHeight);
    }
};

class Resizer {
    constructor(container, camera, renderer,cssRenderer) {
        setSize(container, camera, renderer, cssRenderer);

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer);
            this.onResize();
        });
    }

    onResize() { }
}
export { Resizer };