import * as THREE from 'three';

export class Plate{
    static plateWidth = 2;
    static plateHeight = 0.25;

    constructor(scene, x, y){
        this.x = x;
        this.y = y - 0.5 + (Plate.plateHeight / 2);

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Plate.plateWidth, 1, Plate.plateHeight),
            new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })
        );
        scene.add(this.mesh);

        this.mesh.position.set(this.x, 0, this.y);
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Plate.plateWidth / 2,
            y: this.y - Plate.plateHeight / 2,
            width: Plate.plateWidth,
            height: Plate.plateHeight
        };
    }
}