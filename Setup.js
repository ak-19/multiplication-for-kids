export class Setup {
    init() {
        this.canBackground = document.createElement('canvas');
        this.canForeground = document.getElementById('canForeground');
        Setup.setupScreenGeometry(this.canBackground);
        Setup.setupScreenGeometry(this.canForeground);
        this.goFullScreen(this.canForeground);
    }

    static setupScreenGeometry(element) {
        element.setAttribute('width', window.screen.width);
        element.setAttribute('height', window.screen.height);
    }

    goFullScreen(element) {
        if (element.requestFullScreen)
            element.requestFullScreen();
        else if (element.webkitRequestFullScreen)
            element.webkitRequestFullScreen();
        else if (element.mozRequestFullScreen)
            element.mozRequestFullScreen();
        else if (element.msRequestFullscreen)
            element.msRequestFullscreen();
    }
}