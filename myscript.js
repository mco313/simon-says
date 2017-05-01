/*jslint
    browser:true, devel:true, es6, this:true
*/

const colorButtons = document.querySelectorAll('.game-button');
const startButton = document.getElementById('start-button');
const strictButton = document.getElementById('strict');
const display = document.getElementById('display');
const powerButton = document.getElementById('switch');

const redSound = new Audio('sounds/redsound.mp3');
const yellowSound = new Audio('sounds/yellowsound.mp3');
const greenSound = new Audio('sounds/greensound.mp3');
const blueSound = new Audio('sounds/bluesound.mp3');
const loseSound = new Audio('sounds/buzzer.mp3');

const colorObj = {
    red: redSound,
    yellow: yellowSound,
    green: greenSound,
    blue: blueSound
};
// ['red', 'yellow', 'green', 'blue'];
let playTimer;
let currentGame = [];
let playerChoices = [];
let gameObj = {};

gameObj.running = 'false';
gameObj.strict = 'false';

gameObj.nextColor = function () {
    'use strict';
    const randomIndex = Math.floor(Math.random() * 4);
    currentGame.push(Object.keys(colorObj)[randomIndex]);
    const level = currentGame.length;
    display.textContent = level;
    gameObj.playSequence();
};

gameObj.userPlay = function () {
    'use strict';
    // clearInterval(playTimer);
    const divPressed = this;
    const colorPressed = divPressed.getAttribute('id');
    playerChoices.push(colorPressed);
    const choiceLoc = playerChoices.length - 1;
    divPressed.classList.add('active');
    setTimeout(function () {
        divPressed.classList.remove('active');
    }, 500);
    if (colorPressed !== currentGame[choiceLoc]) {
        gameObj.wrongChoice();
    } else {
        colorObj[colorPressed].play();
        if (playerChoices.length === currentGame.length) {
            playerChoices = [];
            setTimeout(gameObj.nextColor, 1000);
        }
        // playTimer = setInterval(gameObj.wrongChoice, 3000);
    }
};

gameObj.playSequence = function () {
    'use strict';
    colorButtons.forEach(function (elem) {
        elem.removeEventListener('click', gameObj.userPlay);
    });
    let index = 0;
    function playNext() {
        if (index < currentGame.length) {
            const soundLoc = colorObj[currentGame[index]];
            const divLoc = document.getElementById(currentGame[index]);
            divLoc.classList.add('active');
            setTimeout(function () {
                divLoc.classList.remove('active');
            }, 500);
            soundLoc.play();
            index += 1;
        } else {
            console.log('loopEnd');
            colorButtons.forEach(function (elem) {
                elem.addEventListener('click', gameObj.userPlay);
            });
            // playTimer = setInterval(gameObj.wrongChoice, 3000);
            return;
        }
        setTimeout(playNext, 1000);
    }
    playNext();
};

gameObj.wrongChoice = function () {
    'use strict';
    loseSound.play();
    // clearInterval(playTimer);
    if (gameObj.strict === true) {
        setTimeout(gameObj.newGame, 2500);
    } else {
        playerChoices = [];
        setTimeout(gameObj.playSequence, 2500);
    }
};

gameObj.newGame = function () {
    'use strict';
    currentGame = [];
    playerChoices = [];
    gameObj.nextColor();
};

powerButton.addEventListener('click', function () {
    'use strict';
    startButton.addEventListener('click', gameObj.newGame);
    strictButton.addEventListener('click', function () {
        gameObj.strict = (gameObj.strict === 'false')
            ? true
            : false;
    });
    colorButtons.forEach(function (elem) {
        elem.addEventListener('click', gameObj.userPlay);
    });
});
