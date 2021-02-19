// blender class ----------------------------------------------------
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
