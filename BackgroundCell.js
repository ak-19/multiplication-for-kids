export class BackgroundCell {
    constructor(inX, inY, inSize, inFirst, inSecond, inColor, inText, inTotal) {
        this.x = inX;
        this.y = inY;
        this.size = inSize;
        this.color = inColor;
        this.firstNumber = inFirst;
        this.secondNumber = inSecond;
        this.text = inText;
        this.done = false;
        this.total = inTotal;
    }
}