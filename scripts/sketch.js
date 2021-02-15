const aspectRatio = 16 / 9;

// ui
let currentHover;

let playSpriteStrip;
let playSprite;
let playButton;

let frame = 0;

// scale is based on 1200x675
let scale = 1;



// init ------------------------------------------------------------
function preload() {

    playSpriteStrip = loadImage('assets/play.png');
}

function setup() {

    // canvas
    createCanvas(100, 100).parent('canvasholder');
    sizeCanvas();

    // ui
    playSprite = new Sprite(playSpriteStrip, 4, 25, 100, 100, 64, 64);
    playButton = new Button(playSprite, color('teal'), 84, 84, 96, 96, () => { console.log("button clicked!"); });
}

// tick ------------------------------------------------------------
function draw() {
    background(0);
    frame++;
    
    playButton.show();



}

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
function Sprite(strip, numFrames, speed, posX, posY, width, height) {
    this.strip = strip;
    this.numFrames = numFrames;
    this.speed = speed;

    this.posX = posX;
    this.posY = posY;

    this.width = width;
    this.height = height;

    this.show = function () {
        let index = floor(frame / speed) % numFrames;
        image(this.strip, this.posX * scale, this.posY * scale, this.width * scale, this.height * scale, this.width * index, 0, this.width, this.height);
    }
}

// Button class ----------------------------------------------------
function Button(sprite, bColor, posX, posY, width, height, onclick) {
    this.sprite = sprite;
    this.bColor = bColor;
    this.posX = posX;
    this.posY = posY;
    this.width = width;
    this.height = height;
    this.onclick = onclick;

    this.delta = 10;
    this.tempX = this.posX;
    this.tempY = this.posY;
    this.tempWidth = this.width;
    this.tempHeight = this.height;

    this.show = function () {

        // determine hover
        if (mouseX / scale > this.tempX && mouseX / scale < this.tempX + this.tempWidth && mouseY / scale > this.tempY && mouseY / scale < this.tempY + this.tempHeight) {
            this.tempX = this.posX - this.delta;
            this.tempY = this.posY - this.delta;
            this.tempWidth = this.width + 2 * this.delta;
            this.tempHeight = this.height + 2 * this.delta;
            cursor(getHandMousePath());
        } else {
            this.tempX = this.posX;
            this.tempY = this.posY;
            this.tempWidth = this.width;
            this.tempHeight = this.height;
            cursor(getMousePath());
        }

        // draw box
        fill(this.bColor);
        rect(this.tempX * scale, this.tempY * scale, this.tempWidth * scale, this.tempHeight * scale);

        // draw sprite
        sprite.show();

    }


}

// git test

// utility functions -----------------------------------------------

function getMousePath() {
    let index = floor(frame / 25) % 4;
    return "assets/mouse" + index + ".png";
}

function getHandMousePath() {
    let index = floor(frame / 25) % 4;
    return "assets/hand" + index + ".png";
}