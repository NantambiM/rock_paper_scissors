// STATE & GAME VARIABLES

// Game score tracking object
//  Add localStorage to persist scores when page refreshes
const scores = {
    wins: 0,
    losses: 0,
    ties: 0
};

// Game state variables
let playerChoice, result;
let isRoundActive = false;

// DOM ELEMENTS
// Screen containers
const welcomeScreen = document.querySelector('#welcome');
const choiceScreen = document.querySelector('#choices');
const resultScreen = document.querySelector('#results');
const quit = document.querySelector('#exit');

// Buttons
const yesButton = document.querySelector('#yes');
const resetButton = document.querySelector('.reset');

// Score display elements
const wins = document.querySelector('#wins');
const losses = document.querySelector('#losses');
const ties = document.querySelector('#ties');

// Result display element
const resultPara = document.querySelector('#result-text');

// Load saved scores from localStorage if available
const savedScores = JSON.parse(localStorage.getItem('rpsScores'));
if (savedScores) {
  scores.wins = savedScores.wins;
  scores.losses = savedScores.losses;
  scores.ties = savedScores.ties;

  wins.textContent = scores.wins;
  losses.textContent = scores.losses;
  ties.textContent = scores.ties;
}

// CORE GAME LOGIC
// Generate random computer choice
function computer() {
    let compNo = Math.floor(Math.random() * 3);
    const computerArray = ['rock', 'paper', 'scissors'];
    return computerArray[compNo];
}

// Determine winner by comparing player and computer choices
function determineWinner(player, comp) {
    const winner = player === comp ? 'Tie game!' :
        player === 'rock' && comp === 'paper' ? `
                You chose ${player}.
                Computer chose ${comp}.
                Computer wins!` :
        player === 'scissors' && comp === 'rock' ? `
                You chose ${player}.
                Computer chose ${comp}.
                You win!` :
        player === 'paper' && comp === 'scissors' ? `
                You chose ${player}.
                Computer chose ${comp}.
                Computer wins!` :
        `You chose ${player}.
        Computer chose ${comp}.
        You win!`;
    return winner;
}

// Execute game flow with delay to show computer thinking
function gameFlow() {
    setTimeout(() => {
        let computerChoice = computer();
        //console.log(computerChoice);
        result = determineWinner(playerChoice, computerChoice);
        updateScore(result);
        //console.log(result);
        changeScreen(resultScreen);
        resultPara.textContent = result;
        isRoundActive = false;
    }, 500);
}

// SCORE MANAGEMENT
// Update score display and localStorage based on game result
function updateScore(result) {
    if (result.includes('You win')) {
        scores.wins++;
    } else if (result.includes('Computer wins')) {
        scores.losses++;
    } else if (result.includes('Tie game!')) {
        scores.ties++;
    }
    //console.log(scores);
    wins.textContent = scores.wins;
    losses.textContent = scores.losses;
    ties.textContent = scores.ties;
    localStorage.setItem('rpsScores', JSON.stringify(scores));
}

// Reset all scores to 0 and update display
function resetScores() {
    scores.wins = 0;
    scores.losses = 0;
    scores.ties = 0;
    localStorage.setItem('rpsScores', JSON.stringify(scores));
    wins.textContent = scores.wins;
    losses.textContent = scores.losses;
    ties.textContent = scores.ties;
}

// changing between screens
// Change active screen by toggling 'active' class
// Removes active class from all screens, then adds it to specified screen
function changeScreen(screen) {
    welcomeScreen.classList.remove('active');
    choiceScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quit.classList.remove('active');

    screen.classList.add('active');
}

// EVENT LISTENERS
// Start game button: transition from welcome screen to choices screen
yesButton.addEventListener('click', () => {
    changeScreen(choiceScreen);
});
//using enter to start the game
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && welcomeScreen.classList.contains('active')) {
        changeScreen(choiceScreen);
    }
});

// Reset score button: reset all scores to zero
resetButton.addEventListener('click', () => {
    resetScores();
});

//using keyboard instead of clicking the icons
document.addEventListener('keydown', (event) => {
    if (!choiceScreen.classList.contains('active')) return;
    if (isRoundActive) return;
    const key=event.key.toLowerCase();
    //console.log(key);

    if (key === 'r') {
        playerChoice = 'rock';
    } else if (key === 'p') {
        playerChoice = 'paper';
    } else if (key === 's') {
        playerChoice = 'scissors';
    } else {
        return;
    }

    isRoundActive = true;
    //console.log(playerChoice);
    gameFlow();
    });

// Player choice buttons: register choice and execute game flow
// Improved logic to prevent multiple clicks during when one has already clicked
document.querySelectorAll(".choice")
    .forEach((button) => {
        button.addEventListener('click', () => {
            if (isRoundActive) return;

            isRoundActive = true;
            playerChoice = button.dataset.choice;
            //console.log(playerChoice);
            gameFlow();
        }
        );
    });

// Play again buttons: return to welcome screen
document.querySelectorAll('.play-again')
    .forEach((button) => {
        button.addEventListener('click', () => {
            changeScreen(welcomeScreen);
        });
    });

// Quit/exit buttons: show quit screen
document.querySelectorAll('.not-playing')
    .forEach((button) => {
        button.addEventListener('click', () => {
            changeScreen(quit);
        });
    });