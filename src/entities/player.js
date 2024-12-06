import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';
import { Collision } from '../managers/collision.js';

export class Player{
    static playerWidth = 0.5;
    static playerHeight = 1.5;
    static playerSpeed = 0.1;

    constructor(scene, board, playerNumber, x, y){
        this.playerNumber = playerNumber;
        this.board = board;

        this.velY = 0;
        this.grounded = false;

        this.speedMultiplier = 1;

        this.dead = false;
        this.onPlate = false;

        this.onLever = undefined;
        this.numCollected = 0;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Player.playerWidth, 0.5, Player.playerHeight),
            new THREE.MeshPhongMaterial({ map: TextureManager.Textures["P" + playerNumber] })
        );
        scene.add(this.mesh);

        this.updatePosition(x, y - 0.5 + (Player.playerHeight / 2));
    }

    getAllBoundingBoxes(){
        let surroundingTiles = this.board.getTilesAroundPlayer(this.x, this.y);

        let allBoundingBoxes = surroundingTiles.map(tile => tile.getBoundingBox());
        let otherPlayer = this.playerNumber === 1 ? this.board.player2 : this.board.player1;
        allBoundingBoxes.push(otherPlayer.getBoundingBox());
        allBoundingBoxes.push(this.board.plate.getBoundingBox());

        for (let i = 0; i < this.board.blocks.length; i++) {
            let block = this.board.blocks[i];
            allBoundingBoxes.push(block.getBoundingBox());
        }

        return allBoundingBoxes;
    }

    collidedWithCollectable(){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x, this.y);
        let collectables = this.board.collectables;

        for (let i = 0; i < collectables.length; i++) {
            let collectable = collectables[i];
            if (collectable.deleted)
                continue;
            if (Collision.AABBIntersect(playerBoundingBox, collectable.getBoundingBox())) {
                if (collectable.playerID == this.playerNumber){
                    collectable.delete();
                    this.numCollected++;
                }
                break;
            }
        }
    }

    collidedWithLever(){
        this.onLever = undefined;
        
        let playerBoundingBox = this.getOffsetBoundingBox(this.x, this.y - 0.001);
        let levers = this.board.levers;

        for (let i = 0; i < levers.length; i++) {
            let lever = levers[i];
            if (Collision.AABBIntersect(playerBoundingBox, lever.getBoundingBox())) {
                this.onLever = lever;
                console.log("collided with lever");
                break;
            }
        }
    }
    

    collidedWithPlate(){
        return Collision.AABBIntersect(this.getOffsetBoundingBox(this.x, this.y - 0.001), this.board.plate.getBoundingBox());
    }

    collidedWithDamageTile(){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x, this.y - 0.001);
        let surroundingTiles = this.board.getTilesAroundPlayer(this.x, this.y);

        this.speedMultiplier = 1;

        for (let i = 0; i < surroundingTiles.length; i++) {
            let tile = surroundingTiles[i];
            if (tile.getDamageBoundingBox !== undefined) {
                let damageBoundingBox = tile.getDamageBoundingBox();
                if (Collision.AABBIntersect(playerBoundingBox, damageBoundingBox)) {
                    let stillColliding = true;
                    if (tile.damageType !== 2) {
                        // recheck if player is still colliding with damage tile if not grill

                        stillColliding = false;
                        let basePlayerBoundingBox = this.getOffsetBoundingBox(this.x, this.y);
                        if (Collision.AABBIntersect(basePlayerBoundingBox, damageBoundingBox)) {
                            stillColliding = true;
                        }
                    }

                    if (tile.damageType === 1 && stillColliding)
                        this.speedMultiplier = 0.5;


                    if (stillColliding){
                        if (tile.damageType === 0) {
                            this.dead = true;
                        }else if (tile.damageType === 1 && this.playerNumber === 2) {
                            this.dead = true;
                        }else if (tile.damageType === 2 && this.playerNumber === 1) {
                            this.dead = true;
                        }
                    }
                    // break;
                }
            }
        }
    }

    collidedWithBlock(offsetX){
        let playerBoundingBox = this.getOffsetBoundingBox(this.x + offsetX, this.y);
        let blocks = this.board.blocks;

        for (let i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (Collision.AABBIntersect(playerBoundingBox, block.getBoundingBox())) {
                return block;
            }
        }

        return undefined;
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

    move(deltaX, deltaY){
        deltaX *= Player.playerSpeed * this.speedMultiplier;
        deltaY *= Player.playerSpeed * this.speedMultiplier;

        let block = this.collidedWithBlock(deltaX);
        if (block !== undefined) {
            console.log("pushing block");
            block.push(deltaX);
            deltaX /= 2;
        }

        let newX = this.x + deltaX;
        if (!this.hasCollided(deltaX, 0)) {
            this.updatePosition(newX, this.y);
        }
        let newY = this.y + deltaY;
        if (!this.hasCollided(0, deltaY)) {
            this.updatePosition(this.x, newY);
        }
    }

    update(){
        this.collidedWithDamageTile();
        this.collidedWithLever();
        this.collidedWithCollectable();

        this.velY -= 0.01;
        let hasCollided = this.hasCollided(0, this.velY);
        // check if player is on the ground
        if (this.velY < 0) {
            if (hasCollided) {
                let groundUpperPosition = this.collisionUpperPosition(this.velY);
                if (groundUpperPosition !== undefined)
                    this.updatePosition(this.x, groundUpperPosition + Player.playerHeight / 2);
                
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
            if (!hasCollided) {
                this.updatePosition(this.x, newY);
            }
        }
    }

    jump(){
        if (this.grounded) {
            this.velY = 0.3;
            this.grounded = false;
        }
    }

    // position is bottom left of mesh
    getOffsetBoundingBox(x, y){
        return {
            x: x - Player.playerWidth / 2,
            y: y - Player.playerHeight / 2,
            width: Player.playerWidth,
            height: Player.playerHeight
        };
    }

    getBoundingBox(){
        return {
            x: this.x - Player.playerWidth / 2,
            y: this.y - Player.playerHeight / 2,
            width: Player.playerWidth,
            height: Player.playerHeight
        };
    }

    updatePosition(x, y){
        this.x = x;
        this.y = y;
        this.mesh.position.set(x, 0, y);
    }
}