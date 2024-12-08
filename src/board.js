import * as THREE from 'three';
import { TextureManager } from './managers/textureManager.js';
import { Levels } from './managers/levels.js';
import { Player } from './entities/player.js';
import { Plate } from './entities/plate.js';
import { Tile } from './tiles/tile.js';
import { DamageTile } from './tiles/damageTile.js';
import { Block } from './entities/block.js';
import { Lever } from './entities/lever.js';
import { Button } from './entities/button.js';
import { Collectable } from './entities/collectable.js';
import { Audio } from './managers/audio.js';

export class Board {
    constructor(scene, level) { // level is 1, 2, 3..
        let grid = Levels.Levels[level];

        this.tiles = [];
        this.numRows = grid.length;
        this.numCols = grid[0].length;

        this.player1 = null;
        this.player2 = null;

        this.plate = null;

        this.blocks = [];

        this.levers = [];
        this.buttons = [];
        this.collectables = [];

        this.numCollectables1 = 0;
        this.numCollectables2 = 0;

        for (let i = grid.length - 1; i >= 0; i--) {
            let row = [];
            for (let j = 0; j < grid[i].length; j++) {
                let posZ = grid.length - i - 1;
                let entry = grid[i][j];
                if (entry[0] == 'T') {
                    if (entry[1] == 'B') {
                        row.push(new Tile(scene, entry, j, posZ, entry[2]));
                    }else{
                        row.push(new DamageTile(scene, entry, j, posZ));
                    }
                }else{
                    row.push(undefined);

                    let entityType = entry[1];

                    if (entityType === 'P') {
                        let playerNumber = parseInt(entry[2]);
                        if (playerNumber === 1) {
                            this.player1 = new Player(scene, this, 1, j, posZ);
                        }else if (playerNumber === 2) {
                            this.player2 = new Player(scene, this, 2, j, posZ);
                        }
                    }else if (entityType === 'F') {
                        this.plate = new Plate(scene, j, posZ);
                    }else if (entityType === 'R' || entityType === 'L') {
                        this.levers.push(new Lever(scene, j, posZ, entityType, entry[2]));
                    }else if (entityType === 'B') {
                        this.buttons.push(new Button(this, scene, j, posZ, entry[2]));
                    }else if (entityType === 'S') {
                        this.blocks.push(new Block(scene, this, j, posZ));
                    }else if (entityType === 'C') {
                        this.collectables.push(new Collectable(scene, j, posZ, entry[2]));
                        if (entry[2] == 1) {
                            this.numCollectables1++;
                        }else if (entry[2] == 2) {
                            this.numCollectables2++;
                        }
                    }

                }
            }
            this.tiles.push(row);
        }

        let interactiveTileToggles = [];
        for (let i = 0; i < this.levers.length; i++) {
            interactiveTileToggles.push(this.levers[i]);
        }
        for (let i = 0; i < this.buttons.length; i++) {
            interactiveTileToggles.push(this.buttons[i]);
        }


        for (let i = 0; i < interactiveTileToggles.length; i++) {
            let interactiveTileToggle = interactiveTileToggles[i];
            for (let row = 0; row < this.tiles.length; row++) {
                for (let col = 0; col < this.tiles[row].length; col++) {
                    let tile = this.tiles[row][col];
                    if (tile !== undefined && tile.associatedLever === interactiveTileToggle.leverID) {
                        interactiveTileToggle.associatedTiles.push(tile);
                    }
                }
            }
        }

        this.createBorder(scene, 10);
    }

    update(){
        this.player1.update();
        this.player2.update();

        for (let i = 0; i < this.blocks.length; i++)
            this.blocks[i].update();
        for (let i = 0; i < this.buttons.length; i++) 
            this.buttons[i].update();
        for (let i = 0; i < this.collectables.length; i++) 
            this.collectables[i].update();
    }

    getTilesAroundPlayer(posX, posY) {
        let x = Math.floor(posX);
        let y = Math.floor(posY);
        let tiles = [];
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                if (y + i >= 0 && y + i < this.numRows && x + j >= 0 && x + j < this.numCols) {
                    let tile = this.tiles[y + i][x + j];
                    if (tile !== undefined) {
                        tiles.push(tile);
                    }
                }
            }
        }
        return tiles;
    }

    createBorder(scene, bufferSize){
        for (let i = 0; i < this.numRows + bufferSize * 2; i++) {
            for (let j = 0; j < this.numCols + bufferSize * 2; j++) {
                if (i >= bufferSize && i < this.numRows + bufferSize && j >= bufferSize && j < this.numCols + bufferSize) {
                    continue;
                }
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshPhongMaterial({
                    map: TextureManager.Textures['B'],
                    flatShading: true,
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(j - bufferSize, 0, i - bufferSize);
                scene.add(cube);
            }
        }
    }
}
