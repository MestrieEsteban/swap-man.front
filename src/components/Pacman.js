import { OBJECT_TYPE, DIRECTIONS } from './setup';

class Pacman {
	constructor(speed, startPos, timer = 0) {
		this.pos = startPos;
		this.speed = speed;
		this.dir = null;
		this.timer = timer;
		this.powerPill = false;
		this.rotation = true;
	}

	changePacman(data) {
		this.pos = data.pos
		this.speed = data.speed
		this.dir = data.dir
		this.timer = data.timer
		this.powerPill = data.powerPill
		this.rotation = data.rotation
	}

	shouldMove() {
		if (!this.dir) return;

		if (this.timer === this.speed) {
			this.timer = 0;
			return true;
		}
		this.timer++;
	}

	getNextMove(objectExist) {
		let nextMovePos = this.pos + this.dir.movement;
		if (
			objectExist(nextMovePos, OBJECT_TYPE.WALL) ||
			objectExist(nextMovePos, OBJECT_TYPE.GHOSTLAIR) ||
			objectExist(nextMovePos, OBJECT_TYPE.WALLGHOST)
		) {
			nextMovePos = this.pos;
		}

		return { nextMovePos, direction: this.dir };
	}

	makeMove() {
		const classesToRemove = [OBJECT_TYPE.PACMAN];
		const classesToAdd = [OBJECT_TYPE.PACMAN];

		return { classesToRemove, classesToAdd };
	}

	setNewPos(nextMovePos) {
		this.pos = nextMovePos;
	}

	handleKeyInput = (e, objectExist) => {
		let dir;

		if (e.keyCode >= 37 && e.keyCode <= 40) {
			dir = DIRECTIONS[e.key];
		} else {
			return;
		}

		const nextMovePos = this.pos + dir.movement;
		if (objectExist(nextMovePos, OBJECT_TYPE.WALL)) return;
		this.dir = dir;
	};
}

export default Pacman;
