function table(can, sizes, canBackground, backHandler) {
	var canvas = can;
	var ctx = undefined;
	var dragok = false;
	var windowWidth = sizes.width;
	var windowHeight = sizes.height;
	var squareSize = Math.floor(backHandler.getSquareSize() * 0.7);// (sizes.width / 12) > 40 ? 40 : sizes.width / 12;
	var currentSquare = undefined;
	var backgroundCanvas = canBackground;
	var bHandler = backHandler;
	var audio = undefined;
	var runAnimation = true;
	var tempCanvas = undefined;
	
	var squares = new squareSetGenerator(squareSize, windowWidth, windowHeight,backHandler.getSquareSize()).generate();

	this.init = function() {


		ctx = canvas.getContext('2d');
		canvas.setAttribute('width', windowWidth);
		canvas.setAttribute('height', windowHeight);
		canvas.onmousedown = myDown;
		canvas.onmouseup = myUp;

		canvas.ontouchstart = myTouchDown;
		canvas.ontouchend = myTouchUp;
		canvas.ontouchleave = myTouchUp;

		audio = new Audio('glass_ping.mp3');

		canvas.oncontextmenu = function(e) {
			e.preventDefault();
			return false;
		};

		requestAnimationFrame(draw);
	};

	function squareTest(x, y) {
		for (var i = squares.length - 1; i >= 0; i--) {
			if (squares[i].isInside(x, y, canvas.offsetLeft, canvas.offsetTop)) {
				currentSquare = squares[i];
				return;
			}
		}

		currentSquare = undefined;
		tempCanvas = undefined;
	}

	function myDown(e) {
		e.preventDefault();
		dragok = true;
		squareTest(e.pageX, e.pageY);
		if (currentSquare !== undefined) {
			if (e.which === 3) {
				currentSquare.isFrontFaced = !currentSquare.isFrontFaced;
			} else {
				canvas.onmousemove = myMove;
			}
		}
		return false;
	}

	function myTouchDown(ev) {
		dragok = true;

		var e = ev.changedTouches[0];
		squareTest(e.clientX, e.clientY);

		if (currentSquare !== undefined) {
			canvas.ontouchmove = myTouchMove;
		}
	}

	function myTouchUp(e) {
		dragok = false;
		canvas.ontouchmove = null;
		hitTest();
	}

	function myTouchMove(ev) {
		if (dragok) {
			var e = ev.changedTouches[0];
			currentSquare.x = e.clientX - squareSize / 2; // - canvas.offsetLeft;
			currentSquare.y = e.clientY - squareSize / 2; //- canvas.offsetTop;
			currentSquare.isFrontFaced = !currentSquare.isFrontFaced;
		}
	}

	function myUp(e) {
		dragok = false;
		canvas.onmousemove = null;
		hitTest();
	}

	function myMove(e) {
		if (dragok) {
			currentSquare.x = e.pageX - canvas.offsetLeft - squareSize / 2;
			currentSquare.y = e.pageY - canvas.offsetTop - squareSize / 2;
		}
	}

	function drawSingleSquare(ct, cItem) {
		ct.fillStyle = cItem.isFrontFaced ? cItem.color : "white";
		ct.shadowBlur = 20;
		ct.shadowColor = "black";
		ct.fillRect(cItem.x, cItem.y, squareSize, squareSize);

		var whatToPrintout = cItem.isFrontFaced ? cItem.total : cItem.text;
		ct.font = "12px serif";
		var horizontalOffset = cItem.x + squareSize / 3;
		ct.fillStyle = 'black';

		//remove shadow before text printout
		ct.shadowBlur = 0;
		ct.shadowColor = undefined;

		if (!cItem.isFrontFaced) {
			ct.fillStyle = 'blue';
			drawBlueText("12px serif", ct, whatToPrintout, cItem.x, cItem.y, squareSize);
		} else {
			drawTextWithOutline("14px serif", ct, whatToPrintout, cItem.x, cItem.y, squareSize);
		}
	}



	function draw() {
		if (dragok && currentSquare !== undefined) {
			if (tempCanvas === undefined) {
				tempCanvas = document.createElement('canvas');
				setupScreenGeometry(tempCanvas);
				var tempCanvasContext = tempCanvas.getContext('2d');
				ctx.clearRect(0, 0, windowWidth, windowHeight);
				tempCanvasContext.drawImage(backgroundCanvas, 0, 0);
				squares.forEach(function(cItem) {
					if (cItem.firstNumber !== currentSquare.firstNumber || cItem.secondNumber !== currentSquare.secondNumber) {
						drawSingleSquare(tempCanvasContext, cItem);
					}
				});
				ctx.drawImage(tempCanvas, 0, 0);
				drawSingleSquare(ctx, currentSquare);				
			} else {
				ctx.clearRect(0, 0, windowWidth, windowHeight);
				ctx.drawImage(tempCanvas, 0, 0);
				drawSingleSquare(ctx, currentSquare);
			}
		} else {
			tempCanvas = undefined;
			clear();
			squares.forEach(function(cItem) {
				drawSingleSquare(ctx, cItem);
			});
		}

		if (runAnimation === true) {
			requestAnimationFrame(draw);
		} else {
			drawEndOfTheGame();
		}

	}

	function clear() {
		ctx.clearRect(0, 0, windowWidth, windowHeight);
		ctx.drawImage(backgroundCanvas, 0, 0);
	}

	function removeSquare(cSquare) {
		for (var i = 0; i < squares.length; i++) {
			if (squares[i].firstNumber === cSquare.firstNumber && squares[i].secondNumber === cSquare.secondNumber) {
				squares.splice(i, 1);
				return squares.length > 0;
			}
		}
		return squares.length > 0;
	}

	function hitTest() {
		if (currentSquare !== undefined) {
			if (bHandler.checkHit(currentSquare)) {
				bHandler.drawBackground();
				audio.play();
				if (!removeSquare(currentSquare)) {
					runAnimation = false;
				}
			}
		}
	}

	function drawEndOfTheGame() {
		var textToDraw = "Bravo";
		ctx.font = "94px serif";
		var tableBorder = 9 * (backHandler.getSquareSize() + 2);
		var textSize = ctx.measureText(textToDraw);
		var textYpos = (tableBorder / 2);
		var textXpos = (tableBorder / 2) - (textSize.width / 2);
		ctx.shadowBlur = 20;
		ctx.shadowColor = "black";
		ctx.fillStyle = 'yellow';
		ctx.fillText(textToDraw, textXpos, textYpos);
	}

}
