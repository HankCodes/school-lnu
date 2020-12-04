
import { popupTemp, gameHeaderTemp, textQuestionTemp, radioQuestionTemp, resultTemp, highScoreList, goPopup } from './templates.js'
import { popupStyle, gameHeaderStyle, textQuestionStyle, radioQuestionStyle, resultPageStyle } from './cssTemplates.js'

/**
 * Creates a DOM Element that recieves questions from the server and renders them in the browser.
 *
 * @class QuizElement
 * @extends {window.HTMLElement}
 */
class QuizElement extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.firstURL = ''
    this.highScoreArray = []

    this._userId = ''
    this.totalSeconds = 0
    this.totalTime = 0

    this.intervalID = 0
    this.meterIntervalID = 0
    this.startTime = 0
  }

  /**
   * Sets the attributes of the element.
   *
   * @readonly
   * @static
   * @memberof QuizElement
   */
  static get observedAttributes () {
    return ['url']
  }

  /**
   * Watches for changes in the attributes of the element.
   *
   * @param {*} name
   * @param {*} oldValue
   * @param {*} newValue
   * @memberof QuizElement
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'url') {
      this.firstURL = newValue
    }
  }

  /**
   * Function that is called every time the component renders on the site.
   *
   * @memberof QuizElement
   */
  connectedCallback () {
    this.renderQuizStart()
    this.makeLogInPopup()
  }

  /**
   * Creates a login popup window.
   *
   * @memberof QuizElement
   */
  makeLogInPopup () {
    const popup = popupTemp.content.cloneNode(true)
    this.setStyle(popupStyle)
    this.shadowRoot.appendChild(popup)
    this.userIdButton()
  }

  /**
   * Finds the button in the log-in pop up window and adds an eventlistener
   *
   * @memberof QuizElement
   */
  userIdButton () {
    const userIdButton = this.getElement('#userId-button')
    userIdButton.addEventListener('click', e => {
      e.preventDefault()
      this.userId = this.getElement('#userId-Field').value
      if (this.verifyUserId(this.userId)) {
        const popup = this.getElement('#popup-bg')
        popup.parentNode.removeChild(this.getElement('.popupStyle'))
        popup.parentNode.removeChild(popup)
        this.getElement('#insertName').textContent = this.userId
      } else {
        this.getElement('label').textContent = 'Username must be between 1 and 10 characters'
        this.getElement('label').style.color = 'red'
      }
    })
  }

  /**
   * Checks if the username is between 1-10 characters.
   *
   * @param {string} userID - The username entered by the user.
   * @returns - A boolean value.
   * @memberof QuizElement
   */
  verifyUserId (userID) {
    if (userID.length < 1 || userID.length > 10) {
      return false
    } else {
      return true
    }
  }

  /**
   * Checks if the answer is correct.
   *
   * @param {object} res - The response of the answer from the server.
   * @returns - A boolean value.
   * @memberof QuizElement
   */
  isRightOrWrong (res) {
    if (res.message === 'Wrong answer! :(') {
      return false
    } else {
      return true
    }
  }

  /**
   * Evaluates the answer and either continues with next question or ends the game.
   *
   * @param {object} res - The response of the answer from the server.
   * @memberof QuizElement
   */
  async verifyAnswer (res) {
    if (this.isRightOrWrong(res)) {
      if (!res.nextURL) {
        this.saveScore()
        this.renderHighScorePage()
      } else {
        this.updateRendering(await this.getQuestion(res.nextURL))
      }
    } else {
      this.gameOver()
    }
  }

  /**
   * Asyncronous function that gets a question from the server.
   *
   * @returns {object} - a JavaScript object containing the question and a URL.
   * @memberof QuizElement
   */
  async getQuestion (URL) {
    const pro = await window.fetch(URL)
    const res = await pro.json()
    return res
  }

  /**
   * Posts the answer to the server.
   *
   * @param {string} answer - The answer from the user.
   * @param {string} nextURL - The URL where the answer will be sent.
   * @returns - an JavaScript object containing the response from the server.
   * @memberof QuizElement
   */
  async postAnswer (answer, nextURL) {
    const data = {
      answer: answer
    }
    let res = ''

    res = await window.fetch(nextURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return res.json()
  }

  /**
   * Starts a timer that counts down from 20. Also saving the total time from first to last question.
   *
   * @memberof QuizElement
   */
  startTimer () {
    let seconds = 20
    const clock = this.getElement('#clock')
    clock.textContent = seconds
    this.getElement('#time-container').style.display = 'block'
    let val = 100

    window.clearInterval(this.intervalID)
    window.clearInterval(this.meterIntervalID)

    this.intervalID = window.setInterval(() => {
      this.totalSeconds++
      seconds--
      clock.textContent = seconds

      if (seconds === 0) {
        window.clearInterval(this.intervalID)
        window.clearInterval(this.meterIntervalID)
        this.gameOver()
      }
    }, 1000)

    const meter = this.getElement('#left')
    meter.style.backgroundColor = '#4CAF60'
    this.meterIntervalID = window.setInterval(e => {
      val = val - 0.25
      meter.style.width = `${val}%`
      if (val === 40) {
        meter.style.backgroundColor = 'red'
      }
    }, 50)
  }

  /**
   * Gets the answer from radio buttons.
   *
   * @param {array} inputArray - An array of radiobutton inputs.
   * @returns - A string containing the answer.
   * @memberof QuizElement
   */
  getRadioAnswer (inputArray) {
    let answer = ''
    inputArray.forEach((input) => {
      if (input.checked) {
        answer = input.value
      }
    })
    return answer
  }

  // Collection of render methods.

  /**
   * Updates the site layout according to the question recieved from the server.
   *
   * @param {object} question - An JavaScript object containing the question from the server.
   * @memberof QuizElement
   */
  async updateRendering (question) {
    const nextURL = question.nextURL

    if (!question.alternatives && nextURL) {
      this.renderTextQuestion(question)
      this.startTimer()
      const textButton = this.getElement('#textButton')

      textButton.addEventListener('click', async e => {
        e.preventDefault()
        const userAnswer = this.getElement('#questionField').value
        const res = await this.postAnswer(userAnswer, nextURL)
        await this.verifyAnswer(res)
      })
    } else if (question.alternatives && nextURL) {
      const alternatives = question.alternatives
      const inputArray = this.renderRadioButtons(question, alternatives)
      this.startTimer()
      const button = this.getElement('#radioButton')

      button.addEventListener('click', async e => {
        e.preventDefault()
        const userAnswer = this.getRadioAnswer(inputArray)
        const res = await this.postAnswer(userAnswer, nextURL)
        await this.verifyAnswer(res)
      })
    }
  }

  /**
   * Renders the display of a text question.
   *
   * @param {object} question - An object containing the question from the server.
   * @memberof QuizElement
   */
  renderTextQuestion (question) {
    this.replaceElement(textQuestionTemp, '#game-header', true)
    this.setStyle(textQuestionStyle, '#radioQuestionStyle')
    this.getElement('#question').textContent = question.question
  }

  /**
  * Renders the question form to radiobuttons.
  *
  * @param {object} alternatives - A object containing the question from the server.
  * @returns - An array of input elements.
  * @memberof QuizElement
  */
  renderRadioButtons (question, alternatives) {
    const inputArray = []
    this.replaceElement(radioQuestionTemp, '#game-header', true)
    this.setStyle(radioQuestionStyle, '#textQuestionStyle', '#radioQuestionStyle')

    const form = this.getElement('#radioQuestion')
    const formButton = this.getElement('#radioButton')
    this.getElement('#question').textContent = question.question

    for (const alt in alternatives) {
      const div = document.createElement('div')
      const label = document.createElement('label')
      label.classList.add('labelradio')
      label.textContent = alternatives[alt]
      label.setAttribute('for', alt)

      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.id = alt
      radio.value = alt
      radio.name = 'alt'

      div.appendChild(radio)
      div.appendChild(label)

      // form.insertBefore(label, formButton)
      form.insertBefore(div, formButton)
      inputArray.push(radio)
    }
    return inputArray
  }

  /**
   * Renders the introduction page to the quiz.
   *
   * @memberof QuizElement
   */
  renderQuizStart () {
    this.shadowRoot.innerHTML = ''
    const start = gameHeaderTemp.content.cloneNode(true)
    this.shadowRoot.appendChild(start)
    this.shadowRoot.querySelector('#insertName').textContent = this.userId
    this.setStyle(gameHeaderStyle)
    this.onStartQuiz()
  }

  /**
   * Adds an eventlistener on the startpage button.
   *
   * @memberof QuizElement
   */
  onStartQuiz () {
    const button = this.getElement('#start-button')
    button.addEventListener('click', async (e) => {
      e.preventDefault()
      this.totalSeconds = 0
      const question = await this.getQuestion(this.firstURL)
      await this.updateRendering(question)
      this.getElement('#headerH1').textContent = 'Game on'
      this.startTime = Date.now()
    })
  }

  /**
   * Renders the highscore page.
   *
   * @memberof QuizElement
   */
  renderHighScorePage () {
    window.clearInterval(this.intervalID)
    window.clearInterval(this.meterIntervalID)
    this.replaceElement(resultTemp, '#game-header')
    this.setStyle(resultPageStyle)
    this.getElement('#insertName').textContent = this.userId
    this.getElement('#total-time').textContent = this.totalTime
    this.renderHighScore()

    const restartButton = this.getElement('#start-button')
    restartButton.addEventListener('click', e => {
      e.preventDefault()
      this.renderQuizStart()
      this.onStartQuiz()
    })
  }

  /**
   * Renders the highscore list.
   *
   * @memberof QuizElement
   */
  renderHighScore () {
    const storage = JSON.parse(window.localStorage.getItem('highscore'))

    const sortedStorage = storage.sort((a, b) => {
      return a.time - b.time
    })

    const top5 = sortedStorage.splice(0, 5)

    top5.forEach(user => {
      const li = highScoreList.content.cloneNode(true)
      li.querySelector('.highscore-name').textContent = user.name
      li.querySelector('.highscore-time').textContent = `${user.time}s`
      this.getElement('#highscore-list').appendChild(li)
    })
  }

  /**
   * Stores the score in the browsers local storage
   *
   * @memberof QuizElement
   */
  saveScore () {
    const stopTime = Date.now()
    this.totalTime = (stopTime - this.startTime) / 1000
    this.totalTime = this.totalTime.toFixed(2)

    const storage = window.localStorage
    const results = {
      name: this.userId,
      time: this.totalTime
    }

    const saveScores = storage.getItem('highscore') || '[]'
    const highScores = [...JSON.parse(saveScores), results]
    storage.setItem('highscore', JSON.stringify(highScores))
  }

  /**
  * Creates a popup window if the user gives wrong answer.
  *
  * @memberof QuizElement
  */
  createGameOverPopup () {
    const popup = goPopup.content.cloneNode(true)
    this.shadowRoot.appendChild(popup)
    this.setStyle(popupStyle)
  }

  /**
   * Tells the user that the game is over and restarts the game when button clicked.
   *
   * @memberof QuizElement
   */
  gameOver () {
    this.createGameOverPopup()
    window.clearInterval(this.intervalID)
    window.clearInterval(this.meterIntervalID)

    const button = this.getElement('#restart-button')
    button.addEventListener('click', e => {
      e.preventDefault()
      this.renderQuizStart()
      this.onStartQuiz()
    })
  }

  // Collection of helpfunctions

  /**
   *Gets an element from the shadowroot
   *
   * @param {string} element - The element you want to find
   * @returns - The chosen element
   * @memberof QuizElement
   */
  getElement (element) {
    return this.shadowRoot.querySelector(element)
  }

  /**
   * Inserts or replace style-elements.
   *
   * @param {*} newStyle - Sets the new style.
   * @param {*} oldStyle - Current style that will be replaced by newStyle.
   * @param {*} evaluateStyle - An element-id to evaluate if newStyle is already set.
   * @memberof QuizElement
   */
  setStyle (newStyle, oldStyle, evaluateStyle) {
    if (newStyle && oldStyle && this.getElement(oldStyle)) {
      const style = newStyle.content.cloneNode(true)
      this.getElement(oldStyle).replaceWith(style)
    } else if (!this.getElement(evaluateStyle)) {
      const style = newStyle.content.cloneNode(true)
      this.shadowRoot.appendChild(style)
    }
  }

  /**
   * Takes a template and replace the chosen element.
   *
   * @param {Variable} newTemp - New template.
   * @param {String} oldEl - Element to replace
   * @param {Boolean} lastChild - If the element to replace is the last child or not.
   * @memberof QuizElement
   */
  replaceElement (newTemp, oldEl, lastChild) {
    if (lastChild) {
      const temp = newTemp.content.cloneNode(true)
      const replaceDiv = this.getElement(oldEl).lastElementChild
      replaceDiv.replaceWith(temp)
    } else {
      this.shadowRoot.innerHTML = ''
      const temp = newTemp.content.cloneNode(true)
      this.shadowRoot.appendChild(temp)
    }
  }
}

window.customElements.define('quiz-element', QuizElement)

export { QuizElement }
