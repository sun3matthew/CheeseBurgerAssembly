import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Collectable{
    static collectableWidth = 0.5;
    static collectableHeight = 0.5;

    static spinRate = 0.04;
    static hoverRate = 0.02;
    static hoverRange = 0.3;

    static showBoxHelper = false; // for debugging purposes - show 3d model outline
    static showBasicMesh = false; // for debuggin purposes - show original basic 3d mesh

    constructor(scene, x, y, type){
        this.x = x;
        this.y = y - 0.5 + (Collectable.collectableHeight / 2);

        this.playerID = type;
        this.currentRotation = x;
        this.currentHover = x;

        this.deleted = false;

        

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Collectable.collectableWidth, Collectable.collectableWidth, Collectable.collectableHeight),
            new THREE.MeshPhongMaterial({ 
                map: TextureManager.Textures["C" + type],
                transparent: true,
                opacity: 1
            })
        );

        this.model = new THREE.Group();
        this.boxHelper = new THREE.BoxHelper();

        const modelInfo = TextureManager.Models["C" + type];
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
                if(Collectable.showBoxHelper) {
                    this.boxHelper = new THREE.BoxHelper(this.model, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper);
                }

                // Rotate and scale the model around its center
                this.model.rotation.x = modelInfo["xRotate"]; 
                this.model.rotation.y = modelInfo["yRotate"]; 
                this.model.rotation.z = modelInfo["zRotate"]; 
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                if (Collectable.showBoxHelper) {
                    this.boxHelper.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading C" + type);
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );

        if (Collectable.showBasicMesh) {
            scene.add(this.mesh);
        }

        this.mesh.position.set(this.x, 0, this.y);
    }

    delete(){
        this.mesh.material.opacity = 0;
        this.model.scale.set(0,0,0);
        this.deleted = true;
    }

    update() {
        // rotate the collectible + 3d model
        this.currentRotation += Collectable.spinRate;
        this.mesh.rotation.z = this.currentRotation;
        if (this.playerID==1) {
            this.model.rotation.y = -this.currentRotation;
        } else {
            this.model.rotation.z = this.currentRotation;
        }
        
        // hover the collectible + 3d model
        this.currentHover += Collectable.hoverRate;
        let deltaHover = Collectable.hoverRange*Math.sin(this.currentHover)+Collectable.hoverRange;
        this.mesh.position.set(this.x, 0, this.y+deltaHover);
        this.model.position.set(this.x, 0, this.y+deltaHover);

        if (Collectable.showBoxHelper) {
            this.boxHelper.update();
        }
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Collectable.collectableWidth / 2,
            y: this.y - Collectable.collectableHeight / 2,
            width: Collectable.collectableWidth,
            height: Collectable.collectableHeight
        };
    }
}