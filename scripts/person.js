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
}

Person.prototype.update = function () {

    if (this.state === "aanDeBeurt") {
        // let r = personSpriteStrip.width / numFrames / 2;
        // let cx = this.posX + r;
        // let cy = this.posY + r;

        // gameObjects.forEach((o, i) => {
        //     if (o instanceof Shake && !o.onCounter && !o.grabbed) {
        //         let or = shakeSpriteStrip.width / numFrames / 2;
        //         let ocx = o.posX + or;
        //         let ocy = o.posY + or;
        //         if (sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2) < r + or) {
        //             // consume
        //             o.ingredients.forEach(ingredient => {
        //                 let needIndex = this.needs.indexOf(ingredient.id);
        //                 if (needIndex !== -1) {
        //                     this.needs.splice(needIndex, 1);
        //                 }
        //                 else if (ingredient.id === ingredientsEnum.gunpowder) {
        //                     if (this.needs.indexOf(ingredient.id) === -1) {
        //                         this.explode();
        //                         this.state = "offScreen";

        //                     }
        //                 }
        //             });

        //             // this.isAanDebeurt = false;
        //             if (!this.isAngry()) {
        //                 this.makeHappy();
        //             }
        //             this.walkAway();

        //             gameObjects.splice(i, 1);

        //         }
        //     }
        // });

        for (let objIndex = 0; objIndex < gameObjects.length; objIndex++) {
            if (gameObjects[objIndex] instanceof Shake) {
                let shake = gameObjects[objIndex];

                if (shake.onCounter === false && shake.grabbed === false) {
                    if (this.CanConsume(shake) === true) {
                        for (ingredient of shake.ingredients) {
                            let needIndex = this.needs.indexOf(ingredient.id);
                            if (needIndex !== -1) {
                                this.needs.splice(needIndex, 1);
                            }
                            else if (ingredient.id === ingredientsEnum.gunpowder) {
                                if (this.needs.indexOf(ingredient.id) === -1) {
                                    this.state = "exploded";
                                }
                            }
                        }

                        if (this.state !== "offScreen" && this.state !== "exploded") {
                            if (!this.isAngry()) {
                                this.makeHappy();
                            }
                            this.walkAway();
                        }
    
                        gameObjects.splice(objIndex, 1);
                    }
                }
            }
            else {
                continue;
            }
        }
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

    if (this.state === "exploded") {
        //explosion code goes here
        console.log("person exploded!");
    }

    if (this.state === "walkBack") {
        if (this.posX - (lineLength - 1) * personSpacing < walkSpeed) {
            this.posX = (lineLength - 1) * personSpacing;
            this.state = "aanDeBeurt";
        } else {
            this.posX -= walkSpeed;
        }
    }
}

Person.prototype.CanConsume = function (shake) {
    let r = personSpriteStrip.width / numFrames / 2;
    let cx = this.posX + r;
    let cy = this.posY + r;
    let or = shakeSpriteStrip.width / numFrames / 2;
    let ocx = shake.posX + or;
    let ocy = shake.posY + or;
    if (sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2) < r + or) {
        return true;
    }
    else {
        return false;
    }
}

Person.prototype.makeHappy = function () {
    this.mouth = "happyMouth";
    this.eyes = "sadEyes";
}

Person.prototype.makeAngry = function () {
    this.mouth = "sadMouth";
    this.eyes = "angryEyes";
}

Person.prototype.isAngry = function () {
    return this.eyes === "angryEyes";
}

Person.prototype.walkAway = function () {
    this.state = "walkAway";
}

Person.prototype.show = function () {

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