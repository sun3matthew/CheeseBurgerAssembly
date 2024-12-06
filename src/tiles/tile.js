import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';

export class Tile {
    static tileSize = 1;

    constructor(scene, type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({
                map: TextureManager.Textures[type[1]],
                flatShading: true,
            })
        );

        this.mesh.position.set(x, 0, y);
        scene.add(this.mesh);
    }

    // position is bottom left of mesh
    getBoundingBox() {
        return {
            x: this.x - Tile.tileSize / 2,
            y: this.y - Tile.tileSize / 2,
            width: Tile.tileSize,
            height: Tile.tileSize
        };
    }
}
