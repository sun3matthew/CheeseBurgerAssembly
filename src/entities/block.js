import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';
import { Collision } from '../managers/collision.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Block{
    static blockWidth = 1;
    static blockHeight = 0.75;

    static showBoxHelper = true; // for debugging purposes - show 3d model outline
    static showBasicMesh = false; // for debuggin purposes - show original basic 3d mesh

    constructor(scene, board, x, y){
        this.x = x;
        this.y = y - 0.5 + (Block.blockHeight / 2);

        this.velY = 0;

        this.board = board;

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Block.blockWidth, 1, Block.blockHeight),
            new THREE.MeshPhongMaterial({ map: TextureManager.Textures["S"] })
        );

        this.model = new THREE.Group();
        this.boxHelper = new THREE.BoxHelper();

        const modelInfo = TextureManager.Models["S"];
        const loader = new GLTFLoader();
        loader.load(
            modelInfo["path"], // Path to GLB file
            (gltf) => {
                const model = gltf.scene; // imported 3D model

                // Calculate the bounding box and center the model
                const model_box = new THREE.Box3().setFromObject(model); // Calculate bounding box
                const model_center = model_box.getCenter(new THREE.Vector3()); // Get the center of the box
                model.position.sub(model_center); // Reposition the model so its center is at (0, 0, 0)

                // Create a pivot group which will act as the model
                this.model = new THREE.Group();
                this.model.add(model);

                // Add the pivot group to the scene
                scene.add(this.model);

                // Help visualize and resize 
                if(Block.showBoxHelper) {
                    this.boxHelper = new THREE.BoxHelper(this.model, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper);
                }

                // Rotate and scale the model around its center
                this.model.rotation.x = modelInfo["xRotate"]; 
                this.model.rotation.y = modelInfo["yRotate"]; 
                this.model.rotation.z = modelInfo["zRotate"]; 
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                if (Block.showBoxHelper) {
                    this.boxHelper.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading Block");
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );

        if (Block.showBasicMesh) {
            scene.add(this.mesh);
        }

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
                if (groundUpperPosition !== undefined) {
                    this.updatePosition(this.x, groundUpperPosition + Block.blockHeight / 2);
                }
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
        this.model.position.set(x, 0, y);
        if (Block.showBoxHelper) {
            this.boxHelper.update();
        }
    }
}