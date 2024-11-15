import * as THREE from 'three';
import { TextureManager } from './textureManager.js';
import { Levels } from './levels.js';
import { Player } from './player.js';
import { Tile } from './tile.js';

export class Board {
    constructor(scene, level) { // level is 1, 2, 3..
        let grid = Levels.Levels[level].playerGrid;
        this.tiles = [];
        this.numRows = grid.length;
        this.numCols = grid[0].length;

        this.player1 = null;
        this.player2 = null;

        for (let i = grid.length - 1; i >= 0; i--) {
            let row = [];
            for (let j = 0; j < grid[i].length; j++) {
                let posZ = grid.length - i - 1;
                let entry = grid[i][j];
                if (entry > 0) {
                    row.push(new Tile(scene, entry, j, posZ));
                }else{
                    row.push(undefined);

                    if (entry === -1) {
                        this.player1 = new Player(scene, this, 1, j, posZ);
                    }else if (entry === -2) {
                        this.player2 = new Player(scene, this, 2, j, posZ);
                    }else if (entry === -3) { // TODO: plate class
                        let plate = new THREE.Mesh(
                            new THREE.BoxGeometry(2, 1, 0.25),
                            new THREE.MeshPhongMaterial({ color: 0xc0ffc0 })
                        );
                        plate.position.set(j, 0, posZ - 0.35);
                        scene.add(plate);
                    }else if (entry === -4) {
                        let plate = new THREE.Mesh(
                            new THREE.BoxGeometry(2, 1, 0.25),
                            // yellow
                            new THREE.MeshPhongMaterial({ color: 0xffffc0 })
                        );
                        plate.position.set(j, 0, posZ - 0.35);
                        scene.add(plate);
                    }
                }
            }
            this.tiles.push(row);
        }

        this.createBorder(scene, 10);
    }

    getTilesAroundPlayer(player){
        let x = Math.floor(player.x);
        let y = Math.floor(player.y);
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
                    map: TextureManager.TileTextures[0],
                    flatShading: true,
                });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(j - bufferSize, 0, i - bufferSize);
                scene.add(cube);
            }
        }
    }
}
