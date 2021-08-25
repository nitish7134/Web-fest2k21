import { World } from './src/World/World.js';

async function main() {
    // Get a reference to the container element
    const container = document.querySelector('#container');
    // create a new world
    var isLaptop = !isMobileTablet();
    const world = new World(container, isLaptop);

    // complete async tasks
    await world.init();

    // start the animation loop
    world.start();
}

main().catch((err) => {
    console.error(err);
});
