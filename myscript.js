/*jslint
    browser:true, devel:true, es6, this:true
*/

const colorButtons = document.querySelectorAll('.game-button');
const startButton = document.getElementById('start-button');
const strictButton = document.getElementById('strict');
const display = document.getElementById('display');
const powerButton = document.getElementById('switch');
const wrapperDiv = document.getElementById('wrapper');
const strictLight = document.getElementById('strict-light');
const winMessage = document.getElementById('winner');

const redSound = new Audio('sounds/redsound.mp3');
const yellowSound = new Audio('sounds/yellowsound.mp3');
const greenSound = new Audio('sounds/greensound.mp3');
greenSound.volume = 1.0;
const blueSound = new Audio('sounds/bluesound.mp3');
const loseSound = new Audio('sounds/buzzer.mp3');
loseSound.volume = 0.2;

const colorObj = {
    red: redSound,
    yellow: yellowSound,
    green: greenSound,
    blue: blueSound
};
let colorTimer;
let playTimer;
let currentGame = [];
let playerChoices = [];
let gameObj = {};

gameObj.running = false;
gameObj.strict = false;

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
    clearInterval(playTimer);
    if (playerChoices.length > 0) {
        clearInterval(colorTimer);
        const lastColor = playerChoices[playerChoices.length - 1];
        const lastColorElem = document.getElementById(lastColor);
        console.log(lastColorElem);
        colorObj[lastColor].pause();
        lastColorElem.classList.remove('active');
    }
    const divPressed = this;
    const colorPressed = divPressed.getAttribute('id');
    playerChoices.push(colorPressed);
    const choiceLoc = playerChoices.length - 1;
    divPressed.classList.add('active');
    colorTimer = setTimeout(function () {
        divPressed.classList.remove('active');
    }, 500);
    if (colorPressed !== currentGame[choiceLoc]) {
        gameObj.wrongChoice();
    } else {
        colorObj[colorPressed].currentTime = 0;
        colorObj[colorPressed].play();
        if (playerChoices.length === currentGame.length) {
            playerChoices = [];
            if (currentGame.length === 20) {
                gameObj.winner();
            } else {
                setTimeout(gameObj.nextColor, 1000);
            }
        }
        clearInterval(playTimer);
        playTimer = setInterval(gameObj.wrongChoice, 3000);
    }
};

gameObj.playSequence = function () {
    'use strict';
    clearInterval(playTimer);
    colorButtons.forEach(function (elem) {
        elem.classList.add('no-clicks');
    });
    let index = 0;
    function playNext() {
        if (!powerButton.checked) {
            return;
        }
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
            colorButtons.forEach(function (elem) {
                elem.classList.remove('no-clicks');
            });
            playTimer = setInterval(gameObj.wrongChoice, 3000);
            return;
        }
        setTimeout(playNext, 1000);
    }
    playNext();
};

gameObj.wrongChoice = function () {
    'use strict';
    colorButtons.forEach(function (elem) {
        elem.classList.add('no-clicks');
    });
    loseSound.play();
    clearInterval(playTimer);
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

gameObj.winner = function () {
    'use strict';
    let times = 0;
    function flash() {
        colorButtons.forEach(function (elem) {
            if (times % 2 === 0) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        });
        times += 1;
        if (times === 6) {
            return;
        }
        setTimeout(flash, 500);
    }
    flash();
    clearInterval(playTimer);
    setTimeout(gameObj.newGame, 3000);
};

powerButton.addEventListener('click', function () {
    'use strict';
    if (powerButton.checked) {
        wrapperDiv.classList.add('power-on');
        display.textContent = '--';
        startButton.classList.remove('no-clicks');
        strictButton.classList.remove('no-clicks');
    } else {
        wrapperDiv.classList.remove('power-on');
        display.textContent = '';
        colorButtons.forEach(function (elem) {
            elem.classList.add('no-clicks');
        });
        startButton.classList.add('no-clicks');
        strictButton.classList.add('no-clicks');
        clearInterval(playTimer);
    }
    startButton.addEventListener('click', gameObj.newGame);
    strictButton.addEventListener('click', function () {
        if (gameObj.strict === false) {
            gameObj.strict = true;
            strictLight.classList.add('strict-on');
        } else {
            gameObj.strict = false;
            strictLight.classList.remove('strict-on');
        }
    });
    colorButtons.forEach(function (elem) {
        elem.addEventListener('click', gameObj.userPlay);
    });
});
