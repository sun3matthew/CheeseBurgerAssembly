import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';
import { LeverColorList } from '../managers/leverColorList.js';

export class Tile {
    static tileSize = 1;

    constructor(scene, type, x, y, associatedLever) {
        this.type = type;
        this.x = x;
        this.y = y;

        this.active = true;

        this.associatedLever = associatedLever;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshPhongMaterial({
                map: TextureManager.Textures[type[1]],
                color: LeverColorList.leverColorList[associatedLever],
                transparent: true,
                opacity: 1,
            })
        );

        this.mesh.position.set(x, 0, y);
        scene.add(this.mesh);

        // if odd
        if (associatedLever % 2 === 1) {
            this.toggleTile();
        }
    }

    toggleTile() {
        this.active = !this.active;
        if (this.active)
            this.mesh.material.opacity = 1;
        else
            this.mesh.material.opacity = 0.5;
    }

    // position is bottom left of mesh
    getBoundingBox() {
        if (this.active)
            return {
                x: this.x - Tile.tileSize / 2,
                y: this.y - Tile.tileSize / 2,
                width: Tile.tileSize,
                height: Tile.tileSize
            };
        else
            return {
                x: -100000000,
                y: -100000000,
                width: 0,
                height: 0
            };
    }
}
