// -----------------------------------------------------------------
// classes 
// -----------------------------------------------------------------

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
        // console.log('updated sprite');
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

// Button class ----------------------------------------------------
function Button(sprite, bColor, posX, posY, width, height, onClick) {
    // this.sprite = new Sprite(strip, posX, posY, width, height);
    this.sprite = sprite;
    this.bColor = bColor;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.onClick = onClick;

    this.update = function () {

        // determine hover
        if (mouseX / scale > this.posX && mouseX / scale < this.posX + this.width && mouseY / scale > this.posY && mouseY / scale < this.posY + this.height) {
            // hover
            if (this !== currentHover) {
                // enter hover
                currentHover = this;
            }
        } else if (this === currentHover) {
            // exit hover
            currentHover = null;

        }
    }

    this.show = function () {

        // draw box
        fill(this.bColor);
        rect(
            scale * (this.posX - (currentHover === this ? buttonPadding : 0)),
            scale * (this.posY - (currentHover === this ? buttonPadding : 0)),
            scale * (this.width + (currentHover === this ? 2 * buttonPadding : 0)),
            scale * (this.height + (currentHover === this ? 2 * buttonPadding : 0))
        );

        // draw sprite
        this.sprite.show();

    };
}

function QuickButton(strip, posX, posY, onClick) {
    return new Button(
        new Sprite(
            strip,
            posX + buttonPadding,
            posY + buttonPadding,
            false
        ),
        teal,
        posX,
        posY,
        strip.width / numFrames + 2 * buttonPadding,
        strip.height + 2 * buttonPadding,
        onClick
    );
}



// person class ----------------------------------------------------

function Person(posX, posY) {
    this.state = "inLine";

    this.mouth = "sadMouth";
    this.eyes = "sadEyes";

    this.targetPosX = posX;
    this.targetPosY = posY;



    this.needs = [floor(random() * numIngredients), floor(random() * numIngredients)];
    this.received = [];

    this.posX = posX;
    this.posY = posY;

    // this.removeFacePart = function (a) {
    // let i = this.face.indexOf(a);
    // if (i !== -1) { this.face.splice(i, 1); }
    // }

    this.makeHappy = function () {
        this.mouth = "happyMouth";
        this.eyes = "sadEyes";
    }

    this.makeAngry = function () {
        this.mouth = "sadMouth";
        this.eyes = "angryEyes";
    }

    this.isAngry = function () { return this.eyes == "angryEyes"; }
    this.walkAway = function () {
        this.state = "walkAway";
    }

    this.update = function () {

        if (this.state === "aanDeBeurt") {
            let r = personSpriteStrip.width / numFrames / 2;
            let cx = this.posX + r;
            let cy = this.posY + r;
            gameObjects.forEach((o, i) => {
                if (o instanceof Shake && !o.onCounter && !o.grabbed) {
                    let or = shakeSpriteStrip.width / numFrames / 2;
                    let ocx = o.posX + or;
                    let ocy = o.posY + or;
                    if (sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2) < r + or) {
                        // consume

                        console.log("shake ingredients:");
                        o.ingredients.forEach(ingredient => {
                            console.log(ingredient);
                            let needIndex = this.needs.indexOf(ingredient.id);
                            if (needIndex !== -1) {
                                this.needs.splice(needIndex, 1);
                            }
                        });

                        // this.isAanDebeurt = false;
                        if (!this.isAngry()) {
                            this.makeHappy();
                        }
                        this.walkAway();

                        gameObjects.splice(i, 1);

                    }
                }
            });
        }

        if (this.state === "inLine") {

        }

        if (this.state === "walkAway") {
            this.posX += walkSpeed;
            if (this.posX > width / scale) {
                // offscreen
                if (this.needs.length === 0) {
                    this.state = "offScreen";
                } else {
                    // got the wrong thing
                    this.state = "walkBack"
                    this.mouth = "sadMouth";
                    this.eyes = "angryEyes";
                }
            }
        }

        if (this.state === "walkBack") {
            if (this.posX - (lineLenght - 1) * personSpacing < walkSpeed) {
                this.posX = (lineLenght - 1) * personSpacing;
                this.state = "aanDeBeurt";
            } else {
                this.posX -= walkSpeed;
            }
        }
    }

    this.show = function () {

        // draw peron
        // this.face.forEach(name => {
        drawFrame(faceSpriteStrips["head"], this.posX, this.posY);
        drawFrame(faceSpriteStrips[this.mouth], this.posX, this.posY);
        drawFrame(faceSpriteStrips[this.eyes], this.posX, this.posY);
        // })

        // this.attributes.forEach((i) => { drawFrame(facePartSpriteStrips[i], this.posX, this.posY); })

        // draw needs
        if (this.state === "aanDeBeurt") {
            drawFrame(speechSpriteStrip, this.posX + 75, this.posY - 50);
            this.needs.forEach((need, i) => {
                drawName(need, this.posX + 82 + i * (nameLength + 1) * letterWidth, this.posY - 40);
            });
            
        }
    }

}

