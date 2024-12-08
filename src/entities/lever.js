import * as THREE from 'three';
import { LeverColorList } from '../managers/leverColorList';
import { TextureManager } from '../managers/textureManager.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Audio } from '../managers/audio.js';

export class Lever{
    static leverBoundingBoxWidth = 1;
    static leverBoundingBoxHeight = 1.5;

    static leverAngle = Math.PI / 2.6;

    static flipSound = '../audio/lever.mp3';

    static showBoxHelper = false; // for debugging purposes - show 3d model outline
    static showBasicMesh = false; // for debuggin purposes - show original basic 3d mesh

    constructor(scene, x, y, orientation, associatedBlock){
        this.x = x;
        this.y = y;
        this.leverID = associatedBlock;
        this.associatedTiles = [];
        this.orientation = orientation;

        this.toggle = false;
        this.xOffsetModel = 0.18; // positive = brings closer to wall
        this.yOffsetModel= -0.2;
        this.xOffset = 0.35; // positive = brings closer to wall
        this.yOffset = this.yOffsetModel - 0.2;

        this.sound = new Audio(Lever.flipSound, false);

        this.lever = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.35, 0.35),
            new THREE.MeshPhongMaterial({ 
                color: LeverColorList.leverColorList[associatedBlock],
                transparent: true,
                opacity: 0.5 
            })
        );
            
        if (orientation === 'R') {
            this.lever.rotateY(Lever.leverAngle);
        } else {
            this.xOffset = -this.xOffset;
            this.xOffsetModel = -this.xOffsetModel;
            this.lever.rotateY(-Lever.leverAngle);
        }

        this.model = new THREE.Group();
        this.boxHelper = new THREE.BoxHelper();

        const modelInfo = TextureManager.Models["L"];
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

                // Help visualize and resize 
                if(Lever.showBoxHelper) {
                    this.boxHelper = new THREE.BoxHelper(this.model, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper);
                }

                // Rotate and scale the model around its center
                this.model.rotation.x = modelInfo["xRotate"]; 
                this.model.rotation.y = modelInfo["yRotate"]; 
                this.model.rotation.z = modelInfo["zRotate"]; 
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                if (orientation != "R") {
                    this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], -modelInfo["zScale"]); 
                }
                this.model.position.set(this.x + this.xOffsetModel, 0, this.y +this.yOffsetModel);

                if (Lever.showBoxHelper) {
                    this.boxHelper.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading Lever" + this.leverID);
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );

        this.lever.position.set(this.x + this.xOffset, -0, this.y + this.yOffset);
        if (Lever.showBasicMesh) {
            scene.add(this.lever);
        }
    }

    toggleLever(){
        this.sound.play();
        this.toggle = !this.toggle;
        let modelInfo = TextureManager.Models["L"];
        if (this.toggle){ // flip the lever down
            //this.lever.position.set(this.x + this.xOffset, -0.5, this.y + this.yOffset);
            if (this.orientation == "R") {
                this.lever.rotateY(-(Math.PI / 2 - 2*Lever.leverAngle ));
                this.model.scale.set(modelInfo["xScale"], -modelInfo["yScale"], modelInfo["zScale"]);
            } else {
                this.lever.rotateY(Math.PI / 2 - 2*Lever.leverAngle);
                this.model.scale.set(modelInfo["xScale"], -modelInfo["yScale"], -modelInfo["zScale"]);
            }
            this.lever.position.set(this.x + this.xOffset, 0, this.y + this.yOffset - 0.2);
            this.model.position.set(this.x + this.xOffsetModel, 0, this.y - 0.5);
        } else { // flip the lever u
            //this.lever.position.set(this.x + this.xOffset, -0.5, this.y + this.yOffset);
            if (this.orientation == "R") {
                this.lever.rotateY(Math.PI / 2 - 2*Lever.leverAngle);
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]);
            } else {
                this.lever.rotateY(-(Math.PI / 2 - 2*Lever.leverAngle ));
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], -modelInfo["zScale"]);
            }
            this.lever.position.set(this.x + this.xOffset, 0, this.y + this.yOffset);
            this.model.position.set(this.x + this.xOffsetModel, 0, this.y +this.yOffsetModel);
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