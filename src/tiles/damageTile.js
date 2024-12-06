import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';

export class DamageTile {
    static tileSize = 1;

    //! Horrible code.
    constructor(scene, type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;

        // - `TW0` - Water Tile
        // - `TG0` - Grill Tile
        // - `TO0` - Oil Tile
        let damageType = type[1];
        this.damageType = 0; // both
        if (damageType === 'W') {
            this.damageType = 1; // player 1
        } else if (damageType === 'G') {
            this.damageType = 2; // player 2
        }

        let scale = 0.5;
        let offset = 0.25;

        const originalTexture = TextureManager.Textures[type[1]];
        const texture = originalTexture.clone();
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.set(1, 0.5);

        let material;
        if (this.damageType === 1) { // water
            material = new THREE.MeshPhongMaterial({
                map: texture,
                flatShading: true,
                transparent: true,
                opacity: 0.65,
            });
        }else{
            material = new THREE.MeshPhongMaterial({
                map: texture,
                flatShading: true,
            });
        }

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, scale),
            material
        );

        this.mesh.position.set(x, 0, y + offset);
        scene.add(this.mesh);

        const brickTexture = TextureManager.Textures['B'];
        const newBrickTexture = brickTexture.clone();
        newBrickTexture.wrapS = THREE.RepeatWrapping;
        newBrickTexture.repeat.set(1, 0.5);

        let brickHalf = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, scale),
            new THREE.MeshPhongMaterial({
                map: newBrickTexture,
                flatShading: true,
            })
        );
        brickHalf.position.set(x, 0, y - offset);
        scene.add(brickHalf);
    }

    // only the top half of the tile is damaging
    getDamageBoundingBox() {
        return {
            x: this.x - DamageTile.tileSize / 2,
            y: this.y,
            width: DamageTile.tileSize,
            height: DamageTile.tileSize / 2
        };
    }

    // position is bottom left of mesh
    getBoundingBox() {
        if(this.damageType === 2) // if grill tile
            return {
                x: this.x - DamageTile.tileSize / 2,
                y: this.y - DamageTile.tileSize / 2,
                width: DamageTile.tileSize,
                height: DamageTile.tileSize
            };

        return {
            x: this.x - DamageTile.tileSize / 2,
            y: this.y - DamageTile.tileSize / 2,
            width: DamageTile.tileSize,
            height: DamageTile.tileSize / 2
        };
    }
}
