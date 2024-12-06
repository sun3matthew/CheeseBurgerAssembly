import * as THREE from 'three';
import { TextureManager } from './textureManager';

export class ThreeManager{
    constructor( update ) {
        this.update = () => {}
        this._update = update;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setAnimationLoop( () => {
            this.update();
            renderer.render( this.scene, this.camera );
        });
        document.body.appendChild( renderer.domElement );

        this.camera.position.set(12, -15, 11);
        this.camera.lookAt(new THREE.Vector3(12, 0, 11));
    }

    createEmptyBoard(){
        this.deleteAll();

        let light = new THREE.PointLight(0xffffff, 1, 0, 0.5);
        light.position.set(20, -5, 20);
        light.power = 100; 
        this.scene.add(light);

        let light2 = new THREE.PointLight(0xffffff, 1, 0, 0.5);
        light2.position.set(5, -5, 5);
        light2.power = 100; 
        this.scene.add(light2);

        let backgroundTexture = TextureManager.Textures["background"];
        backgroundTexture.wrapS = THREE.RepeatWrapping;
        backgroundTexture.wrapT = THREE.RepeatWrapping;
        backgroundTexture.repeat.set(10, 10);
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50, 1, 1),
            new THREE.MeshPhongMaterial({ map: backgroundTexture, side: THREE.DoubleSide })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0.5;
        this.scene.add(ground);
    }

    pause(){
        this.update = () => {};
    }

    start(){
        this.update = this._update;
    }

    deleteAll(){
        while(this.scene.children.length > 0){ 
            this.scene.remove(this.scene.children[0]); 
        }
    }
}