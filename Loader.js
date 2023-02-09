import { Setup } from './Setup.js';
import { Game } from './Game.js';
import { BackgroundHandler } from './BackgroundHandler.js';

document.getElementById('btnStart').onclick = function () {
    const setup = new Setup();
    setup.init();

    const canBackground = setup.canBackground;
    const canForeground = setup.canForeground;

    const bHandler = new BackgroundHandler(canBackground);
    bHandler.generateModel();
    bHandler.drawBackground();

    new Game(canForeground, canBackground, bHandler).start();
}