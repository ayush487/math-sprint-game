// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
// Score Storage
const score10El = document.getElementById('score-for-10')
const score25El = document.getElementById('score-for-25')
const score50El = document.getElementById('score-for-50')
const score99El = document.getElementById('score-for-99')

// Equations
let questionAmount = 0
let equationsArray = []
let playerGuessArray = []

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {}
const wrongFormat = []

let bestScoreObject = {}

// Time
let timer;
let timePlayed = 0
let penaltyTime = 0
let finalTime = 0
let finalTimeDisplay = '0.0s'


// Scroll
let valueY = 0

// Save Score to local Strorage
const saveScore = () => {
  console.log('final Score', finalTime, 'Questions : ', questionAmount)
  let previousRecords = JSON.parse(localStorage.getItem('scores'))
  if(questionAmount == 10) {
    if(previousRecords['score10']) {
      previousRecords['score10'] = (finalTime < previousRecords['score10']) ? finalTime.toFixed(1) : previousRecords['score10']
    }else {
      previousRecords['score10'] = finalTime.toFixed(1)
    }
  }else if(questionAmount == 25) {
    if(previousRecords['score25']) {
      previousRecords['score25'] = (finalTime < previousRecords['score25']) ? finalTime.toFixed(1) : previousRecords['score25']
    }else {
      previousRecords['score25'] = finalTime.toFixed(1)
    }
  }else if(questionAmount == 50) {
    // previousRecords['score50'] = finalTime.toFixed(1)
    if(previousRecords['score50']) {
      previousRecords['score50'] = (finalTime < previousRecords['score50']) ? finalTime.toFixed(1) : previousRecords['score50']
    }else {
      previousRecords['score50'] = finalTime.toFixed(1)
    }
  }else if(questionAmount == 99) {
    // previousRecords['score99'] = finalTime.toFixed(1)
    if(previousRecords['score99']) {
      previousRecords['score99'] = (finalTime < previousRecords['score99']) ? finalTime.toFixed(1) : previousRecords['score99']
    }else {
      previousRecords['score99'] = finalTime.toFixed(1)
    }
  }
  localStorage.setItem('scores', JSON.stringify(previousRecords))
}

const populateScorePage = () => {
  finalTimeEl.textContent = `${finalTime.toFixed(1)}s`
  baseTimeEl.textContent = `Base Time: ${timePlayed.toFixed(1)}s`
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime.toFixed(1)}s`
}

// Display Score Page
const showScorePage = () => {
  populateScorePage()
  scorePage.hidden = false
  gamePage.hidden = true
}


// Stop Timer, Process Results, go to Score page
const checkTime = () => {
  if(playerGuessArray.length == questionAmount) {
    clearInterval(timer)
    // Check for wrong quesses, add penalty time
    equationsArray.forEach((equation, index) => {
      if(equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        penaltyTime += 3;
      }
    })
    finalTime = timePlayed + penaltyTime
    itemContainer.scroll(0, 0)
    saveScore()
    showScorePage()
  }
}

// Add a tenth of a second to timePlayed
const addTime = () => {
  timePlayed += 0.1
  checkTime()

}

// Start timeer when game page is clicked
const startTimer = () => {
  // Reset times
  timePlayed = 0
  penaltyTime = 0
  finalTime = 0
  timer = setInterval(addTime, 100)
  gamePage.removeEventListener('click', startTimer)
}

// Scroll, Store user selection in playerGuessArray
const select = (guessedTrue) => {
  // Scroll 80 pixels
  valueY += 80
  itemContainer.scroll(0,valueY)
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}

// Displays Game Page
const showGamePage = () => {
  gamePage.hidden = false
  countdownPage.hidden = true
}

// Get Random Number upto a max number
const getRandomInt = (max) =>  {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray)
}

// Add Equations to DOM
const equationToDOM = () => {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div')
    item.classList.add('item')
    // Equation Text
    const equationText = document.createElement('h1')
    equationText.textContent = equation.value
    // Append
    item.appendChild(equationText)
    itemContainer.appendChild(item)
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations()
  equationToDOM()

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-220');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, Go!
const countdownStart = () => {
  countdown.textContent = '3'
  setTimeout(() => {
    countdown.textContent = '2'
  }, 1000)
  setTimeout(() => {
    countdown.textContent = '1'
  }, 2000)
  setTimeout(() => {
    countdown.textContent = 'Go!'
  }, 3000)
  
}

// Navigate from Splash Page to Countdown Page
const showCountdown = () => {
  countdownPage.hidden = false
  splashPage.hidden = true
  countdownStart()
  // createEquations()
  populateGamePage()
  setTimeout(showGamePage, 4000)
}

// Get the value from selected radio button
const getRadioValue = () => {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if(radioInput.checked) {
      radioValue = radioInput.value;
    }
  })
  return radioValue;
}

const selectQuestionAmount = (e) => {
  e.preventDefault()
  questionAmount = getRadioValue()
  if(questionAmount) {
    showCountdown()
  }
}

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Select Label Styling
    radioEl.classList.remove('selected-label')
    // Add It back if radio input is checked
    if(radioEl.children[1].checked) {
      radioEl.classList.add('selected-label')
    }
  })
})

const resetInitalData = () => {
  equationsArray = []
  playerGuessArray = []
  timePlayed = 0
  finalTime = 0
  penaltyTime = 0
  itemContainer.scroll(0,-1 * valueY)
  valueY = 0
  gamePage.addEventListener('click', startTimer)
}

const restart = () => {
  retrieveScore()
  resetInitalData()
  splashPage.hidden = false
  scorePage.hidden = true
}

// Event Listeners
startForm.addEventListener('submit', selectQuestionAmount)
gamePage.addEventListener('click', startTimer)

const retrieveScore = () => {
  if(localStorage.getItem('scores')){
    let previousRecords = JSON.parse(localStorage.getItem('scores'))
    score10El.textContent = (previousRecords['score10']) ? `${previousRecords['score10']}s` : '0.0s'
    score25El.textContent = (previousRecords['score25']) ? `${previousRecords['score25']}s` : '0.0s'
    score50El.textContent = (previousRecords['score50']) ? `${previousRecords['score50']}s` : '0.0s'
    score99El.textContent = (previousRecords['score99']) ? `${previousRecords['score99']}s` : '0.0s'
    console.log('test')
  } else {
    localStorage.setItem('scores', JSON.stringify(bestScoreObject))
    score10El.textContent = '0.0s'
    score25El.textContent = '0.0s'
    score50El.textContent = '0.0s'
    score99El.textContent = '0.0s'
  }
}

window.onload = () => {
  retrieveScore()
}
