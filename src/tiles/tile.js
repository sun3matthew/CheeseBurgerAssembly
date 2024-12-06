import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';

export class Tile {
    static tileSize = 1;

    constructor(scene, type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;

        // TODO make this better.
        let isSolid = type[1] === 'B';

        let scale = 0.5;
        let offset = 0.25;
        if (isSolid) {
            scale = 1;
            offset = 0;
        }

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, scale),
            new THREE.MeshPhongMaterial({
                map: TextureManager.Textures[type[1]],
                flatShading: true,
            })
        );

        // if type != 0, then bottom half of the tile is a different color
        this.mesh.position.set(x, 0, y + offset);
        scene.add(this.mesh);

        if (!isSolid) {
            let brickHalf = new THREE.Mesh(
                new THREE.BoxGeometry(1, 1, scale),
                new THREE.MeshPhongMaterial({
                    map: TextureManager.Textures['B'],
                    flatShading: true,
                })
            );
            brickHalf.position.set(x, 0, y - offset);
            scene.add(brickHalf);
        }
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
