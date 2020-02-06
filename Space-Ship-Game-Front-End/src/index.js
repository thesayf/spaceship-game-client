// submitButton.addEventListener("click", () => {

// const input = document.getElementById('name-input').value

// console.log(input);

// fetch("http://localhost:3000/users", {
//           method: "POST",
//           body: JSON.stringify({
//             name: input
//           }),
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }).then(response => response.json())


// })
// _____________________________________________________________
// MENU DEFINE
const game = document.querySelector('#game')
const ship = document.querySelector('#ship')
// const background = document.querySelector('#background')
const form = document.querySelector('#form')
const musicBtn = document.querySelector('#musicbtn')
const instBtn = document.querySelector('#instructionsbtn')
const highScoresBtn = document.querySelector('#highscoresbtn')
const rightmenu = document.querySelector('#rightmenu')
const leftmenu = document.querySelector('#leftmenu')
let playToggle = 0
// GAME DEFINE
const LEFT_ARROW = 37 // use e.which!
const RIGHT_ARROW = 39 // use e.which!
const UP_ARROW = 38
const DOWN_ARROW = 40
const GAME_WIDTH = 800
const GAME_HEIGHT = 400
let ROCKS = 0
let rockArray = []
let LEVEL = 1
let SCORE = 0
let MULTIPLIER = 1
let gameInterval = null
let levelInterval = null
let userID = 0
let bigInterval = null
let scoreInterval = null
let bonusInterval = null
let bonusCollisionInterval = null
let bonusArray = []


let collisionInterval = null
document.addEventListener('DOMContentLoaded', () => {
    sound()
    // console.log("Loaded")
})

// MENU FUNCTIONALITY
function sound(){
        const music = document.createElement("audio");
        music.src = "Sparkwood+&+21 copy.mp3";
        music.id = "music"
        music.setAttribute("preload", "auto");
        music.setAttribute("controls", "none");
        music.style.display = "none";
        document.body.appendChild(music);
}

musicBtn.addEventListener("click", () => {
    const tunes = document.querySelector('#music')
    if(playToggle == 0){
        playToggle += 1
        tunes.play()
    } else {
        playToggle -= 1
        tunes.pause()
    }
})

instBtn.addEventListener("click", () => {
    rightmenu.innerHTML = ""
    const instructions = document.createElement('div')
    instructions.id = "instructions"
    instructions.innerHTML = "<p>HOW TO PLAY:<br><br>Use the arrow keys (&larr;&rarr;&uarr;&darr;) to fly your ship through the asteroid field.<br><br> Dodge the WHITE ASTEROIDS and try and collect the BLUE BONUSES!</p>"
    rightmenu.appendChild(instructions)
})

highScoresBtn.addEventListener("click", () => {
  // console.log("this is working");
    rightmenu.innerHTML = ""
    fetch("http://localhost:3000/scores")
    .then(res => res.json())
    .then(allScores => displayHighScores(allScores))

    // INSERT HIGHSCORES HERE USING A FETCH AND RENDER SCORES
})

const displayHighScores = (allScores) => {
let newScores = allScores.sort((a, b) => (a.score < b.score) ? 1 : -1)
const highScoresList = document.createElement('div')
highScoresList.id = "hi-scores"

for(let i =0; i < 8; i++){
  const eachScoreEntry = document.createElement("p")
  // eachScoreEntry.innerText = `${i+1}` + `${newScores[i].user.name}` +  "   " + `${newScores[i].score}`
  eachScoreEntry.innerHTML = `${i+1} - ${newScores[i].user.name} - ${newScores[i].score}`

  highScoresList.appendChild(eachScoreEntry)
}

  rightmenu.appendChild(highScoresList)

}


// ________________STARTING THE GAME_______________________________
form.addEventListener("submit", (event) => {
    event.preventDefault()

    const playerName = document.getElementById('name').value

    if (playerName === "")
    {
      alert("Please Enter A Player Name to begin");
    }
    else{
      fetch("http://localhost:3000/users", {
                method: "POST",
                body: JSON.stringify({
                  name: playerName
                }),
                headers: {
                  "Content-Type": "application/json"
                }
              }).then(res => res.json())
              .then(user => runGame(user))

    }
    // fetch(UsersAPI) POST
    // START GAME

})

