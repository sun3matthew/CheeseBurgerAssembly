import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager';

export class Collectable{
    static collectableWidth = 0.5;
    static collectableHeight = 0.5;

    constructor(scene, x, y, type){
        this.x = x;
        this.y = y - 0.5 + (Collectable.collectableHeight / 2);

        this.playerID = type;
        this.currentRotation = x;

        this.deleted = false;


        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Collectable.collectableWidth, Collectable.collectableWidth, Collectable.collectableHeight),
            new THREE.MeshPhongMaterial({ 
                map: TextureManager.Textures["C" + type],
                transparent: true,
                opacity: 1
            })
            
        );
        scene.add(this.mesh);

        this.mesh.position.set(this.x, 0, this.y);
    }

    delete(){
        this.mesh.material.opacity = 0;
        this.deleted = true;
    }

    update(){
        this.currentRotation += 0.04;
        this.mesh.rotation.z = this.currentRotation;
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Collectable.collectableWidth / 2,
            y: this.y - Collectable.collectableHeight / 2,
            width: Collectable.collectableWidth,
            height: Collectable.collectableHeight
        };
    }
}