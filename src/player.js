import * as THREE from '../node_modules/three/src/Three.js';
import { distance3d } from './math.js';


class Player {
    constructor(game) {
        this.parent = game;

        this.mesh = new THREE.Mesh( new THREE.SphereGeometry(Math.random() * 0.1, 32, 32), new THREE.MeshBasicMaterial({color: Math.random() * 0xFFFFFF}));
        this.mesh.position.x = Math.random() * 10 - 5;
        this.mesh.position.z = Math.random() * 10 - 5;
        this.mesh.position.y = Math.random() * 10 - 5;
        this.parent.scene.add(this.mesh);

        this.speed = Math.random() * 0.01;
    }

    onUpdate() {
        var closestPlayer;
        var closestDistance;

        var ths = this;
        this.parent.players.forEach(function(p) {
            if (p === ths) {
                return;
            }
            var distance = distance3d([ths.mesh.position.x, ths.mesh.position.y, ths.mesh.position.z], [p.mesh.position.x, p.mesh.position.y, p.mesh.position.z]);

            if (closestDistance === undefined || distance < closestDistance) {
                closestDistance = distance;
                closestPlayer = p;
            }
        });

        if (closestPlayer === undefined) {
            return;
        }

        var target = closestPlayer.mesh.geometry.parameters.radius < this.mesh.geometry.parameters.radius;

        var change_x = Math.max(Math.min(closestPlayer.mesh.position.x - this.mesh.position.x, this.speed), -this.speed);
        var change_y = Math.max(Math.min(closestPlayer.mesh.position.y - this.mesh.position.y, this.speed), -this.speed);
        var change_z = Math.max(Math.min(closestPlayer.mesh.position.z - this.mesh.position.z, this.speed), -this.speed);

        if (target) {
            // Check if can eat
            if (closestDistance < this.mesh.geometry.parameters.radius) {
                this.eat(closestPlayer);
            }
        } else {
            change_x *= -1;
            change_y *= -1;
            change_z *= -1;
        }

        this.mesh.position.x += change_x;
        this.mesh.position.y += change_y;
        this.mesh.position.z += change_z;

        this.mesh.position.x = Math.max(Math.min(this.mesh.position.x, 5), -5);
        this.mesh.position.y = Math.max(Math.min(this.mesh.position.y, 5), -5);
        this.mesh.position.z = Math.max(Math.min(this.mesh.position.z, 5), -5);
    }

    die() {
        this.parent.scene.remove( this.mesh );

        const index = this.parent.players.indexOf( this );
        if (index > -1) {
            this.parent.players.splice(index, 1);
        }
    }

    eat( player ) {
        this.mesh.scale.x += (player.mesh.scale.x) / 2;
        this.mesh.scale.y += (player.mesh.scale.y) / 2;
        this.mesh.scale.z += (player.mesh.scale.z) / 2;

        player.die();
    }
}

export default Player;
