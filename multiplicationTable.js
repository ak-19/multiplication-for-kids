window.onload = function() {
  var btnStart = document.getElementById('btnStart');
  btnStart.onclick = init;
  window.onevent = function(e) {
    e.preventDefault();
    return false;
  };
}

function init() {

  var canBackground = document.createElement('canvas');
  var canForeground = document.getElementById('canForeground');
  setupScreenGeometry(canBackground);
  setupScreenGeometry(canForeground);
  goFullScreen(canForeground);

  var sizes = {
    width: window.screen.width,
    height: window.screen.height
  };

  var bHandler = new backgrounHandler(canBackground, sizes);
  bHandler.generateModel();
  bHandler.drawBackground();

  var mTable = new table(canForeground, sizes, canBackground, bHandler);
  mTable.init();
}

function goFullScreen(can) {

  if (can.requestFullScreen)
    can.requestFullScreen();
  else if (can.webkitRequestFullScreen)
    can.webkitRequestFullScreen();
  else if (can.mozRequestFullScreen)
    can.mozRequestFullScreen();
  else if (can.msRequestFullscreen)
    can.msRequestFullscreen();

}
