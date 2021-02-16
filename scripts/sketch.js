
const aspectRatio = 16 / 9;

// colors
let teal;

// ui
let uiElements = [];
let currentHover = null;
let buttonPadding = 10;

// images
let playSpriteStrip;
let pauseSpriteStrip;
let crossSpriteStrip;
let cursorSpriteStrip;
let officeSpriteStrip;
const numLetters = 20;
let letters = [];
const numMedicins = 3;
let medicins = [];

// medicins
let medX = 450;
let medY = 240;
let medPadding = 50;
let medSpacing = 100;

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
        onInit: () => { loadMainMenuUI(); },
        onStartNewGame: () => { loadGameUI(); },
        onPauseGame: () => { loadPauseUI(); },
        onExitToMainMenu: () => { loadMainMenuUI(); },
        onResumeGame: () => { loadGameUI(); },
    }
})

function loadMainMenuUI() {
    uiElements = [];
    uiElements.push(QuickButton(playSpriteStrip, 20, 20, () => { state.startNewGame(); }));
}

function loadGameUI() {
    uiElements = [];
    uiElements.push(QuickButton(pauseSpriteStrip, 20, 20, () => { state.pauseGame(); }))
    
    // medicine stuff
    for (let i = 0; i < numMedicins; i++) {
        uiElements.push(QuickButton(medicins[i], medX + i * medSpacing, medY, () => { }));
        let string = "";
        for (let j = 0; j < 6; j++) { string += Math.floor(Math.random() * 10); }
        uiElements.push(new Text(string, medX + i * medSpacing, medY + medSpacing));
    }
}

function loadPauseUI() {
    uiElements = [];
    uiElements.push(QuickButton(playSpriteStrip, 20, 20, () => { state.resumeGame(); }));
    uiElements.push(QuickButton(crossSpriteStrip, 150, 20, () => { state.exitToMainMenu(); }))

}


// init ------------------------------------------------------------

function preload() {
    playSpriteStrip = loadImage('assets/play.png');
    pauseSpriteStrip = loadImage('assets/pause.png');
    crossSpriteStrip = loadImage('assets/cross.png');
    cursorSpriteStrip = loadImage('assets/cursor.png');
    officeSpriteStrip = loadImage('assets/office.ss.png');

    for (let i = 0; i < numLetters; i++) {
        letters.push(loadImage('assets/weirdSymbols/' + i + '.ss.png'));
    }

    for (let i = 0; i < numMedicins; i++) {
        medicins.push(loadImage('assets/medicins/' + i + '.ss.png'));
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
            // draw the office stuff
            drawFrame(officeSpriteStrip, 0, 0, officeSpriteStrip.width / 4, officeSpriteStrip.height);

            break;

        default:
            break;
    }



    // ui
    uiElements.forEach((e) => { e.update(); e.show(); });

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

    this.show = function () { drawFrame(this.strip, this.posX, this.posY) }
}

function drawFrame(strip, posX, posY) {
    image(strip, posX * scale, posY * scale, strip.width / numFrames * scale, strip.height * scale, strip.width / numFrames * frameIndex, 0, strip.width / numFrames, strip.height);
}

function drawString(string, posX, posY) {

    for (let i = 0; i < string.length; i++) {
        drawFrame(letters[string[i]], posX + 16 * i, posY);
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

    this.update = function () {

        // determine hover
        if (mouseX / scale > this.posX && mouseX / scale < this.posX + this.width && mouseY / scale > this.posY && mouseY / scale < this.posY + this.height) {
            // hover
            if (this !== currentHover) {
                // enter hover
                currentHover = this;
            }
        } else {
            // no hover
            if (this === currentHover) {
                // exit hover
                currentHover = null;
            }
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
            strip.width / numFrames,
            strip.height / numFrames
        ),
        teal,
        posX,
        posY,
        strip.width / numFrames + 2 * buttonPadding,
        strip.height + 2 * buttonPadding,
        onClick
    );
}

function Text(string, posX, posY) {
    this.string = string;
    this.posX = posX;
    this.posY = posY;

    this.update = function() {}
    this.show = function() { drawString(this.string, this.posX, this.posY); }
    
}

function mouseClicked() { if (currentHover !== null) { currentHover.onClick(); } }

function drawCursor() {
    if (mouseX >= -1 && mouseY >= -1) {
        image(cursorSpriteStrip, clamp(mouseX, 0, width), clamp(mouseY, 0, height), 32 * scale, 32 * scale, ((currentHover ? 4 : 0) + frameIndex) * 32, 0, 32, 32);
    }
}
