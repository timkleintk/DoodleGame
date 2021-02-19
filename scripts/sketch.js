
function startNewGame() {
    // reset game objects
    gameObjects = [];
    // for (let i = 0; i < numMedicins; i++) {
    // gameObjects.push(new Medicine(i, medX + i * medSpacing, medY, true));
    // }


    // ingredients on the shelf
    for (let i = 0; i < numIngredients; i++) {
        gameObjects.push(new Ingredient(i, medX + i * medSpacing, medY, true));
    }

    gameObjects.push(new Line(3));


    gameObjects.push(new Blender(120, 400));


    // reset names
    ingredientNames = [];
    for (let i = 0; i < numIngredients; i++) {
        let name = [];
        for (let j = 0; j < nameLength; j++) {
            name.push(Math.floor(Math.random() * numLetters));
        }
        ingredientNames.push(name);
    }

    loadGameUI();

}

function loadMainMenuUI() {
    uiElements = [];
    // uiElements.push(QuickButton(playSpriteStrip, 20, 20, () => { state.startNewGame(); }));
    uiElements.push(new Sprite(playSpriteStrip, 20, 20, true, () => { state.startNewGame(); }));
    // uiElements.push(QuickButton(gearSpriteStrip, 120, 20, () => { state.startNewGame(); state.pauseGame(); }));
    uiElements.push(new Sprite(gearSpriteStrip, 120, 20, true, () => { state.startNewGame(); state.pauseGame(); }));
}

function loadGameUI() {
    uiElements = [];
    // uiElements.push(QuickButton(gearSpriteStrip, 20, 20, () => { state.pauseGame(); }))
    uiElements.push(new Sprite(gearSpriteStrip, 120, 20, true, () => { state.pauseGame(); }))
}



function loadPauseUI() {
    uiElements = [];
    uiElements.push(new Sprite(playSpriteStrip, 20, 20, true, () => { state.resumeGame(); }));
    uiElements.push(new Sprite(crossSpriteStrip, 120, 20, true, () => { state.exitToMainMenu(); }))
    if (muted) {
        uiElements.push(new Sprite(unmuteSpriteStrip, 220, 20, true, () => { muted = false; reloadUI(); playSound(); }))
    } else {
        uiElements.push(new Sprite(muteSpriteStrip, 220, 20, true, () => { muted = true; reloadUI(); currentTrack.stop(); }))
    }
}

function reloadUI() {
    if (state.state === "mainMenu") { loadMainMenuUI(); }
    if (state.state === "gaming") { loadGameUI(); }
    if (state.state === "paused") { loadPauseUI(); }
}

// init ------------------------------------------------------------

function preload() {
    playSpriteStrip = loadImage('assets/play.png');
    // pauseSpriteStrip = loadImage('assets/pause.png');
    crossSpriteStrip = loadImage('assets/cross.png');
    cursorSpriteStrip = loadImage('assets/cursor.png');
    // officeSpriteStrip = loadImage('assets/office.ss.png');
    // personSpriteStrip = loadImage('assets/person.ss.png');
    speechSpriteStrip = loadImage('assets/speech.ss.png');
    // skipSpriteStrip = loadImage('assets/skip.ss.png');
    blenderSpriteStrip = loadImage('assets/ingredients/blender.ss.png');
    lidSpriteStrip = loadImage('assets/ingredients/lid.ss.png');
    buttonSpriteStrip = loadImage('assets/ingredients/button.ss.png');
    shakeSpriteStrip = loadImage('assets/ingredients/shake.ss.png');
    muteSpriteStrip = loadImage('assets/mute.ss.png');
    unmuteSpriteStrip = loadImage('assets/unmute.ss.png');
    explosionSpriteStrip = loadImage('assets/explosion.ss.png');
    stethoscopeSpriteStrip = loadImage('assets/stethoscope.ss.png');
    musicSpriteStrip = loadImage('assets/music.ss.png');
    musicCreditsSpriteStrip = loadImage('assets/musicCredits.ss.png');
    gameSpriteStrip = loadImage('assets/game.ss.png');
    extraCreditsSpriteStrip = loadImage('assets/extraCredits.ss.png');
    gameCreditsSpriteStrip = loadImage('assets/gameCredits.ss.png');
    gearSpriteStrip = loadImage('assets/gear.ss.png');

    for (let i = 0; i < numLetters; i++) {
        letterSpriteStrips.push(loadImage('assets/weirdSymbols/' + i + '.ss.png'));
    }

    for (let i = 0; i < numIngredients; i++) {
        ingredientSpriteStrips.push(loadImage('assets/ingredients/' + i + '.ss.png'));
    }
    ingredientSpriteStrips.push(loadImage('assets/ingredients/blender.ss.png'));

    faceParts.forEach(name => {
        faceSpriteStrips[name] = loadImage('assets/face/' + name + '.ss.png');
    });

    // headSpriteStrip = loadImage('assets/face/head.ss.png');
    // angryEyesSpriteStrip = loadImage('assets/face/angryEyes.ss.png');
    // sadEyesSpriteStrip = loadImage('assets/face/sadEyes.ss.png');
    // sadMouthSpriteStrip = loadImage('assets/face/sadMouth.ss.png');
    // happyMouthSpriteStrip = loadImage('assets/face/happyMouth.ss.png');


    // audio
    soundFormats('wav');
    for (let i = 1; i < 4; i++) {
        audios.push(loadSound('assets/audio/ScribbleJam_Loop' + i + '.wav'));
        audios.push(loadSound('assets/audio/ScribbleJam_Loop' + i + '(bassless).wav'));
    }

    for (let i = 1; i < 3; i++) {
        menuAudios.push(loadSound('assets/audio/ScribbleJam_Menu' + i + '.wav'));
        menuAudios.push(loadSound('assets/audio/ScribbleJam_Menu' + i + '(bassless).wav'));
    }

    audios.forEach((a) => {
        a.onended(audioCallback);
    });

    menuAudios.forEach((a) => {
        a.onended(audioCallback);
    });

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
    playSound();
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
        case 'paused':
            // state.startNewGame();
            drawFrame(stethoscopeSpriteStrip, 0, 0);

            drawFrame(gameSpriteStrip, 750, 200)
            drawFrame(gameCreditsSpriteStrip, 800, 200)
            
            drawFrame(musicSpriteStrip, 750, 300)
            drawFrame(musicCreditsSpriteStrip, 800, 300);

            drawFrame(extraCreditsSpriteStrip, 800, 640);
            break;
        case 'gaming':
            // draw the background
            // drawFrame(officeSpriteStrip, 0, 0);

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






