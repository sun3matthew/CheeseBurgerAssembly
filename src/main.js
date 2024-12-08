import { Input } from './managers/Input';
import { TextureManager } from './managers/textureManager';
import { ThreeManager } from './managers/threeManager';
import { Board } from './board';
import { Levels } from './managers/levels';
import { Audio } from './managers/audio.js';
import * as THREE from 'three';

Input.Init();
TextureManager.Init();

let threeManager;
let board;

let level = 0;
let totalLevels = 5;

const listener = new THREE.AudioListener();
const loader = new THREE.AudioLoader();
const sound = new THREE.Audio(listener);
loader.load(
	'../public/audio/background.mp3',
	(buffer) => {
		sound.setBuffer(buffer);
		sound.setLoop(true); 
		sound.setVolume(1);
	}
)
sound.play();

async function startGame() {
	await Levels.loadLevels(totalLevels);
	
	threeManager = new ThreeManager(update);
	nextLevel();
}

function nextLevel() {
	
	level++;
	if (level > totalLevels){
		console.log("You win!");
		level = 1;
	}
	console.log("Level", level);
	resetLevel();
}

function resetLevel() {
	threeManager.createEmptyBoard();
	board = new Board(threeManager.scene, level);
	threeManager.start();
}


let pause = false;

function update() {
	if (Input.getKeyDown(" ")){
		pause = !pause;
		if (pause)
			threeManager.turnOffLights();
		else
			threeManager.turnOnLights();
	}

	if (pause)
		return;

	// when you press r restart
	if (Input.getKeyDown("r")) {
		resetLevel();
		return;
	}

	if (Input.getKeyDown("Enter")) {
		nextLevel();
		return;
	}

	if (Input.getKey("ArrowLeft"))
		board.player2.move(-1, 0);
	if (Input.getKey("ArrowRight"))
		board.player2.move(1, 0);
	if (Input.getKey("ArrowUp"))
		board.player2.jump();
	if (Input.getKeyDown("ArrowDown") && board.player2.onLever !== undefined)
		board.player2.onLever.toggleLever();

	if (Input.getKey("a"))
		board.player1.move(-1, 0);
	if (Input.getKey("d"))
		board.player1.move(1, 0);
	if (Input.getKey("w"))
		board.player1.jump();
	if (Input.getKeyDown("s") && board.player1.onLever !== undefined)
		board.player1.onLever.toggleLever();

	board.update();

	if (board.player1.dead || board.player2.dead)
		resetLevel();

	if (board.player1.collidedWithPlate() && board.player2.collidedWithPlate() && board.numCollectables1 === board.player1.numCollected && board.numCollectables2 === board.player2.numCollected) {
		//console.log("won");
		// let sound = new Audio("./audio/levelUp.mp3", false);
		// const sourceNode = sound.getSound().source; // Access the AudioBufferSourceNode
    	// sourceNode.onended = () => {
		// 	console.log('First audio finished, playing second audio...');
		// 	//sound.play();
    	// };
		// sound.play();

		nextLevel();
	}
}

startGame();