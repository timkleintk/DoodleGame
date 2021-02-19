const aspectRatio = 16 / 9;

// audio
let currentTrack = null;
let audios = [];
let menuAudios = [];
let muted = false;

// colors
let teal;

// ui
let uiElements = [];
let currentHover = null;


const buttonPadding = 10;
const letterWidth = 16;
// medicins
let medX = 550;
let medY = 550;
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
let blenderSpriteStrip;
let lidSpriteStrip;
let buttonSpriteStrip;
let shakeSpriteStrip;
let muteSpriteStrip;
let unmuteSpriteStrip;

const numLetters = 20;
let letterSpriteStrips = [];

// face
let faceParts = [
    "head",
    "angryEyes",
    "sadEyes",
    "sadMouth",
    "happyMouth",
]
let faceSpriteStrips = {};


// ingredients
const numIngredients = 6;
const ingredientsEnum = {"mushroom": 0, "flask": 1, "bone": 2, "berries": 3, "corked": 4, "gunpowder": 5}
let ingredientSpriteStrips = [];

const nameLength = 2;
let ingredientNames = [];


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

const personSpacing = 250;
const walkSpeed = 10;
const lineLength = 3;

let showNames = true;

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
        onStartNewGame: () => { startNewGame(); },
        onPauseGame: () => { loadPauseUI(); },
        onExitToMainMenu: () => { loadMainMenuUI(); },
        onResumeGame: () => { loadGameUI(); },
    }
})

// crafting system