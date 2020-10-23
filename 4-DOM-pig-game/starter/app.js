/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

// // to be able to change both current 0 and curent 1 write id as shown
// document.querySelector('#current-' + activePlayer).innerHTML = '<em>' + dice + '<em>'

// //anonnymous fucntions used when not planning to use it therefore no need to name them usually use in call back fun no-name()

// dry principal don't repeat yourself

var scores, roundScore, activePlayer, gamePlaying //state variable to check that game is being played

init()

document.querySelector('.btn-roll').addEventListener('click', function () {
  if (gamePlaying) {
    // 1. Random number
    var dice = Math.floor(Math.random() * 6) + 1

    //2. Display the result
    var diceDOM = document.querySelector('.dice')
    diceDOM.style.display = 'block'
    diceDOM.src = 'dice-' + dice + '.png'

    //3. Update the round score IF the rolled number was NOT a 1
    if (dice !== 1) {
      //Add score
      roundScore += dice
      document.querySelector(
        '#current-' + activePlayer
      ).textContent = roundScore
    } else {
      //Next player
      nextPlayer()
    }
  }
})

document.querySelector('.btn-hold').addEventListener('click', function () {
  if (gamePlaying) {
    // Add CURRENT score to GLOBAL score
    scores[activePlayer] += roundScore

    // Update the UI
    document.querySelector('#score-' + activePlayer).textContent =
      scores[activePlayer]

    // Check if player won the game
    if (scores[activePlayer] >= 100) {
      document.querySelector('#name-' + activePlayer).textContent = 'Winner!'
      document.querySelector('.dice').style.display = 'none'
      document
        .querySelector('.player-' + activePlayer + '-panel')
        .classList.add('winner')
      document
        .querySelector('.player-' + activePlayer + '-panel')
        .classList.remove('active')
      gamePlaying = false
    } else {
      //Next player
      nextPlayer()
    }
  }
})

function nextPlayer() {
  //Next player
  //use ternanry opperate for simpler if statentn

  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0)
  roundScore = 0

  document.getElementById('current-0').textContent = '0'
  document.getElementById('current-1').textContent = '0'

  document.querySelector('.player-0-panel').classList.toggle('active')
  document.querySelector('.player-1-panel').classList.toggle('active')

  //document.querySelector('.player-0-panel').classList.remove('active');
  //document.querySelector('.player-1-panel').classList.add('active');

  document.querySelector('.dice').style.display = 'none'
}

/// new game, function is a call back function so dont call it called on the event
document.querySelector('.btn-new').addEventListener('click', init)

// run iinitialise everything called at the beginning and at the beginning of next game
function init() {
  scores = [0, 0]
  activePlayer = 0
  roundScore = 0
  gamePlaying = true

  document.querySelector('.dice').style.display = 'none'

  document.getElementById('score-0').textContent = '0'
  document.getElementById('score-1').textContent = '0'
  document.getElementById('current-0').textContent = '0'
  document.getElementById('current-1').textContent = '0'
  document.getElementById('name-0').textContent = 'Player 1'
  document.getElementById('name-1').textContent = 'Player 2'

  document.querySelector('.player-0-panel').classList.remove('winner')
  document.querySelector('.player-1-panel').classList.remove('winner')
  document.querySelector('.player-0-panel').classList.remove('active')
  document.querySelector('.player-1-panel').classList.remove('active')
  document.querySelector('.player-0-panel').classList.add('active')

  //remove classes form both as don't know who the winners are at the moment
}
