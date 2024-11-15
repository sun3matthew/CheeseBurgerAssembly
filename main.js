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
controls.enableZoom = false;
controls.enableRotate = false;
controls.enablePan = false;

controls.minDistance = 10;
controls.maxDistance = 50;

// 0 = air (walkable)
// 1 = solid block (floor, wall, or ceiling)
// 2
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


// Create map
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


camera.position.set(12, 15, 11);
camera.lookAt(new THREE.Vector3(12, 0, 11));


////////////////////////////////////////////////
////////////////////////////////////////////////

// Define requested positions for collision detection
let req_x1 = player1.position.x;
let req_x2 = player2.position.x;
let req_z1 = player1.position.z;
let req_z2 = player2.position.z;

function onKeyDown(event) {
	const STEP_SIZE = 0.1;

	// A (player1 move left)
	if (event.keyCode === 65) {
		req_x1 -= STEP_SIZE;
	}

	// D (player1 move right)
	if (event.keyCode === 68) {
		req_x1 += STEP_SIZE;
	}

	// Left arrow (player2 move left)
	if (event.keyCode === 37) {
        req_x2 -= STEP_SIZE;
    }

	// Right arrow (player2 move right)
    if (event.keyCode === 39) {
        req_x2 += STEP_SIZE;
    }
}

// Define jump states and velocities for each player
let jump1 = false;
let jump2 = false;
let velocity1 = 0;
let velocity2 = 0;
let gravity = -0.2;

function onKeyUp(event) {
    // W (player1 jump)
    if (event.keyCode === 87 && !jump1) {
        console.log('player1 jump');
        jump1 = true;
        velocity1 = 1;
    }

    // Up arrow (player2 jump)
    if (event.keyCode === 38 && !jump2) {
        console.log('player2 jump');
        jump2 = true;
        velocity2 = 1;
    }
}

function animate() {
    requestAnimationFrame(animate);

    const playerGridHeight = playerGrid.length;
    const playerGridWidth = playerGrid[0].length;

	// Updates position while checking for collisions
	function updatePosition(player, curr_x, curr_z, req_x, req_z) {
		let round_x = Math.round(req_x);
		let round_z = Math.round(req_z);
		
		// Within x-boundaries, z-boundaries, and no block present in grid here
        if (
            round_x >= -1 && round_x < playerGridWidth &&	
            round_z >= -1 && round_z < playerGridHeight &&
            playerGrid[Math.round(round_z)][Math.round(round_x)] === 0
        ) {
            player.position.x = req_x;
            player.position.z = req_z;
        }
	}
	updatePosition(player1, player1.position.x, player1.position.z, req_x1, req_z1);
    updatePosition(player2, player2.position.x, player2.position.z, req_x2, req_z2);
	req_x1 = player1.position.x;
	req_x2 = player2.position.x;
	req_z1 = player1.position.z;
	req_z2 = player2.position.z;

    // Update player1 jump
    if (jump1) {
        player1.position.z += velocity1;
		velocity1 += gravity;
		if (player1.position.z <= 0) {
			player1.position.z = 0;
			jump1 = false;
			velocity1 = 0;
		}
    }

    // Update player2 jump
    if (jump2) {
        player2.position.z += velocity2;
		velocity2 += gravity;
		if (player2.position.z <= 0) {
			player2.position.z = 0;
			jump2 = false;
			velocity2 = 0;
    	}
	}

	function checkOutOfBounds(player, playerName) {
		if (
			player.position.x < 0 || player.position.x >= playerGridWidth ||
			player.position.z < 0 || player.position.z >= playerGridHeight
		) {
			throw new Error(`${playerName} fell out of bounds: (${player.position.x.toFixed(2)}, ${player.position.z.toFixed(2)})`);
		}
	}
	
	checkOutOfBounds(player1, "Player1");
	checkOutOfBounds(player2, "Player2");

	console.log('player1: x=%d, z=%d\nplayer2: x=%d, z=%d', player1.position.x, player1.position.z, player2.position.x, player2.position.z);

	renderer.render(scene, camera);
}