function runGame(user){
  userID = 0
  userID += user.user.id
  // console.log(userID);
  ship.style.visibility = "visible"
  ship.style.left = "-10px"

  ship.style.top = "175px"

  rightmenu.style.visibility = "hidden"
  leftmenu.style.visibility = "hidden"
  document.addEventListener('keydown', moveShip)

  LEVEL = 4
  SCORE = 0
  MULTIPLIER = 1
  ROCKS = 0

  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() * (GAME_HEIGHT - 20)))
  }, 1000/LEVEL)
  scoreInterval = setInterval(function(){
    SCORE += 1
  }, 1000/LEVEL)

  bonusInterval = setInterval(function() {
    createBonus(Math.floor(Math.random() * (GAME_HEIGHT - 20)))
  }, 15000)

  bigInterval = setInterval(function(){
    clearInterval(gameInterval)
    gameInterval = setInterval(function() {
      createRock(Math.floor(Math.random() * (GAME_HEIGHT - 20)))
    }, 1000/LEVEL)
    clearInterval(scoreInterval)
    scoreInterval = setInterval(function(){
      SCORE += 1
    }, 1000/LEVEL)
  }, 10000)
  // gameInterval = setInterval(function() {
  //   createRock(Math.floor(Math.random() * (GAME_HEIGHT - 20)))
  // }, 1000)
  collisionInterval = setInterval(function(){checkArray(rockArray)}, 500)
  bonusCollisionInterval = setInterval(function(){checkBonusArray(bonusArray)}, 350)

  levelInterval = setInterval(function(){
    LEVEL += 0.1
  }, 5000)

 
}

// SHIP MOVEMENT_______________________________________
function moveShip(e) {
  const code = e.which

  if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].indexOf(code) > -1) {
    e.preventDefault()
    e.stopPropagation()
  }

  if (code === LEFT_ARROW) {
    moveShipLeft()
  } else if (code === RIGHT_ARROW) {
    moveShipRight()
  } else if (code === UP_ARROW) {
    moveShipUp()
  } else if (code === DOWN_ARROW) {
    moveShipDown()
  }
}

function moveShipLeft(){
  window.requestAnimationFrame(function() {
    const left = positionToInteger(ship.style.left)

    if (left > -20) {
      ship.style.left = `${left - 10}px`;
    }
  })
}

function moveShipRight(){
  // console.log("Right")
  window.requestAnimationFrame(function() {
    const left = positionToInteger(ship.style.left)
    if (left < 730) {
      ship.style.left = `${left + 10}px`;
    }
  })
}

function moveShipDown(){
  // console.log("Down")
  window.requestAnimationFrame(function() {
    const top = positionToInteger(ship.style.top)

    if (top < 350) {
      ship.style.top = `${top + 10}px`;
    }
  })
}
function moveShipUp(){
  // console.log("Up")
  window.requestAnimationFrame(function() {
    const top = positionToInteger(ship.style.top)

    if (top > 0) {
      ship.style.top = `${top - 10}px`;
    }
  })
}


function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}
// _________________________________________________________


// Creating ROCKS___________________________________________
function createRock(x) {
  const rock = document.createElement('div')
  rock.className = 'rock'
  rock.style.top = `${x}px`
  let width = rock.style.width = 20
  rock.style.width = `${width}`
  let height = rock.style.height = 20
  rock.style.height = `${height}`
  let left = rock.style.left = 800
  game.appendChild(rock)

  function moveRock() {
    rock.style.left = `${left -= LEVEL}px`;

// rock.addEventListener("click", (rock) => remove(rock) )
    // checkCollision(rock)


    if (left > -100) {
      window.requestAnimationFrame(moveRock)
    } else {
      rock.remove()
    }
  }

  window.requestAnimationFrame(moveRock)


  ROCKS += 1
  rockArray.push(rock)
  // return rock
}
function checkArray(array){
  array.forEach(rock => checkCollision(rock))
}
function checkCollision(rock) {
    // console.log("Checking for collision")
    const shipLeftEdge = positionToInteger(ship.style.left)
    const shipRightEdge = shipLeftEdge + 50;
    const shipTopEdge = positionToInteger(ship.style.top)
    const shipBottomEdge = shipTopEdge + 50;
    const rockLeftEdge = positionToInteger(rock.style.left)
    const rockTopEdge = positionToInteger(rock.style.top)
    const rockRightEdge = rockLeftEdge + 20
    const rockBottomEdge = rockTopEdge + 20

    if (
      (rockLeftEdge >= shipLeftEdge && rockLeftEdge <= shipRightEdge && rockTopEdge <= shipBottomEdge && rockTopEdge >= shipTopEdge)||
      (rockRightEdge <= shipRightEdge && rockRightEdge >= shipLeftEdge && rockBottomEdge >= shipTopEdge && rockBottomEdge <= shipBottomEdge)||
      (rockLeftEdge >= shipLeftEdge && rockLeftEdge <= shipRightEdge && rockBottomEdge >= shipTopEdge && rockBottomEdge <= shipBottomEdge)||
      (rockRightEdge <= shipRightEdge && rockRightEdge >= shipLeftEdge && rockTopEdge <= shipBottomEdge && rockTopEdge >= shipTopEdge)
    ){
      endGame()
     }

}

