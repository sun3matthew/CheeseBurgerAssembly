import { Input } from './managers/Input';
import { TextureManager } from './managers/textureManager';
import { ThreeManager } from './managers/threeManager';
import { Board } from './board';
import { Levels } from './managers/levels';

Input.Init();
TextureManager.Init();

let threeManager;
let board;

let level = 0;
let totalLevels = 3;

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


function update() {
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

	if (board.player1.collidedWithPlate() && board.player2.collidedWithPlate())
		nextLevel();
}

startGame();