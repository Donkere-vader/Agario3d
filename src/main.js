import * as THREE from '../node_modules/three/src/Three.js';
import Game from './game.js';


function main() {
    const game = new Game();
    game.onStart();
    game.mainLoop();   
}

main();
