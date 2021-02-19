// ingredient class ----------------------------------------------------
function Ingredient(id, posX, posY, onShelf) {
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.onShelf = onShelf;
    this.grabbed = mouseIsPressed;
    this.offsetX = 0;
    this.offsetY = 0;

    this.update = function () {

        // hover stuff
        if (this.grabbed) {
            currentHover = this;
            this.posX = mouseX / scale + this.offsetX;
            this.posY = mouseY / scale + this.offsetY;
        }
        else if (mouseX / scale > this.posX && mouseX / scale < this.posX + medSpacing && mouseY / scale > this.posY && mouseY / scale < this.posY + medSpacing) {
            if (currentHover !== this) {
                // enter hover
                currentHover = this;
            }
        } else if (currentHover === this) {
            // exit hover
            currentHover = null;
        }

        if (!this.onShelf) {
            if (!this.grabbed) {
                this.posY += gravity;
                if (this.posY > height / scale) {
                    let index = gameObjects.indexOf(this);
                    if (index !== -1) {
                        gameObjects.splice(index, 1);
                    }
                }
            }
        }
    }

    this.show = function () {
        // if (this.onShelf) {
            if (showNames) {

                drawName(this.id, this.posX, this.posY + medSpacing);
            }
        // }
        drawFrame(ingredientSpriteStrips[this.id], this.posX, this.posY);
    }

    this.onMouseDown = function () {
        if (this.onShelf) {
            let m = new Ingredient(this.id, this.posX, this.posY, false);
            m.offsetX = this.posX - mouseX / scale;
            m.offsetY = this.posY - mouseY / scale;
            gameObjects.push(m);
        }
    }

    this.onMouseUp = function () {
        if (this.grabbed) {
            this.grabbed = false;
            currentHover = null;
        }
    }
}


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