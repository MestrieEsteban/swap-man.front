import { LEVEL, LEVEL2, LEVEL3,LEVEL4, OBJECT_TYPE } from './setup';
// Classes
import GameBoard from './GameBoard';
import Pacman from './Pacman';
import Player2 from './Player2';
import fruit from '../assets/sounds/Fruit.mp3'
import intro from '../assets/sounds/Intro.mp3'
export default {
	data() {
		return {
			gameGrid: document.querySelector('#game'),
      start: null,
      end: null,
			POWER_PILL_TIME: 5000,
			GLOBAL_SPEED: 80,
			gameBoard: null,
			timer: null,
			gameWin: false,
			powerPillActive: false,
			powerPillTimer: null,
			pacx: null,
			isSwap: false,
			isEat: false,
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

				if (pacman.powerPill) {
					this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
					this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
					this.powerr = false
					this.isEat = true
				} else {
					this.playAudio(fruit)
					this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
					this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
					this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
					this.gameBoard.removeObject(player2.pos, [OBJECT_TYPE.PACMAN2]);
					this.isSwap = true
				}
			}
		},
		wait(ms) {
			this.start = new Date().getTime();
			this.end = this.start;
			while (this.end < this.start + ms) {
				this.end = new Date().getTime();
			}
		},
		showSwap() {
			this.swapTime = true
			setTimeout(function () {
				this.swapTime = false
			}, 5000);
		},
		gameLoop(pacman, player2) {

			this.pacx = pacman
			this.checkCollision(pacman, player2)
			if (this.isSwap) {

				pacman.pos = 287
				player2.pos = 230
				this.gameBoard.moveCharacter(pacman);
				this.gameBoard.moveCharacter(player2);
				this.gameBoard.showSwapStatus();
				setTimeout(() => { this.gameBoard.removeSwapStatus(); }, 2000);

				if (this.playerType == "p1") {
					this.playerType = "p2"
					document.querySelector('#game').classList.add("isGho")
					document.querySelector('#game').classList.remove("isPac")
				}
				else {
					this.playerType = "p1"
					document.querySelector('#game').classList.remove("isGho")
					document.querySelector('#game').classList.add("isPac")
				}

				this.isSwap = false
			} else if(this.isEat){
				player2.pos = 230
				this.gameBoard.moveCharacter(player2);
				this.isEat = false
			}
			
			else {

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
			// Check if Pacman eats a dot
			if (this.gameBoard.objectExist(this.pacx.pos, OBJECT_TYPE.DOT)) {
				this.gameBoard.removeObject(this.pacx.pos, [OBJECT_TYPE.DOT]);
				// Remove a dot
				this.gameBoard.dotCount--;
			}
			// 6. Check if Pacman eats a power pill
			if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
				this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
				pacman.powerPill = true;
				if (this.playerType == "p2") {
					document.querySelector('#game').classList.add("isSca")
				}
				this.powerr = true
				clearTimeout(this.powerPillTimer);
				this.powerPillTimer = setTimeout(
					() => {
						pacman.powerPill = false
						this.powerr = false
						if (this.playerType == "p2") {
							document.querySelector('#game').classList.remove("isSca")
						}
					},
					this.POWER_PILL_TIME
				);
			}
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
		},
		startGame() {
			document.querySelector('#game').classList.remove("hide")
			document.querySelector('#game').classList.add("boxs")
			if (this.playerType == "p1") {
				document.querySelector('#game').classList.add("isPac")
			} else {
				document.querySelector('#game').classList.add("isGho")
			}
			this.playAudio(intro)
			this.gameWin = false;
			this.powerPillActive = false;
			const gameGrid = document.querySelector('#game');
			let level
			switch (this.map) {
				case 0:
					level = LEVEL
					break;
				case 1:
					level = LEVEL2
					break;
				case 2:
					level = LEVEL3
					break;
				case 3:
					level = LEVEL4
					break;
				default:
					level = LEVEL
					break;
			}
			this.gameBoard = GameBoard.createGameBoard(gameGrid, level);
			this.gameBoard.createGrid(level);
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

			this.timer = setInterval(() => this.gameLoop(pacman, player2), this.GLOBAL_SPEED);
		},
	}
}

