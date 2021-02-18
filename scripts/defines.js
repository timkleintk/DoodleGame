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