import * as THREE from '../node_modules/three/src/Three.js';
// import '../node_modules/three/examples/js/controls/FlyControls.js';
import Player from './player.js';
import {PointerLockControls} from '../node_modules/three/examples/jsm/controls/PointerLockControls.js';


class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild( this.renderer.domElement );

        // this.renderer.domElement.requestPointerLock();

        this.flyControls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.flyControls.dragToLook = true;

        this.cameraMovement = [0, 0, 0];

        this.nPlayers = 1000;
        this.players = [];

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onKeyRelease = this.onKeyRelease.bind(this);
        this.mainLoop = this.mainLoop.bind(this);

        // Event listeners
        var ths = this;
        this.renderer.domElement.addEventListener( 'click', function () {
            ths.flyControls.lock();
        }
        , false);

        document.addEventListener("keydown", this.onKeyPress, false);
        document.addEventListener("keyup", this.onKeyRelease, false);
    }

    createPlayers() {
        // Clear players list
        while (this.players.length > 0) {
            this.players[0].die();
        }

        for (let i = 0; i < this.nPlayers; i++) {
            this.players.push(new Player( this ));
        }
    }

    onStart() {
        // Add fog
        this.scene.fog = new THREE.Fog(new THREE.Color(0x666666), 0.0025, 30);

        // Build world
        this.floor = new THREE.Mesh( new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({color: 0x00FF00, side: THREE.DoubleSide}));
        this.floor.rotation.x  = 1.5 * Math.PI;  // rotate flat
        this.floor.position.y = -6;
        this.scene.add(this.floor);

        // Move the camera slighty up
        this.camera.position.y = 0;
        this.camera.position.z = 13;

        this.createPlayers();
    }

    onUpdate() {
        this.flyControls.moveForward(this.cameraMovement[0]);
        this.flyControls.moveRight(this.cameraMovement[2]);
        this.camera.position.y += this.cameraMovement[1];

        var ths = this;

        // Player movement
        this.players.forEach(function(player) {
            player.onUpdate();            
        });
    }

    updateCameraMovement(keyCode, move) {
        var speed = 0.1;
        if (!move) {
            speed = 0;
        }

        if (keyCode == 87) {
            this.cameraMovement[0] = speed;
        } else if (keyCode == 83) {
            this.cameraMovement[0] = -speed;
        } else if (keyCode == 65) {
            this.cameraMovement[2] = -speed;
        } else if (keyCode == 68) {
            this.cameraMovement[2] = speed;
        } else if (keyCode == 16) {
            this.cameraMovement[1] = -speed;
        } else if (keyCode == 32) {
            this.cameraMovement[1] = speed;
        }
    }

    onKeyPress(event) {
        var keyCode = event.which;

        console.log(this);
        
        if ([87, 83, 65, 68, 32, 16].indexOf(keyCode) >= 0) {
            this.updateCameraMovement(keyCode, true);
        } else if (keyCode == 82) {
            this.createPlayers();
        } else {
            console.log(keyCode);
        }
    }

    onKeyRelease(event) {
        var keyCode = event.which;

        if ([87, 83, 65, 68, 32, 16].indexOf(keyCode) >= 0) {
            this.updateCameraMovement(keyCode, false);
        }
    }

    mainLoop() {
        requestAnimationFrame( this.mainLoop );
        this.onUpdate();
        this.renderer.render( this.scene, this.camera );
        // this.flyControls.update(1);
    }
}

export default Game;