function endGame(user){
  // console.log("GAME OVER")
  // console.log(SCORE)
  let showScore = document.createElement('div')
  showScore.class = "menu"
  showScore.innerText = `SCORE: ${SCORE * MULTIPLIER}`
  
  rightmenu.innerHTML = '<button id="game-over" type="button" name="game-over">Game Over</button>'
  rightmenu.appendChild(showScore)
  const gameOverButton = document.getElementById("game-over")
 
ship.style.visibility = "hidden"
 rockArray.forEach(rock => rock.remove())
 bonusArray.forEach(bonus => bonus.remove())

 rightmenu.style.visibility = "visible"
 
 rockArray = []
 bonusArray = []
 clearInterval(bigInterval)
 clearInterval(gameInterval)
 clearInterval(levelInterval)
 clearInterval(scoreInterval)
 clearInterval(collisionInterval)
 clearInterval(bonusInterval)
 clearInterval(bonusCollisionInterval)
 gameOverButton.style.visibility = "visible"
 
 

 gameOverButton.addEventListener("click", () => {
   leftmenu.style.visibility = "visible"
   gameOverButton.style.visibility = "hidden"
   fetch("http://localhost:3000/scores", {
             method: "POST",
             body: JSON.stringify({
               user_id: userID,
               score: SCORE * MULTIPLIER
             }),
             headers: {
               "Content-Type": "application/json"
             }
           }).then(res => res.json()).then(console.log)
 })

  //

}
// __________________________________________________

const scoreDisplay = document.querySelector('#score')

setInterval(function(){scoreDisplay.innerText = `Score: ${SCORE} x${MULTIPLIER}`}, 500)



function createBonus(x) {
  const bonus = document.createElement('div')
  bonus.className = 'bonus'
  bonus.style.top = `${x}px`
  let width = bonus.style.width = 20
  bonus.style.width = `${width}`
  let height = bonus.style.height = 20
  bonus.style.height = `${height}`
  let left = bonus.style.left = 800
  game.appendChild(bonus)

  function moveBonus() {
    bonus.style.left = `${left -= 3}px`;




    if (left > -100) {
      window.requestAnimationFrame(moveBonus)
    } else {
      bonus.remove()
    }
  }

  window.requestAnimationFrame(moveBonus)


 
  bonusArray.push(bonus)
  // return rock
}

function checkBonusArray(array){
  array.forEach(bonus => checkBonusCollision(bonus))
}

function checkBonusCollision(bonus) {
  // console.log("Checking for collision")
  const shipLeftEdge = positionToInteger(ship.style.left)
  const shipRightEdge = shipLeftEdge + 50;
  const shipTopEdge = positionToInteger(ship.style.top)
  const shipBottomEdge = shipTopEdge + 50;
  const bonusLeftEdge = positionToInteger(bonus.style.left)
  const bonusTopEdge = positionToInteger(bonus.style.top)
  const bonusRightEdge = bonusLeftEdge + 20
  const bonusBottomEdge = bonusTopEdge + 20

  if (
    (bonusLeftEdge >= shipLeftEdge && bonusLeftEdge <= shipRightEdge && bonusTopEdge <= shipBottomEdge && bonusTopEdge >= shipTopEdge)||
    (bonusRightEdge <= shipRightEdge && bonusRightEdge >= shipLeftEdge && bonusBottomEdge >= shipTopEdge && bonusBottomEdge <= shipBottomEdge)||
    (bonusLeftEdge >= shipLeftEdge && bonusLeftEdge <= shipRightEdge && bonusBottomEdge >= shipTopEdge && bonusBottomEdge <= shipBottomEdge)||
    (bonusRightEdge <= shipRightEdge && bonusRightEdge >= shipLeftEdge && bonusTopEdge <= shipBottomEdge && bonusTopEdge >= shipTopEdge)
  ){
    MULTIPLIER +=1
    bonus.remove()
   }

}