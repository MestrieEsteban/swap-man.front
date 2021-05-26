import { LEVEL, OBJECT_TYPE } from './setup';
import { randomMovement } from './ghostmoves';

// Classes
import GameBoard from './GameBoard';
import Pacman from './Pacman';
import Player2 from './Player2';
import Ghost from './Ghost';
import fruit from '../assets/sounds/Fruit.mp3'
import intro from '../assets/sounds/Intro.mp3'
import munsh from '../assets/sounds/munch.mp3'
export default {
	data() {
		return {
			gameGrid: document.querySelector('#game'),
			scoreTable: document.querySelector('#score'),
			POWER_PILL_TIME: 10000,
			GLOBAL_SPEED: 80,
			gameBoard: null,
			score: 0,
			timer: null,
			gameWin: false,
			powerPillActive: false,
			powerPillTimer: null,
			pacx: null,
			isSwap: false,
		}
	},
	beforemounted() {
		this.colls()
	},
	methods: {
		colls() {
			this.socket.on("swap", () => {
				console.log("oui");
			})
		},
		gameOver(pacman, grid) {
			document.removeEventListener('keydown', (e) =>
				pacman.handleKeyInput(e, this.gameBoard.objectExist.bind(this.gameBoard))
			);

			this.gameBoard.showGameStatus(this.gameWin, this.playerType, this.user, this.name);

			clearInterval(this.timer);
		},
		playAudio(sound) {
			const audio = new Audio(sound);
			audio.play();
		},
		checkCollision(pacman, player2) {

			if (pacman.pos == player2.pos) {
				this.playAudio(fruit)
				this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
				this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
				this.isSwap = true
				//this.socket.emit("swap", this.room)

				// this.socket.emit("playerSwap", this.room)
				// console.log(pacman);
				// this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
				// this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
				// pacman.pos = 287
				// player2.pos = 230	
				// this.gameBoard.moveCharacter(pacman);
				// this.gameBoard.moveCharacter(player2);

				// console.log("oui");

				// if (pacman.powerPill) {
				// 	this.gameBoard.removeObject(collidedGhost.pos, [
				// 		OBJECT_TYPE.GHOST,
				// 		OBJECT_TYPE.SCARED,
				// 		collidedGhost.name
				// 	]);
				// 	collidedGhost.pos = collidedGhost.startPos;
				// 	his.score += 100;
				// } else {
				// this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
				// this.gameBoard.rotateDiv(pacman.pos, 0);
				// this.gameOver(pacman, this.gameGrid);
				// }
			}
		},
		wait(ms) {
			var start = new Date().getTime();
			var end = start;
			while (end < start + ms) {
				end = new Date().getTime();
			}
		},
		showSwap() {
			this.swapTime = true
			setTimeout(function () {
				this.swapTime = false
			}, 5000);
		},
		gameLoop(pacman, ghosts, player2) {

			this.pacx = pacman
			this.checkCollision(pacman, player2)
			if (this.isSwap) {
				
				pacman.pos = 287
				player2.pos = 230
				this.gameBoard.moveCharacter(pacman);
				this.gameBoard.moveCharacter(player2);
				this.gameBoard.showSwapStatus();
				setTimeout(() => { this.gameBoard.removeSwapStatus(); }, 2000);

				if (this.playerType == "p1")
					this.playerType = "p2"
				else
					this.playerType = "p1"
				this.isSwap = false
			} else {

				if (this.playerType == "p2") {
					this.socket.on("pacmanMove", (pac) => {
						pacman.changePacman(pac)
						this.gameBoard.moveCharacter(pacman);
					})
					this.socket.emit("Player2Move", player2, this.room)
					if (player2.dir)
						player2.dir.rotation = 0
					this.gameBoard.moveCharacter(player2);
				}
				if (this.playerType == "p1") {
					this.socket.on("Player2Move", (pac) => {
						player2.changePacman(pac)
						if (player2.dir)
							player2.dir.rotation = 0
						this.gameBoard.moveCharacter(player2);
					})
					this.socket.emit("pacmanMove", pacman, this.room)
					this.gameBoard.moveCharacter(this.pacx);
				}
			}
			//TODO move player 2
			// 2. Check Ghost collision on the old positions
			// 3. Move ghosts
			//ghosts.forEach((ghost) => this.gameBoard.moveCharacter(ghost));
			// 4. Do a new ghost collision check on the new positions
			// 5. Check if Pacman eats a dot
			if (this.gameBoard.objectExist(this.pacx.pos, OBJECT_TYPE.DOT)) {
				this.playAudio(munsh);
				this.gameBoard.removeObject(this.pacx.pos, [OBJECT_TYPE.DOT]);
				// Remove a dot
				this.gameBoard.dotCount--;
				// Add Score
				//this.score += 10;
			}
			// 6. Check if Pacman eats a power pill
			// ? A voir + tard
			// ? if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {

			// ? 	this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

			// ? 	pacman.powerPill = true;
			// ? 	//this.score += 50;

			// ? 	clearTimeout(this.powerPillTimer);
			// ? 	this.powerPillTimer = setTimeout(
			// ? 		() => (pacman.powerPill = false),
			// ? 		this.POWER_PILL_TIME
			// ? 	);
			// ? }
			// 7. Change ghost scare mode depending on powerpill
			// if (pacman.powerPill !== this.powerPillActive) {
			// 	this.powerPillActive = pacman.powerPill;
			// 	ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
			// }
			// 8. Check if all dots have been eaten
			if (this.gameBoard.dotCount === 0) {
				this.gameWin = true;
				this.gameOver(this.pacx, this.gameGrid);
			}

			// 9. Show new score
			document.querySelector('#score').innerHTML = this.score;

		},
		startGame() {
			document.querySelector('#game').classList.remove("hide")
			this.playAudio(intro)
			this.gameWin = false;
			this.powerPillActive = false;
			this.score = 0;
			const gameGrid = document.querySelector('#game');
			this.gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
			this.gameBoard.createGrid(LEVEL);
			const pacman = new Pacman(1, 287);
			const player2 = new Player2(1, 230);
			this.gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
			this.gameBoard.addObject(230, [OBJECT_TYPE.PACMAN2]);
			document.addEventListener('keydown', (e) =>
				pacman.handleKeyInput(e, this.gameBoard.objectExist.bind(this.gameBoard))
			);
			document.addEventListener('keydown', (e) =>
				player2.handleKeyInput(e, this.gameBoard.objectExist.bind(this.gameBoard))
			);
			const ghosts = [
				new Ghost(5, 187, randomMovement, OBJECT_TYPE.PINKY),
			];

			this.timer = setInterval(() => this.gameLoop(pacman, ghosts, player2), this.GLOBAL_SPEED);
		},
	}
}

