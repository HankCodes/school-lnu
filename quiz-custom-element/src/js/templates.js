
// Template for login popup window.
const popupTemp = document.createElement('template')
popupTemp.innerHTML = `
<div id="popup-bg">
  <div id="popup-window">
    <h1 id="popup-header">Username</h1>
    <form id="popup-Form">
    <label for="user-id" class="hvr-wobble-horizontal">Enter username</label>
      <input type="text" id="userId-Field" name="user-id" placeholder="Username">
      <input type="submit" id="userId-button" value="Submit" class="button">
    </form>
  </div>
</div>`

// Template for game over popup window.
const goPopup = document.createElement('template')
goPopup.innerHTML = `
<div id="popup-bg">
  <div id="popup-window">
    <h1 id="popup-header">Dang Nabbit...</h1>
    <p>Either the time went out or the wrong answer were submitted. <br>
      Make another try by clicking the button below</p>
      <button type="button" id="restart-button" class="button">Try again!</button>

  </div>
</div>`

// Template for the game
const gameHeaderTemp = document.createElement('template')
gameHeaderTemp.innerHTML = `
<div id="game-header">
<div id ="header">
  <h1 id="headerH1">Hello </h1> 
  <div id="insertName">Anv</div>
  </div>
  <div id="time-container">
    <div id="clock"></div>
      <div id="time-meter">
      <div id="left"></div>
    <div id="right"></div>
  </div>
</div>
<!-- Div to replace with formtags for the questions -->
<div id="game-rules">
<p>Answer all the questions in the shortest time possible. <br>
    If a faulty answer is given the quiz will start over.
    You have 20 seconds to answer each question.</p>
    <button type="button" id="start-button" class="button">Start quiz</button>
  </div>
`

// Template for text questions.
const textQuestionTemp = document.createElement('template')
textQuestionTemp.innerHTML = `
  <form id="textQuestion">
      <label for="question" id="question">Question</label>
      <input type="text" id="questionField" name="question" placeholder="Your answer">
      <input type="submit" id="textButton" value="Next" class="button">
  </form>
  `

// Template for radio-button questions.
const radioQuestionTemp = document.createElement('template')
radioQuestionTemp.innerHTML = `
  <form id="radioQuestion">
      <p id="question"></p>

      <input type="submit" id="radioButton" value="Next" class="button">
  </form>
`

// Template for displaying the results.
const resultTemp = document.createElement('template')
resultTemp.innerHTML = `
<div id="highscore-container">
  <div id="highscore-header">
  <h1>Congratulations <span id="insertName">Anv</span> you made it!</h1>
  <p>In <span id="total-time">-</span> seconds</p>
  </div>
  <div id="display-highscore">
  <h2>HIGHSCORE</h2>
  <div id="score-container">
    <p>Name:</p><p>Time:</p>
    <ul id="highscore-list">
      </ul>

    </div>
    <button type="button" id="start-button" class="button">Do it again!</button>
  </div>
</div>
`

const highScoreList = document.createElement('template')
highScoreList.innerHTML = `
<li class="list"><span class="highscore-name"></span><span class="highscore-time"></span></li>
`
export {
  popupTemp,
  gameHeaderTemp,
  textQuestionTemp,
  radioQuestionTemp,
  resultTemp,
  highScoreList,
  goPopup
}
