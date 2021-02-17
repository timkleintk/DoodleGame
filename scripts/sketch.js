
const aspectRatio = 16 / 9;

// colors
let teal;

// ui
let uiElements = [];
let currentHover = null;


const buttonPadding = 10;
const letterWidth = 16;
// medicins
let medX = 450;
let medY = 240;
let medSpacing = 100;


// images
let playSpriteStrip;
let pauseSpriteStrip;
let crossSpriteStrip;
let cursorSpriteStrip;
let officeSpriteStrip;
let personSpriteStrip;
let speechSpriteStrip;
let skipSpriteStrip;

const numLetters = 20;
let letterSpriteStrips = [];

const numMedicins = 3;
const medicineEnum = { "strip": 0, "bottle": 1, "weed": 2 }
let medicinSpriteStrips = [];

const numFaceParts = 6;
const facePartEnum = { "zigzag": 0, "sad": 1, "happy": 2, "booger": 3, "high": 4, "dead": 5 }
let faceParts = [];

const nameLength = 4;
let medicineNames = [];

// animation stuff
let frame = 0;
let frameIndex = 0;
const numFrames = 4;
const animationSpeed = 25;

// scale is based on 1200x675
let scale = 1;

// misc
let gameObjects = [];
const gravity = 10;


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
        onInit: () => { loadMainMenu(); },
        onStartNewGame: () => { startNewGame(); },
        onPauseGame: () => { loadPauseUI(); },
        onExitToMainMenu: () => { loadMainMenu(); },
        onResumeGame: () => { loadGameUI(); },
    }
})

function loadMainMenu() {
    uiElements = [];
    uiElements.push(QuickButton(playSpriteStrip, 20, 20, () => { state.startNewGame(); }));
}

function startNewGame() {
    // reset game objects
    gameObjects = [];
    for (let i = 0; i < numMedicins; i++) {
        gameObjects.push(new Medicine(i, medX + i * medSpacing, medY, true));
    }

    gameObjects.push(new Person([0]));

    // reset names
    medicineNames = [];
    for (let i = 0; i < numMedicins; i++) {
        let name = [];
        for (let j = 0; j < nameLength; j++) {
            name.push(Math.floor(Math.random() * numLetters));
        }
        medicineNames.push(name);
    }

    loadGameUI();
}

