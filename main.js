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
// 2.5D game. Derived from fire boy and water girl. 
let playerGrid = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0, 0, 0, 0, -4, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
	[1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, -1, 0, 1, 3, 3, 3, 3, 1, 1, 1, 1, 4, 4, 4, 4, 1, 0, -2, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



// let light = new THREE.AmbientLight(0xffffff);
// scene.add(light);

// directional light
let light = new THREE.PointLight(0xffffff, 1, 0, 0.5);
light.position.set(20, 5, 20);
light.power = 100; 
scene.add(light);

let light2 = new THREE.PointLight(0xffffff, 1, 0, 0.5);
light2.position.set(5, 5, 5);
light2.power = 100; 
scene.add(light2);

const textureLoader = new THREE.TextureLoader();

// Load the texture
const player1Texture = textureLoader.load('lettuce.png');
const player2Texture = textureLoader.load('bread.png');

// const texture = textureLoader.load('brick.png');
const textures = [
	textureLoader.load('brick.png'),
	textureLoader.load('oil.png'), // tar
	textureLoader.load('grill.png'),
	textureLoader.load('water.png'),
];

// Set the texture's color space to sRGB for accurate color representation
// texture.colorSpace = THREE.SRGBColorSpace;
for (let i = 0; i < textures.length; i++) {
	textures[i].colorSpace = THREE.SRGBColorSpace;
}

for (let i = 0; i < playerGrid.length; i++) {
	for (let j = 0; j < playerGrid[i].length; j++) {
		if (playerGrid[i][j] > 0) {
			const geometry = new THREE.BoxGeometry(1, 1, 1);
			const material = new THREE.MeshPhongMaterial({
				map: textures[playerGrid[i][j] - 1],
				flatShading: true,
			});
			const cube = new THREE.Mesh(geometry, material);
			cube.position.set(j, 0, i);
			scene.add(cube);
		}
	}
}

let bufferSize = 10;
// Add a extra 10 tiles to each side of the player grid for visuals
for (let i = 0; i < playerGrid.length + bufferSize * 2; i++) {
	for (let j = 0; j < playerGrid[0].length + bufferSize * 2; j++) {
		if (i >= bufferSize && i < playerGrid.length + bufferSize && j >= bufferSize && j < playerGrid[0].length + bufferSize) {
			continue;
		}
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshPhongMaterial({
			map: textures[0],
			flatShading: true,
		});
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(j - bufferSize, 0, i - bufferSize);
		scene.add(cube);
	}
}

// add background flat plane


// player 1 (-1) and player 2 (-2)
let player1 = new THREE.Mesh(
	new THREE.BoxGeometry(0.5, 0.5, 1),
	new THREE.MeshPhongMaterial({ map: player1Texture })
);
scene.add(player1);

let player2 = new THREE.Mesh(
	new THREE.BoxGeometry(0.5, 0.5, 1),
	new THREE.MeshPhongMaterial({ map: player2Texture })
);
scene.add(player2);

let plate1 = new THREE.Mesh(
	new THREE.BoxGeometry(2, 1, 0.25),
	new THREE.MeshPhongMaterial({ color: 0xffffff })
);
scene.add(plate1);

let plate2 = new THREE.Mesh(
	new THREE.BoxGeometry(2, 1, 0.25),
	new THREE.MeshPhongMaterial({ color: 0xffffff })
);
scene.add(plate2);

for (let i = 0; i < playerGrid.length; i++) {
	for (let j = 0; j < playerGrid[i].length; j++) {
		if (playerGrid[i][j] === -1) {
			player1.position.set(j, 0, i);
		}
		if (playerGrid[i][j] === -2) {
			player2.position.set(j, 0, i);
		}
		if (playerGrid[i][j] === -3) {
			plate1.position.set(j, 0, i + 0.35);
		}
		if (playerGrid[i][j] === -4) {
			plate2.position.set(j, 0, i + 0.35);
		}
	}
}



// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

let backgroundTexture = textureLoader.load('background.png');
backgroundTexture.wrapS = THREE.RepeatWrapping;
backgroundTexture.wrapT = THREE.RepeatWrapping;
backgroundTexture.repeat.set(10, 10);

const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(50, 50, 1, 1),
	new THREE.MeshPhongMaterial({ map: backgroundTexture, side: THREE.DoubleSide })
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