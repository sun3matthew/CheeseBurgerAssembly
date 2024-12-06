import * as THREE from 'three';
import { LeverColorList } from '../managers/leverColorList';

export class Lever{
    static leverBoundingBoxWidth = 1;
    static leverBoundingBoxHeight = 1.5;

    constructor(scene, x, y, orientation, associatedBlock){
        this.x = x;
        this.y = y;
        this.leverID = associatedBlock;
        this.associatedTiles = [];

        this.toggle = false;
        this.xOffset = 0;

        this.geometry = new THREE.BoxGeometry(1.5, 0.5, 0.25);
        if (orientation === 'R')
            this.geometry.rotateY(Math.PI / 4);
        else
            this.geometry.rotateY(-Math.PI / 4);

        this.lever = new THREE.Mesh(
            this.geometry,
            new THREE.MeshPhongMaterial({ color: LeverColorList.leverColorList[associatedBlock] })
        );

        if (orientation === 'R')
            this.xOffset = 0.2;
        else
            this.xOffset = -0.2;
        this.lever.position.set(this.x + this.xOffset, 0, this.y + 0.35);
        scene.add(this.lever);
    }

    toggleLever(){
        this.toggle = !this.toggle;
        if (this.toggle){
            this.geometry.rotateY(Math.PI / 2);
            this.lever.position.set(this.x + this.xOffset, 0, this.y - 0.35);
        }else{
            this.geometry.rotateY(-Math.PI / 2);
            this.lever.position.set(this.x + this.xOffset, 0, this.y + 0.35);
        }
        this.associatedTiles.forEach(tile => tile.toggleTile());
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Lever.leverBoundingBoxWidth / 2,
            y: this.y - Lever.leverBoundingBoxHeight / 2,
            width: Lever.leverBoundingBoxWidth,
            height: Lever.leverBoundingBoxHeight
        };
    }
}