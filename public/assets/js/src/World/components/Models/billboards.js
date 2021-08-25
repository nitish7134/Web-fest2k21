import { GLTFLoader } from './../../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { setupModel } from './setupModel.js';


async function loadBillboards(isLaptop) {

    const loader = new GLTFLoader();
    const [eventsData, rewardsData, quizData, exhibitionData] = await Promise.all([
        loader.loadAsync('assets/models/events.glb'),
        loader.loadAsync('assets/models/rewards.glb'),
        loader.loadAsync('assets/models/quiz.glb'),
        loader.loadAsync('assets/models/exhibitions.gltf'),
    ]);

    var events = setupModel(eventsData);
    var rewards = setupModel(rewardsData);
    var quiz = setupModel(quizData);
    var exhibition = setupModel(exhibitionData);

    if (isLaptop) {
        //events
        events.rotation.set(-Math.PI / 2, Math.PI, Math.PI);
        events.position.set(140, 160, -300);
        events.scale.set(3, 3, 3);

        //rewards
        rewards.rotation.set(-Math.PI / 2, Math.PI, -Math.PI / 2);
        rewards.position.set(320, 100, 270);
        rewards.scale.set(2.4, 2.4, 2.4);

        //quiz
        quiz.rotation.set(-Math.PI / 2, -Math.PI, Math.PI);
        quiz.position.set(-230, 60, 0);
        quiz.scale.set(3, 3, 3);

        // exhibitions
        exhibition.rotation.set(-Math.PI / 2, -Math.PI, Math.PI);
        exhibition.position.set(-230, 60, 0);
        exhibition.scale.set(10, 10, 10);

    } else {
        events.rotation.set(4, Math.PI, Math.PI);
        events.position.set(140, 120, -280);
        events.scale.set(3, 3, 3);

        //rewards
        rewards.rotation.set(-Math.PI / 2, 4, -Math.PI / 2);
        rewards.position.set(370, 220, 250);
        rewards.scale.set(2.4, 2.4, 2.4);

        //quiz
        quiz.rotation.set(4, -Math.PI, Math.PI);
        quiz.position.set(-180, 60, 10);
        quiz.scale.set(3, 3, 3);

        // exhibitions
        exhibition.rotation.set(-Math.PI / 2, Math.PI, 0.5);
        exhibition.position.set(-250, -90, 700);
        exhibition.scale.set(3, 3, 3);
    }

    return {
        events,
        rewards,
        quiz,
        exhibition
    };

}

export { loadBillboards }