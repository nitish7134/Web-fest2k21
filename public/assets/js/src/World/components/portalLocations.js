import { Vector3 } from './../../../node_modules/three/build/three.module.js';
const gateCoordinates = [
    {
        name: "Quiz",
        link: config.baseUrl+"/quizzing/index.html",
        position: new Vector3(-175, -50, 100),
        gatePosition: new Vector3(-160,-50,10),
        houseName: "House_02_FantasyAtlas_mat_0"
    },
    {
        name: "Rewards",
        link: config.baseUrl + "/bazaar/index.html",
        position: new Vector3(260, -50, 320),
        gatePosition: new Vector3(360,-35,320),

        houseName: "House_03_FantasyAtlas_mat_0"
    },
    {
        name: "Events",
        link: config.baseUrl + "/events/index.html",
        position: new Vector3(170, -50, -170),
        gatePosition: new Vector3(180,10,-260),

        houseName: "House_01_FantasyAtlas_mat_0"
    },
    {
        name: "Exhibitions",
        link: config.baseUrl + "/exhibitions/index.html",
        position: new Vector3(345, -50, -45),
        gatePosition: new Vector3(480,-50,-45),

        houseName: "House_04_FantasyAtlas_mat_0"
    }
]


function gateLocations() {
    return gateCoordinates;
}

export { gateLocations } 