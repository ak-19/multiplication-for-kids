import { Colors } from './Colors.js'
import { Square } from './Square.js'


export class SquareSetGenerator {
	constructor(sSize, wWidth, wHeight, inBackgroundCellSize) {
		this.squareSize = sSize;
		this.squares = [];
		this.windowWidth = wWidth;
		this.windowHeight = wHeight;
		this.backgroundCellSize = inBackgroundCellSize;
	}

	rearrangeSquaresRight() {
		const startX = 9 * (this.backgroundCellSize + 2);
		const offsetStartX = this.windowWidth - startX - this.backgroundCellSize;

		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].x = Math.floor(Math.random() * offsetStartX) + startX;
			this.squares[i].y = Math.floor(Math.random() * (this.windowHeight - this.backgroundCellSize));
		}
	}

	frearrangeSquaresBellow() {
		const startY = 9 * (this.backgroundCellSize + 2);
		const offsetStartY = this.windowHeight - startY - this.backgroundCellSize;

		for (let i = 0; i < this.squares.length; i++) {
			this.squares[i].x = Math.floor(Math.random() * (this.windowWidth - this.backgroundCellSize));
			this.squares[i].y = Math.floor(Math.random() * offsetStartY) + startY;
		}
	}

	generate() {

		let isFrontFaced = false;

		for (let i = 1; i <= 8; i++) {
			for (let j = 1; j <= 8; j++) {

				const text = i + " x " + j;
				let color = Colors[i];

				if (j >= i && j > 0) {
					color = Colors[j];
				}

				if (j == 0 || i == 0) {
					color = Colors[0];
				}

				isFrontFaced = Math.random() < .5;

				this.squares.push(
					new Square(i * (this.squareSize + 2),
						j * (this.squareSize + 2),
						this.squareSize,
						color,
						text,
						i,
						j,
						isFrontFaced
					)
				);
			}
		}


		if (this.windowWidth >= this.windowHeight) {
			this.rearrangeSquaresRight();
		} else {
			this.rearrangeSquaresBellow();
		}

		return this.squares;
	}
}
