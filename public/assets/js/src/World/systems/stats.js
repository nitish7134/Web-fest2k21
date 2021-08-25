import Stats  from './../../../node_modules/three/examples/jsm/libs/stats.module.js';

function loadStats() {
    let stats = new Stats();
    stats.tick = (delta) => {
        stats.update();
    }
    return stats;
}

export { loadStats }