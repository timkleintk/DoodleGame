// Sprite class ----------------------------------------------------
function Sprite(strip, posX, posY, clickable = false, onClick = () => { }) {

    this.strip = strip;
    this.posX = posX;
    this.posY = posY;
    this.clickable = clickable;
    this.width = this.strip.width / numFrames;
    this.height = this.strip.height;
    this.onClick = onClick;


    this.update = function () {
        if (this.clickable &&
            mouseX / scale > this.posX &&
            mouseX / scale < this.posX + this.width &&
            mouseY / scale > this.posY &&
            mouseY / scale < this.posY + this.height
        ) {
            if (this !== currentHover) {
                // enter hover
                currentHover = this;
            }
        } else if (this === currentHover) {
            currentHover = null;
        }
    }
    this.show = function () { drawFrame(this.strip, this.posX, this.posY) }
}