function loadGameUI() {
    uiElements = [];
    uiElements.push(QuickButton(pauseSpriteStrip, 20, 20, () => { state.pauseGame(); }))
    uiElements.push(QuickButton(skipSpriteStrip, 150, 20, () => { startNewGame(); }))
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
    personSpriteStrip = loadImage('assets/person.ss.png');
    speechSpriteStrip = loadImage('assets/speech.ss.png');
    skipSpriteStrip = loadImage('assets/skip.ss.png');

    for (let i = 0; i < numLetters; i++) {
        letterSpriteStrips.push(loadImage('assets/weirdSymbols/' + i + '.ss.png'));
    }

    for (let i = 0; i < numMedicins; i++) {
        medicinSpriteStrips.push(loadImage('assets/medicins/' + i + '.ss.png'));
    }

    for (let i = 0; i < numFaceParts; i++) {
        faceParts.push(loadImage('assets/faceparts/' + i + '.ss.png'));
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
            // draw the background
            drawFrame(officeSpriteStrip, 0, 0, officeSpriteStrip.width / 4, officeSpriteStrip.height);

            gameObjects.forEach(o => o.update());
            gameObjects.forEach(o => o.show());

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


// handeling events stuff ------------------------------------------
function windowResized() { sizeCanvas(); }

function sizeCanvas() {
    let canvasHolder = document.getElementById('canvasholder');
    let canvasWidth = canvasHolder.clientWidth;
    let canvasHeiht = canvasWidth / aspectRatio;
    scale = canvasWidth / 1200;
    resizeCanvas(canvasWidth, canvasHeiht);
}


function mouseClicked() { if (currentHover !== null && currentHover.onClick) { currentHover.onClick(); } }
function mousePressed() { if (currentHover !== null && currentHover.onMouseDown) { currentHover.onMouseDown(); } }
function mouseReleased() { if (currentHover !== null && currentHover.onMouseUp) { currentHover.onMouseUp(); } }


// drawing stuff ---------------------------------------------------
function drawFrame(strip, posX, posY) {
    image(strip, posX * scale, posY * scale, strip.width / numFrames * scale, strip.height * scale, strip.width / numFrames * frameIndex, 0, strip.width / numFrames, strip.height);
}

function drawName(id, posX, posY) {
    for (let i = 0; i < nameLength; i++) {
        drawFrame(letterSpriteStrips[medicineNames[id][i]], posX + letterWidth * i, posY);
    }
}

function drawCursor() {
    if (mouseX >= -1 && mouseY >= -1) {
        if (currentHover !== null) {
            image(cursorSpriteStrip, mouseX, mouseY, 32 * scale, 32 * scale, (frameIndex + (mouseIsPressed ? 8 : 4)) * 32, 0, 32, 32);
        } else {
            image(cursorSpriteStrip, mouseX, mouseY, 32 * scale, 32 * scale, frameIndex * 32, 0, 32, 32);
        }
    }
}



// -----------------------------------------------------------------
// classes 
// -----------------------------------------------------------------

// Sprite class ----------------------------------------------------
function Sprite(strip, posX, posY, clickable = false, onClick = () => { }) {

    this.strip = strip;
    this.posX = posX;
    this.posY = posY;
    this.clickable = clickable;
    this.width = strip.width / numFrames;
    this.height = strip.height;
    this.onClick = onClick;


    this.update = function () {
        if (this.clickable && mouseX / scale > this.posX && mouseX / scale < this.posX + this.width && mouseY / scale > this.posY && mouseY / scale < this.posY + this.height) {
            if (this !== currentHover) {
                // enter hover
                currentHover = this;
            } else if (this === currentHover) {
                currentHover = null;
            }
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

function Medicine(id, posX, posY, onScreen) {
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.onScreen = onScreen;
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

        if (!this.onScreen) {
            if (!this.grabbed) {
                this.posY += gravity;
                if (this.posY > height / scale) {
                    let index = gameObjects.indexOf(this);
                    if (index !== -1) {
                        gameObjects.splice(index, 1);
                    }
                }
                //         this.posX = mouseX / scale + this.posX;
                //         this.posY = mouseY / scale + this.posY;
            }
        }
    }

    this.show = function () {
        if (this.onScreen) {
            drawName(this.id, this.posX, this.posY + medSpacing);
        }
        drawFrame(medicinSpriteStrips[this.id], this.posX, this.posY);
    }

    this.onMouseDown = function () {
        if (this.onScreen) {
            let m = new Medicine(this.id, this.posX, this.posY, false);
            m.offsetX = this.posX - mouseX / scale;
            m.offsetY = this.posY - mouseY / scale;
            gameObjects.push(m);
        }
    }

    this.onMouseUp = function () {
        if (this.grabbed) {
            this.grabbed = false;
        }
    }
}


// person class ----------------------------------------------------

function Person() {
    this.attributes = [facePartEnum.sad];
    this.needs = floor(random() * numMedicins);
    this.posX = 100;
    this.posY = 250;

    this.removeAttribute = function (a) {
        let i = this.attributes.indexOf(a);
        if (i !== -1) { this.attributes.splice(i, 1); }
    } 

    this.isHappy = function () {
        return this.attributes.indexOf(facePartEnum.happy) !== -1;
    }

    this.makeHappy = function () {
        this.removeAttribute(facePartEnum.zigzag);
        this.removeAttribute(facePartEnum.dead);
        this.removeAttribute(facePartEnum.sad);
        this.attributes.push(facePartEnum.happy);
    }

    this.makeHigh = function () {
        this.attributes.push(facePartEnum.high);
    }

    this.makeDead = function () {
        this.attributes = [facePartEnum.zigzag, facePartEnum.dead];
    }

    this.update = function () {
        let r = personSpriteStrip.width / numFrames / 2;
        let cx = this.posX + r;
        let cy = this.posY + r;

        if (!this.isHappy()) {
            gameObjects.forEach((o, i) => {
                if (o instanceof Medicine && !o.onScreen && !o.grabbed) {
                    let or = medicinSpriteStrips[o.id].width / numFrames / 2;
                    let ocx = o.posX + or;
                    let ocy = o.posY + or;
                    if (sqrt((cx - ocx) ** 2 + (cy - ocy) ** 2) < r + or) {
                        // consume

                        if (o.id === this.needs) {
                            this.makeHappy();
                            if (this.needs === medicineEnum.weed) {
                                this.makeHigh();
                            }
                        } else {
                            this.makeDead();
                        }



                        gameObjects.splice(i, 1);

                    }
                }
            });
        }
    }


    this.show = function () {
        drawFrame(personSpriteStrip, this.posX, this.posY);
        this.attributes.forEach((i) => { drawFrame(faceParts[i], this.posX, this.posY); })
        drawFrame(speechSpriteStrip, this.posX + 75, this.posY - 50);
        drawName(this.needs, this.posX + 90, this.posY - 40);
    }

}