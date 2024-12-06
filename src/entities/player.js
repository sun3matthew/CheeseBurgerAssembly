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

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Player.playerWidth, 0.5, Player.playerHeight),
            new THREE.MeshPhongMaterial({ map: TextureManager.Textures["P" + playerNumber] })
        );
        scene.add(this.mesh);

        this.updatePosition(x, y - 0.5 + (Player.playerHeight / 2));
    }

    hasCollided(offsetX, offsetY){
        let surroundingTiles = this.board.getTilesAroundPlayer(this);
        let playerBoundingBox = this.getOffsetBoundingBox(this.x + offsetX, this.y + offsetY);

        let allBoundingBoxes = surroundingTiles.map(tile => tile.getBoundingBox());
        let otherPlayer = this.playerNumber === 1 ? this.board.player2 : this.board.player1;
        allBoundingBoxes.push(otherPlayer.getBoundingBox());

        for (let i = 0; i < allBoundingBoxes.length; i++) {
            let tileBoundingBox = allBoundingBoxes[i];
            if (Collision.AABBIntersect(playerBoundingBox, tileBoundingBox))
                return true;
        }

        return false;
    }

    groundUpperPosition(offsetY){
        let surroundingTiles = this.board.getTilesAroundPlayer(this);
        let playerBoundingBox = this.getOffsetBoundingBox(this.x, this.y + offsetY);

        for (let i = 0; i < surroundingTiles.length; i++) {
            let tile = surroundingTiles[i];
            let tileBoundingBox = tile.getBoundingBox();
            if (Collision.AABBIntersect(playerBoundingBox, tileBoundingBox))
                return tileBoundingBox.y + tileBoundingBox.height;
        }
    }

    move(deltaX, deltaY){
        deltaX *= Player.playerSpeed;
        deltaY *= Player.playerSpeed;

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
        this.velY -= 0.01;
        let hasCollided = this.hasCollided(0, this.velY);
        // check if player is on the ground
        if (this.velY < 0) {
            if (hasCollided) {
                let groundUpperPosition = this.groundUpperPosition(this.velY);
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