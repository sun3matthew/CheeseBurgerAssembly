import * as THREE from 'three';
import { LeverColorList } from '../managers/leverColorList';
import { Collision } from '../managers/collision';
import { TextureManager } from '../managers/textureManager.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Audio } from '../managers/audio.js';

export class Button{
    static buttonWidth = 0.5;
    static buttonHeight = 0.30;

    static clickSound = '../audio/click.mp3';
    static unclickSound = '../audio/unClick.mp3';

    static showBoxHelper = false; // for debugging purposes - show 3d model outline
    static showBasicMesh = false; // for debuggin purposes - show original basic 3d mesh

    constructor(board, scene, x, y, leverID){
        this.x = x;
        this.y = y - 0.5 + (Button.buttonHeight / 2);
        this.yOffsetModel = 0.14;
        this.yOffsetModel_pressed = -0.045;

        this.board = board;

        this.leverID = leverID;
        this.associatedTiles = [];

        this.toggle = false;

        this.clickSound = new Audio(Button.clickSound, false);
        this.unclickSound = new Audio(Button.unclickSound, false);

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Button.buttonWidth, 0.75, Button.buttonHeight),
            new THREE.MeshPhongMaterial({ 
                color: LeverColorList.leverColorList[leverID] ,
                transparent: true,
                opacity: 1
            })
        );

        this.model = new THREE.Group();
        this.boxHelper = new THREE.BoxHelper();
        this.model_pressed = new THREE.Group();
        this.boxHelper_pressed = new THREE.Group();

        const modelInfo = TextureManager.Models["B"];
        const loader = new GLTFLoader();
        loader.load(
            modelInfo["path"] + this.leverID + ".glb", // Path to GLB file
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
                this.model.position.set(this.x, 0, this.y);

                // Help visualize and resize 
                if(Button.showBoxHelper) {
                    this.boxHelper = new THREE.BoxHelper(this.model, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper);
                }

                // Rotate and scale the model around its center
                this.model.rotation.x = modelInfo["xRotate"]; 
                this.model.rotation.y = modelInfo["yRotate"]; 
                this.model.rotation.z = modelInfo["zRotate"]; 
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                this.model.position.set(this.x, 0, this.y+this.yOffsetModel);

                if (Button.showBoxHelper) {
                    this.boxHelper.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading Button_Pressed");
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );
        loader.load(
            modelInfo["path"] + this.leverID + "_pressed.glb", // Path to GLB file
            (gltf) => {
                const model = gltf.scene; // imported 3D model

                // Calculate the bounding box and center the model
                const model_box = new THREE.Box3().setFromObject(model); // Calculate bounding box
                const model_center = model_box.getCenter(new THREE.Vector3()); // Get the center of the box
                model.position.sub(model_center); // Reposition the model so its center is at (0, 0, 0)

                // Create a pivot group which will act as the model
                this.model_pressed = new THREE.Group();
                this.model_pressed.add(model);

                // Add the pivot group to the scene
                scene.add(this.model_pressed);
                this.model_pressed.position.set(this.x, 0, this.y);

                // Help visualize and resize 
                if(Button.showBoxHelper) {
                    this.boxHelper_pressed = new THREE.BoxHelper(this.model_pressed, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper_pressed);
                }

                // Rotate and scale the model around its center
                this.model_pressed.rotation.x = modelInfo["xRotate"]; 
                this.model_pressed.rotation.y = modelInfo["yRotate"]; 
                this.model_pressed.rotation.z = modelInfo["zRotate"]; 
                this.model_pressed.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                this.model_pressed.position.set(this.x, 0, this.y+this.yOffsetModel_pressed);

                if (Button.showBoxHelper) {
                    this.boxHelper_pressed.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading Button");
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );

        if (Button.showBasicMesh) {
            scene.add(this.mesh);
        }

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
                this.clickSound.play();
                this.toggle = true;
                this.associatedTiles.forEach(tile => tile.toggleTile());
            }
        } else {
            if (this.toggle) {
                this.unclickSound.play();
                this.toggle = false;
                this.associatedTiles.forEach(tile => tile.toggleTile());
            }
        }

        if (this.toggle) {
            this.mesh.material.opacity = 0.4;
            this.model.position.set(this.x, 10, this.y+this.yOffsetModel);
        }
        else {
            this.mesh.material.opacity = 1;
            this.model.position.set(this.x, 0, this.y+this.yOffsetModel);
        }
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