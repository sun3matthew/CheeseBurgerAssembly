import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enabled = true;
controls.minDistance = 10;
controls.maxDistance = 50;

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(1000, 1000, 1, 1),
	new THREE.MeshBasicMaterial({ color: 0xffffff , side: THREE.DoubleSide })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.5;
scene.add(ground);

camera.position.z = 5;

function onKeyDown(event) {
	// wasd
	if (event.keyCode === 87) {
		cube.position.z -= 0.1;
	}
	if (event.keyCode === 83) {
		cube.position.z += 0.1;
	}
	if (event.keyCode === 65) {
		cube.position.x -= 0.1;
	}
	if (event.keyCode === 68) {
		cube.position.x += 0.1;
	}
}

function onKeyUp(event) {
	if (event.keyCode === 32 && !jump) {
		console.log('space');
		jump = true;
		velocity = 1;
	}
}

let gravity = -0.08;
let velocity = 0;
let jump = false;

function animate() {

	if (jump) {
		velocity += gravity;
		cube.position.y += velocity;
		if (cube.position.y <= 0) {
			cube.position.y = 0;
			jump = false;
			velocity = 0;
		}
	}

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );

}