function Blender(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.contains = [];
    this.isClosed = false;


    this.update = function () {
        this.lid.update();
        this.button.update();

        let r = blenderSpriteStrip.width / numFrames / 2;
        let cx = this.posX + r;
        let cy = this.posY + r;

        if (!this.isClosed) {
            gameObjects.forEach((o, i) => {
                if (o instanceof Ingredient && !o.onShelf && !o.grabbed) {
                    let or = ingredientSpriteStrips[o.id].width / numFrames / 2;
                    let ocx = o.posX + or;
                    let ocy = o.posY + or;
                    if (sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2) < r + or) {

                        o.posX = cx - or - 20;
                        o.posY = cy - or - 20;

                        this.contains.push(o);


                        gameObjects.splice(i, 1);

                    }
                }
            });
        }

    }

    this.show = function () {
        drawFrame(blenderSpriteStrip, this.posX, this.posY);
        this.contains.forEach(i => { i.show(); })
        this.lid.show();
        this.button.show();
    }

    this.closeLid = function () {
        this.isClosed = true;
        this.lid.posX = this.posX;
        this.lid.posY = this.posY;
        this.lid.onClick = () => { this.openLid(); };
        if (this.contains.length > 0) {
            this.button.clickable = true;
        }
    }

    this.openLid = function () {
        this.isClosed = false;
        this.lid.posX = this.posX - 110;
        this.lid.posY = this.posY + 200;
        this.lid.onClick = () => { this.closeLid() };
        this.button.clickable = false;
    }

    this.blend = function () {
        gameObjects.push(new Shake(this.contains, this.posX + 220, this.posY, true));

        this.contains = [];
        this.openLid();

    }

    this.lid = new Sprite(lidSpriteStrip, this.posX - 110, this.posY + 200, true, () => { this.closeLid(); })
    this.button = new Sprite(buttonSpriteStrip, this.posX + 70, this.posY + 170, false, () => { this.blend(); });
}


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
            // drawName(this.id, this.posX, this.posY + medSpacing);
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


function Line() {
    this.length = lineLenght;
    this.people = [];

    this.state = "done";

    // populate
    for (let i = 0; i < this.length; i++) {
        this.people.push(new Person(i * personSpacing, 100));
    }
    this.people[this.length - 1].state = "aanDeBeurt";

    this.update = function () {

        // update the peoples
        this.people.forEach((p, i) => {
            p.update();
            if (p.state === "offScreen") {
                this.people.splice(i, 1);
                this.people.unshift(new Person(-personSpacing, 100));
                this.state = "shuffling";
            }
        });

        if (this.state === "shuffling") {
            // gap in the line

            this.state = "shuffled";
            this.people.forEach((p, i) => {
                if (i * personSpacing - p.posX < walkSpeed) {
                    p.posX += i * personSpacing - p.posX;
                } else {
                    p.posX += walkSpeed;
                    this.state = "shuffling";
                }
            });
            if (this.state === "shuffled") {
                // done shuffling
                this.people[this.length - 1].state = "aanDeBeurt";
            }
        }
    }

    this.show = function () {
        this.people.forEach(p => { p.show(); })
    }
}