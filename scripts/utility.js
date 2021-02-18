const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

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
