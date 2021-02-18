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






