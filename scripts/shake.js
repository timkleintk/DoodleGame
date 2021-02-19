// shake class ----------------------------------------------------
function Shake(ingredients, posX, posY, onCounter) {
    this.ingredients = ingredients;
    this.posX = posX;
    this.posY = posY;
    this.onCounter = onCounter;
    this.grabbed = false;
    this.offsetX = 0;
    this.offsetY = 0;

    this.update = function () {

        // hover stuff
        if (this.grabbed) {
            currentHover = this;
            this.posX = mouseX / scale + this.offsetX;
            this.posY = mouseY / scale + this.offsetY;
        }
        else if (mouseX / scale > this.posX && mouseX / scale < this.posX + shakeSpriteStrip.width / numFrames && mouseY / scale > this.posY && mouseY / scale < this.posY + shakeSpriteStrip.height) {
            if (currentHover !== this) {
                // enter hover
                currentHover = this;
            }
        } else if (currentHover === this) {
            // exit hover
            currentHover = null;
        }

        // falling off the screen
        if (!this.onCounter && !this.grabbed) {
            this.posY += gravity;
            if (this.posY > height / scale) {
                let index = gameObjects.indexOf(this);
                if (index !== -1) {
                    gameObjects.splice(index, 1);
                }
            }
        }
    }

    this.show = function () {
        drawFrame(shakeSpriteStrip, this.posX, this.posY);
    }

    this.onMouseDown = function () {
        if (this.onCounter) {
            this.onCounter = false;
            this.grabbed = true;
            this.offsetX = this.posX - mouseX / scale;
            this.offsetY = this.posY - mouseY / scale;
        }
    }

    this.onMouseUp = function () {
        if (this.grabbed) {
            this.grabbed = false;
            currentHover = null;
        }
    }
}