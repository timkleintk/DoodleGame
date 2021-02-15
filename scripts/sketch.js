const aspectRatio = 16 / 9;

// ui
let currentHover = null;

let playSpriteStrip;
let playButton;

let cursorSpriteStrip;


// animation stuff
let frame = 0;
let frameIndex = 0;
const numFrames = 4;
let newAnimationFrame = true;
const animationSpeed = 25;

// scale is based on 1200x675
let scale = 1;



// init ------------------------------------------------------------
function preload() {

    playSpriteStrip = loadImage('assets/play.png');
    cursorSpriteStrip = loadImage('assets/cursor.png');
}

function setup() {

    // canvas
    createCanvas(100, 100).parent('canvasholder').mouseOut(() => { cursor(); }).mouseOver(() => { noCursor(); });
    sizeCanvas();

    // ui
    noCursor();
    playButton = new Button(new Sprite(playSpriteStrip, 100, 100, 64, 64), color('teal'), 84, 84, 96, 96, () => { console.log("button clicked!"); });
}

// tick ------------------------------------------------------------
function draw() {
    background(0);

    // animation stuff ---------------------------------------------
    frame++;
    newAnimationFrame = (frame % animationSpeed === 0);
    if (newAnimationFrame) { frameIndex = (frameIndex + 1) % numFrames }

    // ui stuff ----------------------------------------------------
    // mouse
    if (newAnimationFrame) { drawCursor(); }


    // update objects ----------------------------------------------
    playButton.update();

    // draw game objects -------------------------------------------
    playButton.show();



    drawCursor();

}

// utility functions -----------------------------------------------
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// handeling boring stuff ------------------------------------------
function windowResized() {

    sizeCanvas();
}

function sizeCanvas() {
    let canvasHolder = document.getElementById('canvasholder');
    let canvasWidth = canvasHolder.clientWidth;
    let canvasHeiht = canvasWidth / aspectRatio;
    scale = canvasWidth / 1200;
    resizeCanvas(canvasWidth, canvasHeiht);
}

// Sprite class ----------------------------------------------------
// yoink from https://stackoverflow.com/questions/59810654/spritesheet-animation-disappears-p5-js
function Sprite(strip, posX, posY, width, height) {
    this.strip = strip;

    this.posX = posX;
    this.posY = posY;

    this.width = width;
    this.height = height;

    this.show = function () {
        image(this.strip, this.posX * scale, this.posY * scale, this.width * scale, this.height * scale, this.width * frameIndex, 0, this.width, this.height);
    }
}


// -----------------------------------------------------------------
// ui stuff 
// -----------------------------------------------------------------

// Button class ----------------------------------------------------
function Button(sprite, bColor, posX, posY, width, height, onClick) {
    this.sprite = sprite;
    this.bColor = bColor;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.onClick = onClick;

    this.delta = 10;
    this.tempX = this.posX;
    this.tempY = this.posY;
    this.tempWidth = this.width;
    this.tempHeight = this.height;

    this.update = function () {

        // determine hover
        if (mouseX / scale > this.tempX && mouseX / scale < this.tempX + this.tempWidth && mouseY / scale > this.tempY && mouseY / scale < this.tempY + this.tempHeight) {
            // hover
            if (this !== currentHover) {
                // enter hover
                currentHover = this;

                this.tempX = this.posX - this.delta;
                this.tempY = this.posY - this.delta;
                this.tempWidth = this.width + 2 * this.delta;
                this.tempHeight = this.height + 2 * this.delta;
            }
        } else {
            // no hover
            if (this === currentHover) {
                // exit hover
                currentHover = null;

                this.tempX = this.posX;
                this.tempY = this.posY;
                this.tempWidth = this.width;
                this.tempHeight = this.height;
            }
        }
    }

    this.show = function () {

        // draw box
        fill(this.bColor);
        rect(this.tempX * scale, this.tempY * scale, this.tempWidth * scale, this.tempHeight * scale);

        // draw sprite
        sprite.show();

    };

}

function mouseClicked() { if (currentHover !== null) { currentHover.onClick(); } }

function drawCursor() {
    if (mouseX >= 0 && mouseY >= 0) {
        image(cursorSpriteStrip, clamp(mouseX, 0, width), clamp(mouseY, 0, height), 32 * scale, 32 * scale, ((currentHover ? 4 : 0) + frameIndex) * 32, 0, 32, 32);
    }
}
