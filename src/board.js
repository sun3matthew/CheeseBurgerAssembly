import * as THREE from 'three';
import { TextureManager } from './managers/textureManager.js';
import { Levels } from './managers/levels.js';
import { Player } from './entities/player.js';
import { Plate } from './entities/plate.js';
import { Tile } from './tiles/tile.js';
import { DamageTile } from './tiles/damageTile.js';

export class Board {
    constructor(scene, level) { // level is 1, 2, 3..
        let grid = Levels.Levels[level];

        this.tiles = [];
        this.numRows = grid.length;
        this.numCols = grid[0].length;

        this.player1 = null;
        this.player2 = null;

        this.plate = null;

        for (let i = grid.length - 1; i >= 0; i--) {
            let row = [];
            for (let j = 0; j < grid[i].length; j++) {
                let posZ = grid.length - i - 1;
                let entry = grid[i][j];
                if (entry[0] == 'T') {
                    if (entry[1] == 'B') {
                        row.push(new Tile(scene, entry, j, posZ));
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
                    }else if (entityType === 'R') {
                        // leaver. rectangle at 45 degrees
                        let geometry = new THREE.BoxGeometry(1.5, 0.5, 0.25);
                        geometry.rotateY(Math.PI / 4);
                        let plate = new THREE.Mesh(
                            geometry,
                            new THREE.MeshPhongMaterial({ color: 0xf0e0e0 })
                        );
                        plate.position.set(j + 0.2, 0, posZ - 0.35);
                        scene.add(plate);
                    }else if (entityType === 'L') {
                        // leaver. rectangle at 45 degrees
                        let geometry = new THREE.BoxGeometry(1.5, 0.5, 0.25);
                        geometry.rotateY(-Math.PI / 4);
                        let plate = new THREE.Mesh(
                            geometry,
                            new THREE.MeshPhongMaterial({ color: 0xe0e0f0 })
                        );
                        plate.position.set(j - 0.2, 0, posZ - 0.35);
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
