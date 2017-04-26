const colorButtons = document.querySelectorAll('.game-button');

const redSound = new Audio('sounds/redsound.mp3');
const yellowSound = new Audio('sounds/yellowsound.mp3');
const greenSound = new Audio('sounds/greensound.mp3');
const blueSound = new Audio('sounds/bluesound.mp3');
const loseSound = new Audio('sounds/buzzer.mp3');

const colorArray = ['red', 'yellow', 'green', 'blue'];
let currentGame = [];
let gameObj = {};

gameObj.running = 'false';

gameObj.nextColor = function () {
  const randomIndex = Math.floor(Math.random() * 4);
  currentGame.push(colorArray[randomIndex]);
}

gameObj.storePlay = function () {
  const colorPressed = this.getAttribute('id');
  console.log(colorPressed);
}

colorButtons.forEach(function(elem) {
  elem.addEventListener('click', gameObj.storePlay);
});
