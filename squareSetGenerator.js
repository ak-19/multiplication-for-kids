function squareSetGenerator(sSize, wWidth, wHeight, inBackgroundCellSize) {
	var squareSize = sSize;
	var squares = [];
	var windowWidth = wWidth;
	var windowHeight = wHeight;
	var backgroundCellSize = inBackgroundCellSize;

	function rearrangeSquaresRight() {
		var startX = 9 * (backgroundCellSize + 2);
		var offsetStartX = windowWidth - startX - backgroundCellSize;

		for (var i = 0; i < squares.length; i++) {
			squares[i].x = Math.floor(Math.random() * offsetStartX) + startX;
			squares[i].y = Math.floor(Math.random() * (windowHeight - backgroundCellSize)) ;
		}
	};

	function rearrangeSquaresBellow() {
		var startY = 9 * (backgroundCellSize + 2);
		var offsetStartY = windowHeight - startY - backgroundCellSize;

		for (var i = 0; i < squares.length; i++) {
			squares[i].x = Math.floor(Math.random() * (windowWidth - backgroundCellSize)) ;
			squares[i].y = Math.floor(Math.random() * offsetStartY) + startY;
		}

	};

	this.generate = function() {

		var isFrontFaced = false;

		for (var i = 1; i <= 8; i++) {
			for (var j = 1; j <= 8; j++) {

				var text = i + " x " + j;

				var color = colors[i];

				if (j >= i && j > 0) {
					color = colors[j];
				}

				if (j == 0 || i == 0) {
					color = colors[0];
				}

				isFrontFaced = Math.random()<.5;

				squares.push(
					new square(i * (squareSize + 2),
						j * (squareSize + 2),
						squareSize,
						color,
						text,
						i,
						j,
						isFrontFaced
					)
				);
			}
		}
		//new square(10, 10 + squareSize * 9, squareSize, "#000080", '10-1')

		if (windowWidth >= windowHeight) {
			rearrangeSquaresRight();
		} else {
			rearrangeSquaresBellow();
		}

		return squares;
	};
}
