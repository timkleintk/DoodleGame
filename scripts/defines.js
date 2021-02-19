const aspectRatio = 16 / 9;

// audio
let currentTrack = null;
let audios = [];
let menuAudios = [];

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

const numLetters = 20;
let letterSpriteStrips = [];

const numMedicins = 3;
const medicineEnum = { "strip": 0, "bottle": 1, "weed": 2 }
let medicinSpriteStrips = [];

const numFaceParts = 6;
const facePartEnum = { "zigzag": 0, "sad": 1, "happy": 2, "booger": 3, "high": 4, "dead": 5 }
let facePartSpriteStrips = [];

const nameLength = 4;
let medicineNames = [];

// ingredients
const numIngredients = 6;
const ingredientsEnum = {"mushroom": 0, "flask": 1, "bone": 2, "berries": 3, "corked": 4, "gunpowder": 5, "locked": 6}
let ingredientSpriteStrips = [];


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

// crafting system