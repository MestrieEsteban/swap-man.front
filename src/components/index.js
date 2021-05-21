import {LEVEL, OBJECT_TYPE} from './setup';
//import { randomMovement } from './ghostmoves';
// Classes
import GameBoard from './GameBoard';
import Pacman from './Pacman';
//import Ghost from './Ghost';
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
      powerPillTimer: null
    }
  },
  mounted() {
  },
  methods: {
    gameOver(pacman, grid) {
      document.removeEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, this.gameBoard.objectExist.bind(this.gameBoard))
      );

      this.gameBoard.showGameStatus(this.gameWin);

      clearInterval(timer);
      // Show startbutton
    },
    checkCollision(pacman, ghosts) {
      const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

      if (collidedGhost) {
        if (pacman.powerPill) {
          this.gameBoard.removeObject(collidedGhost.pos, [
            OBJECT_TYPE.GHOST,
            OBJECT_TYPE.SCARED,
            collidedGhost.name
          ]);
          collidedGhost.pos = collidedGhost.startPos;
          this.score += 100;
        } else {
          this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
          this.gameBoard.rotateDiv(pacman.pos, 0);
          this.gameOver(pacman, this.gameGrid);
        }
      }
    },
    gameLoop(pacman, ghosts) {
      // 1. Move Pacman
      this.gameBoard.moveCharacter(pacman);
      // 2. Check Ghost collision on the old positions
      this.checkCollision(pacman, ghosts);
      // 3. Move ghosts
      ghosts.forEach((ghost) => this.gameBoard.moveCharacter(ghost));
      // 4. Do a new ghost collision check on the new positions
      this.checkCollision(pacman, ghosts);
      // 5. Check if Pacman eats a dot
      if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {

        this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        // Remove a dot
        this.gameBoard.dotCount--;
        // Add Score
        this.score += 10;
      }
      // 6. Check if Pacman eats a power pill
      if (this.gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {

        this.gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);

        pacman.powerPill = true;
        this.score += 50;

        clearTimeout(this.powerPillTimer);
        this.powerPillTimer = setTimeout(
          () => (pacman.powerPill = false),
          this.POWER_PILL_TIME
        );
      }
      // 7. Change ghost scare mode depending on powerpill
      if (pacman.powerPill !== this.powerPillActive) {
        this.powerPillActive = pacman.powerPill;
        ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
      }
      // 8. Check if all dots have been eaten
      if (this.gameBoard.dotCount === 0) {
        this.gameWin = true;
        this.gameOver(pacman, this.gameGrid);
      }
      // 9. Show new score
      this.scoreTable.innerHTML = this.score;
    },
    startGame() {
      document.querySelector('#grid').classList.remove("hide")
      this.gameWin = false;
      this.powerPillActive = false;
      this.score = 0;
      const gameGrid = document.querySelector('#game');
      let gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
      gameBoard.createGrid(LEVEL);
      const pacman = new Pacman(2, 287);
      gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
      document.addEventListener('keydown', (e) =>
        pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))
      );

        /*const ghosts = [
          new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
          new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
          new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
          new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
        ];*/

       Gameloop
       //this.timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
    },
  }
}

