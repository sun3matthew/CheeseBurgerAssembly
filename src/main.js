import { Input } from './input';
import { TextureManager } from './textureManager';
import { ThreeManager } from './threeManager';
import { Board } from './board';

Input.Init();
TextureManager.Init();

const threeManager = new ThreeManager(update);
const board = new Board(threeManager.scene, 1);

function update() {
	if (Input.getKey("ArrowLeft"))
		board.player2.move(-1, 0);
	if (Input.getKey("ArrowRight"))
		board.player2.move(1, 0);
	if (Input.getKey("ArrowUp"))
		board.player2.jump();

	if (Input.getKey("a"))
		board.player1.move(-1, 0);
	if (Input.getKey("d"))
		board.player1.move(1, 0);
	if (Input.getKey("w"))
		board.player1.jump();

	board.player1.update();
	board.player2.update();
}