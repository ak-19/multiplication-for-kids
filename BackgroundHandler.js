import { Dimensions } from './Dimensions.js'
import { Colors } from './Colors.js'
import { BackgroundCell } from './BackgroundCell.js'


export class BackgroundHandler {
    constructor(inCan) {
        this.can = inCan;
        this.model = [];
        this.ctx = undefined;
        this.squareSize = Dimensions.WIDTH > Dimensions.HEIGHT ? Dimensions.HEIGHT / 10 : Dimensions.WIDTH / 10;
    }

    getModel() {
        return this.model;
    }

    checkHit(currentSquare) {
        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                const cItem = this.model[i][j];

                if (cItem.done) continue;

                if (
                    cItem.x <= currentSquare.x && cItem.y <= currentSquare.y && cItem
                        .y + cItem.size >= currentSquare.y + currentSquare.side && cItem.x +
                        cItem.size >= currentSquare.x + currentSquare.side && cItem.firstNumber ===
                    currentSquare.firstNumber && cItem.secondNumber === currentSquare
                        .secondNumber
                ) {

                    this.model[i][j].done = true;
                    this.model[i][j].text = cItem.firstNumber + "-" + cItem.secondNumber;

                    return true;
                }
            }
        }

        return false;
    }

    generateModel() {
        this.ctx = this.can.getContext('2d');

        for (let i = 0; i <= 8; i++) {

            this.model.push(new Array());
            for (let j = 0; j <= 8; j++) {

                let text = i === 0 ? j : i * j;
                text = j === 0 ? i : text;

                var total = i * j;

                var color = Colors[i];

                if (j >= i && j > 0) {
                    color = Colors[j];
                }

                if (j == 0 || i == 0) {
                    color = Colors[0];
                }

                this.model[i].push(
                    new BackgroundCell(i * (this.squareSize + 2),
                        j * (this.squareSize + 2),
                        this.squareSize,
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

    drawBackground() {
        this.ctx.clearRect(0, 0, Dimensions.WIDTH, Dimensions.HEIGHT);

        //draw numbering cells
        let verticalLine = 0;
        let horizontalLine = 0;
        for (horizontalLine = 0; horizontalLine <= 8; horizontalLine++) {
            let cElem = this.model[verticalLine][horizontalLine];
            this.drawSingleHeaderCell(verticalLine, horizontalLine, this.ctx, cElem);

            cElem = this.model[horizontalLine][verticalLine];
            this.drawSingleHeaderCell(horizontalLine, verticalLine, this.ctx, cElem);
        };

        for (let i = 1; i <= 8; i++) {
            for (let j = 1; j <= 8; j++) {
                const cElem = this.model[i][j];
                this.drawSingleCell(i, j, this.ctx, cElem);
            }
        };
    };

    drawSingleHeaderCell(i, j, ctx, cElem) {
        if (i === 0 && j === 0) {
            return;
        }
        this.ctx.font = "22px tahoma";
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(cElem.text, cElem.x + cElem.size / 5, cElem.y + cElem.size /
            2 + 5);
    }

    drawSingleCell(i, j, ctx, cElem) {
        this.ctx.fillStyle = cElem.color;
        this.ctx.fillRect(cElem.x, cElem.y, cElem.size, cElem.size);
        if (cElem.done) {
            this.drawTextWithOutline("22px serif", ctx, cElem.total, cElem.x, cElem.y,
                cElem.size);
            this.ctx.strokeStyle = '#28d1fa';
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.strokeRect(cElem.x, cElem.y, cElem.size, cElem.size);
        }
    }

    drawTextWithOutline(fontText, ctx, text, posX, posY, cSize) {
        ctx.font = fontText;
        var textSize = ctx.measureText(text);
        var textYpos = posY + (cSize / 2) + 5; // (textSize.height / 2);
        var textXpos = posX + (cSize / 2) - (textSize.width / 2);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3; // text border width
        ctx.strokeText(text, textXpos, textYpos);
        ctx.fillStyle = "white";
        ctx.fillText(text, textXpos, textYpos);
    }
}