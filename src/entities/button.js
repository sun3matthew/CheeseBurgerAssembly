import * as THREE from 'three';
import { LeverColorList } from '../managers/leverColorList';
import { Collision } from '../managers/collision';

export class Button{
    static buttonWidth = 0.5;
    static buttonHeight = 0.10;

    constructor(board, scene, x, y, leverID){
        this.x = x;
        this.y = y - 0.5 + (Button.buttonHeight / 2);

        this.board = board;

        this.leverID = leverID;
        this.associatedTiles = [];

        this.toggle = false;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Button.buttonWidth, 0.75, Button.buttonHeight),
            new THREE.MeshPhongMaterial({ 
                color: LeverColorList.leverColorList[leverID] ,
                transparent: true,
                opacity: 1
            })
        );
        scene.add(this.mesh);

        this.mesh.position.set(this.x, 0, this.y);
    }

    update(){
        let boundingBox = this.getBoundingBox();
        let player1BoundingBox = this.board.player1.getBoundingBox();
        let player2BoundingBox = this.board.player2.getBoundingBox();

        let blocks = this.board.blocks;
        let intersectingWithBlock = false;
        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (Collision.AABBIntersect(boundingBox, block.getBoundingBox())) {
                intersectingWithBlock = true;
                break;
            }
        }

        if (Collision.AABBIntersect(boundingBox, player1BoundingBox) || Collision.AABBIntersect(boundingBox, player2BoundingBox) || intersectingWithBlock) {
            if (!this.toggle) {
                this.toggle = true;
                this.associatedTiles.forEach(tile => tile.toggleTile());
            }
        } else {
            if (this.toggle) {
                this.toggle = false;
                this.associatedTiles.forEach(tile => tile.toggleTile());
            }
        }

        if (this.toggle)
            this.mesh.material.opacity = 0.4;
        else
            this.mesh.material.opacity = 1;
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Button.buttonWidth / 2,
            y: this.y - Button.buttonHeight / 2,
            width: Button.buttonWidth,
            height: Button.buttonHeight
        };
    }
}