import { Dimensions } from './Dimensions.js'
import { SquareSetGenerator } from './SquareSetGenerator.js';
import { Setup } from './Setup.js'

export class Game {
    constructor(canForeground, canBackground, bHandler) {
        this.canvas = canForeground;
        this.backgroundCanvas = canBackground;
        this.ctx = undefined;
        this.bHandler = bHandler;

        this.dragok = false;
        this.windowWidth = Dimensions.WIDTH;
        this.windowHeight = Dimensions.HEIGHT;

        this.squareSize = Math.floor(bHandler.squareSize * 0.7);
        this.currentSquare = undefined;

        this.bHandler = bHandler;
        this.audio = undefined;
        this.runAnimation = true;
        this.tempCanvas = undefined;
        this.squares = new SquareSetGenerator(this.squareSize, this.windowWidth, this.windowHeight, this.bHandler.squareSize).generate();
    }

    start() {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.setAttribute('width', this.windowWidth);
        this.canvas.setAttribute('height', this.windowHeight);
        this.canvas.onmousedown = this.myDown.bind(this);
        this.canvas.onmouseup = this.myUp.bind(this);

        this.canvas.ontouchstart = this.myTouchDown.bind(this);
        this.canvas.ontouchend = this.myTouchUp.bind(this);
        this.canvas.ontouchleave = this.myTouchUp.bind(this);

        this.audio = new Audio('glass_ping.mp3');

        this.canvas.oncontextmenu = function (e) {
            e.preventDefault();
            return false;
        };

        requestAnimationFrame(this.draw.bind(this));
    }

    myDown(e) {
        e.preventDefault();
        this.dragok = true;
        this.squareTest(e.pageX, e.pageY);
        if (this.currentSquare !== undefined) {
            if (e.which === 3) {
                this.currentSquare.isFrontFaced = !this.currentSquare.isFrontFaced;
            } else {
                this.canvas.onmousemove = this.myMove.bind(this);
            }
        }
        return false;
    }

    myUp(e) {
        this.dragok = false;
        this.canvas.onmousemove = null;
        this.hitTest();
    }


    myTouchDown(ev) {
        this.dragok = true;

        const e = ev.changedTouches[0];
        this.squareTest(e.clientX, e.clientY);

        if (this.currentSquare !== undefined) {
            this.canvas.ontouchmove = this.myTouchMove;
        }
    }

    myTouchUp(e) {
        this.dragok = false;
        this.canvas.ontouchmove = null;
        this.hitTest();
    }

    myTouchMove(ev) {
        if (this.dragok) {
            const e = ev.changedTouches[0];
            this.currentSquare.x = e.clientX - this.squareSize / 2;
            this.currentSquare.y = e.clientY - this.squareSize / 2;
            this.currentSquare.isFrontFaced = !this.currentSquare.isFrontFaced;
        }
    }

    myMove(e) {
        if (this.dragok) {
            this.currentSquare.x = e.pageX - this.canvas.offsetLeft - this.squareSize / 2;
            this.currentSquare.y = e.pageY - this.canvas.offsetTop - this.squareSize / 2;
        }
    }


    drawSingleSquare(ct, cItem) {
        ct.fillStyle = cItem.isFrontFaced ? cItem.color : "white";
        ct.shadowBlur = 20;
        ct.shadowColor = "black";
        ct.fillRect(cItem.x, cItem.y, this.squareSize, this.squareSize);

        var whatToPrintout = cItem.isFrontFaced ? cItem.total : cItem.text;
        ct.font = "12px serif";
        var horizontalOffset = cItem.x + this.squareSize / 3;
        ct.fillStyle = 'black';

        //remove shadow before text printout
        ct.shadowBlur = 0;
        ct.shadowColor = undefined;

        if (!cItem.isFrontFaced) {
            ct.fillStyle = 'blue';
            this.drawBlueText("12px serif", ct, whatToPrintout, cItem.x, cItem.y, this.squareSize);
        } else {
            this.drawTextWithOutline("14px serif", ct, whatToPrintout, cItem.x, cItem.y, this.squareSize);
        }
    }

    drawBlueText(fontText, ctx, text, posX, posY, cSize) {
        ctx.font = fontText;
        var textSize = ctx.measureText(text);
        var textYpos = posY + (cSize / 2) + 5;
        var textXpos = posX + (cSize / 2) - (textSize.width / 2);
        ctx.fillStyle = "blue";
        ctx.fillText(text, textXpos, textYpos);
    }

    draw() {
        if (this.dragok && this.currentSquare !== undefined) {
            if (this.tempCanvas === undefined) {
                this.tempCanvas = document.createElement('canvas');
                Setup.setupScreenGeometry(this.tempCanvas);
                const tempCanvasContext = this.tempCanvas.getContext('2d');
                this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
                tempCanvasContext.drawImage(this.backgroundCanvas, 0, 0);
                this.squares.forEach((cItem) => {
                    if (cItem.firstNumber !== this.currentSquare.firstNumber || cItem.secondNumber !== this.currentSquare.secondNumber) {
                        this.drawSingleSquare(tempCanvasContext, cItem);
                    }
                });
                this.ctx.drawImage(this.tempCanvas, 0, 0);
                this.drawSingleSquare(this.ctx, this.currentSquare);
            } else {
                this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
                this.ctx.drawImage(this.tempCanvas, 0, 0);
                this.drawSingleSquare(this.ctx, this.currentSquare);
            }
        } else {
            this.tempCanvas = undefined;
            this.clear();
            this.squares.forEach((cItem) => {
                this.drawSingleSquare(this.ctx, cItem);
            });
        }

        if (this.runAnimation === true) {
            requestAnimationFrame(this.draw.bind(this));
        } else {
            this.drawEndOfTheGame();
        }

    }


    clear() {
        this.ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
        this.ctx.drawImage(this.backgroundCanvas, 0, 0);
    }

    removeSquare(cSquare) {
        for (let i = 0; i < this.squares.length; i++) {
            if (this.squares[i].firstNumber === cSquare.firstNumber && this.squares[i].secondNumber === cSquare.secondNumber) {
                this.squares.splice(i, 1);
                return this.squares.length > 0;
            }
        }
        return this.squares.length > 0;
    }

    hitTest() {
        if (this.currentSquare !== undefined) {
            if (this.bHandler.checkHit(this.currentSquare)) {
                this.bHandler.drawBackground();
                this.audio.play();
                if (!this.removeSquare(this.currentSquare)) {
                    this.runAnimation = false;
                }
            }
        }
    }

    drawEndOfTheGame() {
        const textToDraw = "Bravo";
        this.ctx.font = "94px serif";
        const tableBorder = 9 * (this.bHandler.squareSize + 2);
        const textSize = this.ctx.measureText(textToDraw);
        const textYpos = (tableBorder / 2);
        const textXpos = (tableBorder / 2) - (textSize.width / 2);
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = "black";
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillText(textToDraw, textXpos, textYpos);
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

    squareTest(x, y) {
        for (let i = this.squares.length - 1; i >= 0; i--) {
            if (this.squares[i].isInside(x, y, this.canvas.offsetLeft, this.canvas.offsetTop)) {
                this.currentSquare = this.squares[i];
                return;
            }
        }
        this.currentSquare = undefined;
        this.tempCanvas = undefined;
    }
}