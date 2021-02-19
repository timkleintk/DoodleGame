// handeling events stuff ------------------------------------------
function windowResized() { sizeCanvas(); }

function sizeCanvas() {
    let canvasHolder = document.getElementById('canvasholder');
    let canvasWidth = canvasHolder.clientWidth;
    let canvasHeiht = canvasWidth / aspectRatio;
    scale = canvasWidth / 1200;
    resizeCanvas(canvasWidth, canvasHeiht);
}


function mouseClicked() { if (currentHover !== null && currentHover.onClick) { currentHover.onClick(); currentHover = null; } }
function mousePressed() { if (currentHover !== null && currentHover.onMouseDown) { currentHover.onMouseDown(); } }
function mouseReleased() { if (currentHover !== null && currentHover.onMouseUp) { currentHover.onMouseUp(); } }


