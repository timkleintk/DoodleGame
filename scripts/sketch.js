
const aspectRatio = 16 / 9;

// colors
let teal;

// ui
let uiElements = [];
let currentHover = null;


// images
let playSpriteStrip;
let pauseSpriteStrip;
let crossSpriteStrip;
let cursorSpriteStrip;
const numLetters = 20;
let letters = [];


// animation stuff
let frame = 0;
let frameIndex = 0;
const numFrames = 4;
const animationSpeed = 25;

// scale is based on 1200x675
let scale = 1;

// state machine functions -----------------------------------------
let state = new StateMachine({
    transitions: [
        { name: 'init', from: 'none', to: 'mainMenu' },
        { name: 'startNewGame', from: 'mainMenu', to: 'gaming' },
        { name: 'pauseGame', from: 'gaming', to: 'paused' },
        { name: 'exitToMainMenu', from: 'paused', to: 'mainMenu' },
        { name: 'resumeGame', from: 'paused', to: 'gaming' },
    ],
    methods: {
        onInit:             () => { loadMainMenuUI(); },
        onStartNewGame:     () => { loadGameUI(); },
        onPauseGame:        () => { loadPauseUI(); },
        onExitToMainMenu:   () => { loadMainMenuUI(); },
        onResumeGame:       () => { loadGameUI(); },
    }
})

function loadMainMenuUI() {
    uiElements = [];
    uiElements.push(QuickButton(playSpriteStrip, 100, 100, () => { state.startNewGame(); }));
}

function loadGameUI() {
    uiElements = [];
    uiElements.push(QuickButton(pauseSpriteStrip, 100, 100, () => { state.pauseGame(); }))
}

function loadPauseUI() {
    uiElements = [];
    uiElements.push(QuickButton(playSpriteStrip, 100, 100, () => { state.resumeGame(); }));
    uiElements.push(QuickButton(crossSpriteStrip, 220, 100, () => { state.exitToMainMenu(); }))

}


// init ------------------------------------------------------------

function preload() {
    playSpriteStrip = loadImage('assets/play.png');
    pauseSpriteStrip = loadImage('assets/pause.png');
    crossSpriteStrip = loadImage('assets/cross.png');
    cursorSpriteStrip = loadImage('assets/cursor.png');


    for(let i = 0; i < numLetters; i++) {
        letters.push(loadImage('assets/weirdSymbols/' + i + '.ss.png'));
    }
}

function setup() {
    // canvas
    createCanvas(100, 100).parent('canvasholder').mouseOut(() => { cursor(); }).mouseOver(() => { noCursor(); });
    sizeCanvas();

    // colors
    teal = color('teal');

    // ui
    noCursor();

    state.init();
}


// tick ------------------------------------------------------------
function draw() {

    background(0);

    // animation stuff
    frame++;
    if (frame % animationSpeed === 0) { frameIndex = (frameIndex + 1) % numFrames }

    // ui
    uiElements.forEach((e) => { e.update(); e.show(); });

    for (let i = 0; i < numLetters; i++) {
        drawFrame(letters[i], 10 + 16*i, 200, 16, 24);
    }


    // decide what to do based on the state
    switch (state.state) {
        case 'none':
            console.log("this is not supposed to be possible!");
            break;

        case 'mainMenu':
            break;
        case 'paused':
            break;
        case 'gaming':
            break;

        default:
            break;
    }


    drawCursor();

}

// utility functions -----------------------------------------------
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// handeling boring stuff ------------------------------------------
function windowResized() { sizeCanvas(); }

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

    this.show = function () { drawFrame(this.strip, this.posX, this.posY, this.width, this.height); }
}

function drawFrame(strip, posX, posY, width, height) {
    image(strip, posX * scale, posY * scale, width * scale, height * scale, width * frameIndex, 0, width, height);
}

function drawString(string, posX, posY) {
    let x = posX;
    let y = posY;

    for (let i = 0; i < string.length; i++) {
        let encoding = defaultFont[string[i]];
        for (let j = 0; j < encoding.length; j++) {
            drawFrame(segments[encoding[j]], x, y, 64, 128);
        }
        x += 64;
    }
}

// -----------------------------------------------------------------
// ui stuff 
// -----------------------------------------------------------------

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
        this.sprite.show();

    };

}

function QuickButton(strip, posX, posY, onClick) {
    return new Button(new Sprite(strip, posX + 18, posY + 18, 64, 64), teal, posX, posY, 100, 100, onClick);
}


function mouseClicked() { if (currentHover !== null) { currentHover.onClick(); } }

function drawCursor() {
    if (mouseX >= -1 && mouseY >= -1) {
        image(cursorSpriteStrip, clamp(mouseX, 0, width), clamp(mouseY, 0, height), 32 * scale, 32 * scale, ((currentHover ? 4 : 0) + frameIndex) * 32, 0, 32, 32);
    }
}
