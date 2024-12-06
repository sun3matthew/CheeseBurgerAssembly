import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';
import { Collision } from '../managers/collision.js';

export class Block{
    static blockWidth = 1;
    static blockHeight = 0.75;

    constructor(scene, board, x, y){
        this.x = x;
        this.y = y - 0.5 + (Block.blockHeight / 2);

        this.velY = 0;

        this.board = board;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Block.blockWidth, 1, Block.blockHeight),
            new THREE.MeshPhongMaterial({ map: TextureManager.Textures["S"] })
        );
        scene.add(this.mesh);

        this.mesh.position.set(this.x, 0, this.y);
    }

    // ! Horrible code duplication
    getAllBoundingBoxes(){
        let surroundingTiles = this.board.getTilesAroundPlayer(this.x, this.y);

        let allBoundingBoxes = surroundingTiles.map(tile => tile.getBoundingBox());
        allBoundingBoxes.push(this.board.player1.getBoundingBox());
        allBoundingBoxes.push(this.board.player2.getBoundingBox());
        allBoundingBoxes.push(this.board.plate.getBoundingBox());

        for (let i = 0; i < this.board.blocks.length; i++) {
            let block = this.board.blocks[i];
            if (block !== this)
                allBoundingBoxes.push(block.getBoundingBox());
        }

        return allBoundingBoxes;
    }

    hasCollided(offsetX, offsetY){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x + offsetX, this.y + offsetY);
        let allBoundingBoxes = this.getAllBoundingBoxes();

        for (let i = 0; i < allBoundingBoxes.length; i++) {
            let boundingBoxes = allBoundingBoxes[i];
            if (Collision.AABBIntersect(playerBoundingBox, boundingBoxes))
                return true;
        }

        return false;
    }

    collisionUpperPosition(offsetY){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x, this.y + offsetY);
        let allBoundingBoxes = this.getAllBoundingBoxes();

        for (let i = 0; i < allBoundingBoxes.length; i++) {
            let boundingBoxes = allBoundingBoxes[i];
            if (Collision.AABBIntersect(playerBoundingBox, boundingBoxes))
                return boundingBoxes.y + boundingBoxes.height;
        }
    }

    collidedWithBlock(offsetX){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x + offsetX, this.y);
        let blocks = this.board.blocks;

        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (block === this)
                continue;

            if (Collision.AABBIntersect(playerBoundingBox, block.getBoundingBox()))
                return block;
        }
        return undefined;
    }

    push(offsetX){
        let hasCollided = this.hasCollided(offsetX, 0);
        if (!hasCollided) {
            this.updatePosition(this.x + offsetX, this.y);
        }else{
            let block = this.collidedWithBlock(offsetX);
            if (block !== undefined) {
                block.push(offsetX);
            }
        }
    }


    update(){
        this.velY -= 0.01;
        let hasCollided = this.hasCollided(0, this.velY);
        // check if block is on the ground
        if (this.velY < 0) {
            if (hasCollided) {
                let groundUpperPosition = this.collisionUpperPosition(this.velY);
                if (groundUpperPosition !== undefined)
                    this.updatePosition(this.x, groundUpperPosition + Block.blockHeight / 2);
                
                this.velY = 0;
                this.grounded = true;
            }else{
                this.grounded = false;
            }
        }else{
            if (hasCollided) {
                this.velY = 0;
            }
        }

        if(!this.grounded){
            let newY = this.y + this.velY;
            // let newY = this.y;
            if (!hasCollided) {
                this.updatePosition(this.x, newY);
            }
        }
    }

    // position is bottom left of mesh
    getOffsetBoundingBox(x, y){
        return {
            x: x - Block.blockWidth / 2,
            y: y - Block.blockHeight / 2,
            width: Block.blockWidth,
            height: Block.blockHeight
        };
    }


    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Block.blockWidth / 2,
            y: this.y - Block.blockHeight / 2,
            width: Block.blockWidth,
            height: Block.blockHeight
        };
    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
        this.mesh.position.set(x, 0, y);
    }
}