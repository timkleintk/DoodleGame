const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// drawing stuff ---------------------------------------------------
function drawFrame(strip, posX, posY) {
    image(strip, posX * scale, posY * scale, strip.width / numFrames * scale, strip.height * scale, strip.width / numFrames * frameIndex, 0, strip.width / numFrames, strip.height);
}

function drawName(id, posX, posY) {
    for (let i = 0; i < nameLength; i++) {
        drawFrame(letterSpriteStrips[ingredientNames[id][i]], posX + letterWidth * i, posY);
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

function whichTracks() {
    playing = [];
    audios.forEach((a, i) => {
        if (a.isPlaying()) { playing.push(a); }
    })

    menuAudios.forEach((a, i) => {
        if (a.isPlaying()) { playing.push(a); }
    })

    if (playing.length === 0) { return false; }
    else return playing;
}

function audioCallback(arg) {
    // make sure to handle the double callback calls:
    if (currentTrack === arg) {
        playSound();
    }
}

function playSound() {
    if (muted) {return;}
    // make sure to only play one at a time
    let oldTrack = currentTrack;
    currentTrack = null;
    if (oldTrack) { oldTrack.stop(); }    

    let tracks = whichTracks();   
    if (!tracks || (tracks.length == 1 && tracks[0] == oldTrack)) {
        if (state.state == "mainMenu") {
            let i = floor(random() * menuAudios.length);
            while (menuAudios[i] === oldTrack) { i = floor(random() * menuAudios.length); }
            menuAudios[i].play();
            currentTrack = menuAudios[i];
        } else {
            let i = floor(random() * audios.length);
            while (audios[i] === oldTrack) { i = floor(random() * audios.length); }
            audios[i].play();
            currentTrack = audios[i];
        }

    }

}