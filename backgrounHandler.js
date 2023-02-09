function backgrounHandler(inCan, inSizes) {
  var can = inCan;
  var sizes = inSizes;
  var model = [];
  var ctx = undefined;

  this.getModel = function() {
    return model;
  };

  this.checkHit = function(currentSquare) {
    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        var cItem = model[i][j];
        if (cItem.done) {
          continue;
        }
        if (
          cItem.x <= currentSquare.x && cItem.y <= currentSquare.y && cItem
          .y + cItem.size >= currentSquare.y + currentSquare.side && cItem.x +
          cItem.size >= currentSquare.x + currentSquare.side && cItem.firstNumber ===
          currentSquare.firstNumber && cItem.secondNumber === currentSquare
          .secondNumber
        ) {

          model[i][j].done = true;
          model[i][j].text = cItem.firstNumber + "-" + cItem.secondNumber;

          return true;
        }
      }
    }

    return false;
  }

  var squareSize = sizes.width > sizes.height ? sizes.height / 10 : sizes.width / 10;

  this.getSquareSize = function() {
    return squareSize;
  }

  this.generateModel = function() {
    ctx = can.getContext('2d');

    for (var i = 0; i <= 8; i++) {

      model.push(new Array());
      for (var j = 0; j <= 8; j++) {

        var text = i === 0 ? j : i * j;
        text = j === 0 ? i : text;

        var total = i * j;

        var color = colors[i];

        if (j >= i && j > 0) {
          color = colors[j];
        }

        if (j == 0 || i == 0) {
          color = colors[0];
        }

        model[i].push(

          new backgroundCell(i * (squareSize + 2),
            j * (squareSize + 2),
            squareSize,
            i,
            j,
            color,
            text,
            total
          )

        );
      }
    }
  };

  this.drawBackground = function() {
    ctx.clearRect(0, 0, sizes.width, sizes.height);

    //draw numbering cells
    var verticalLine = 0;
    var horizontalLine = 0;
    for (horizontalLine = 0; horizontalLine <= 8; horizontalLine++) {
      var cElem = model[verticalLine][horizontalLine];
      drawSingleHeaderCell(verticalLine, horizontalLine, ctx, cElem);

      cElem = model[horizontalLine][verticalLine];
      drawSingleHeaderCell(horizontalLine, verticalLine, ctx, cElem);
    };

    for (var i = 1; i <= 8; i++) {
      for (var j = 1; j <= 8; j++) {
        var cElem = model[i][j];
        drawSingleCell(i, j, ctx, cElem);
      }
    };
  };

  function drawSingleHeaderCell(i, j, ctx, cElem) {
    // ctx.fillStyle = "white";
    // ctx.fillRect(cElem.x, cElem.y, cElem.size, cElem.size);
    if (i === 0 && j === 0) {
      return;
    }
    ctx.font = "22px tahoma";
    ctx.fillStyle = 'white';
    ctx.fillText(cElem.text, cElem.x + cElem.size / 5, cElem.y + cElem.size /
      2 + 5);
  }

  function drawSingleCell(i, j, ctx, cElem) {
    ctx.fillStyle = cElem.color;
    ctx.fillRect(cElem.x, cElem.y, cElem.size, cElem.size);
    if (cElem.done) {
      drawTextWithOutline("22px serif", ctx, cElem.total, cElem.x, cElem.y,
        cElem.size);
      ctx.strokeStyle = '#28d1fa';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.strokeRect(cElem.x, cElem.y, cElem.size, cElem.size);
    }
  }
}
