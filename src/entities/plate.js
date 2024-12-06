import * as THREE from 'three';
import { TextureManager } from '../managers/textureManager.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Plate{
    static plateWidth = 2;
    static plateHeight = 0.25;

    static showBoxHelper = false; // for debugging purposes - show 3d model outline
    static showBasicMesh = false; // for debuggin purposes - show original basic 3d mesh

    constructor(scene, x, y){
        this.x = x + 0.5;
        this.y = y - 0.5 + (Plate.plateHeight / 2);

        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(Plate.plateWidth, 1, Plate.plateHeight),
            new THREE.MeshPhongMaterial({ color: 0xf0f0f0 })
        );

        this.model = new THREE.Group();
        this.boxHelper = new THREE.BoxHelper();

        const modelInfo = TextureManager.Models["P"];
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
                if(Plate.showBoxHelper) {
                    this.boxHelper = new THREE.BoxHelper(this.model, 0xff0000); // Red color for the outline
                    scene.add(this.boxHelper);
                }

                // Rotate and scale the model around its center
                this.model.rotation.x = modelInfo["xRotate"]; 
                this.model.rotation.y = modelInfo["yRotate"]; 
                this.model.rotation.z = modelInfo["zRotate"]; 
                this.model.scale.set(modelInfo["xScale"], modelInfo["yScale"], modelInfo["zScale"]); 
                this.model.position.set(this.x, 0, this.y+0.01);
                if (Plate.showBoxHelper) {
                    this.boxHelper.update();
                }
            },
            (xhr) => {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                if (xhr.loaded / xhr.total * 100 == 100) {
                    console.log("Done Loading Plate");
                }
            },
            (error) => {
                console.error('An error occurred while loading the GLTF model', error);
            }
        );

        if (Plate.showBasicMesh) {
            scene.add(this.mesh);
        }

        this.mesh.position.set(this.x, 0, this.y);
    }

    // position is bottom left of mesh
    getBoundingBox(){
        return {
            x: this.x - Plate.plateWidth / 2,
            y: this.y - Plate.plateHeight / 2,
            width: Plate.plateWidth,
            height: Plate.plateHeight
        };
    }
}