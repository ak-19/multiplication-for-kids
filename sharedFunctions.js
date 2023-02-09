function drawTextWithOutline(fontText, ctx, text, posX, posY, cSize) {
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

function drawBlueText(fontText, ctx, text, posX, posY, cSize) {
	ctx.font = fontText;
	var textSize = ctx.measureText(text);
	var textYpos = posY + (cSize / 2) + 5;
	var textXpos = posX + (cSize / 2) - (textSize.width / 2);
	ctx.fillStyle = "blue";
	ctx.fillText(text, textXpos, textYpos);
}

var colors = ['#999999',
	'#ffff88', '#8080ff',
	'#ffff00', '#0000ff',
	'#ff8000', '#ff0000',
	'#bf00bf', '#000080'
];

function setupScreenGeometry(el) {

	el.setAttribute('width', window.screen.width);
	el.setAttribute('height', window.screen.height);

}
