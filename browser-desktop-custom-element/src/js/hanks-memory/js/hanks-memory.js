import { globalStyle, memoryGameTemp, indexTemp, winTemp } from './hanksMemoryTemplates.js'

/**
 * A class representing the Hanks-memory custom-element.
 *
 * @extends window.HTMLElement
 */
export default class HanksMemory extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.cols = null
    this.rows = null
    this.totalTime = null
    this.startTime = null
    this.setIntervalId = null

    this.totalClicks = 0
    this.matches = 0
    this.flipped = []
    this.seconds = 0
    this.win = false
  }

  /**
   * A function that runs every time the custom-element renders on the page.
   * @memberof HanksMemory
   */
  connectedCallback () {
    this.renderIndex()
  }

  /**
   * A function that runs when the custom-element is deleted from the page or the browser closes or change page.
   * @memberof HanksMemory
   */
  disconnectedCallback () {
    this.resetGameData()
    this.clearShadowRoot()
  }

  /**
   * Renders the first (index) page on the game.
   * @memberof HanksMemory
   */
  renderIndex () {
    clearInterval(this.setIntervalId)
    this.clearShadowRoot()
    this.shadowRoot.appendChild(indexTemp.content.cloneNode(true))
    this.getElement('#sizes').addEventListener('click', e => {
      e.preventDefault()
      if (e.target.id !== 'sizes') {
        this.getSize(e.target.id)
        this.runGame()
      }
    })
  }

  /**
   * Gets the number of columns and rows that will be represented in the game.
   *
   * @param {string} id - The id of the chosen element, the id will contain chosen number of columns and rows.
   * @memberof HanksMemory
   */
  getSize (id) {
    this.cols = +id.charAt(0)
    this.rows = +id.charAt(1)
  }

  /**
   * Renders the Hank's memory's gameboard.
   *
   * @memberof HanksMemory
   */
  runGame () {
    this.clearShadowRoot()
    this.shadowRoot.appendChild(globalStyle.content.cloneNode(true))
    this.shadowRoot.appendChild(memoryGameTemp.content.cloneNode(true))

    this.bindFunctions()
    this.addEventHandlers()
    this.gameSetup(this.cols, this.rows)
  }

  /**
   * Adds eventlisterners that will be active after runGame().
   *
   * @memberof HanksMemory
   */
  addEventHandlers () {
    this.getElement('#startButton').addEventListener('click', this.boundStartReset)
    this.getElement('#sizeButton').addEventListener('click', this.boundRenderIndex)
    this.addEventListener('hanks-memory-win', this.boundRenderWinPage)
  }

  /**
   * Binds this to functions and declares new variables for each function.
   *
   * @memberof HanksMemory
   */
  bindFunctions () {
    this.boundStartReset = this.startReset.bind(this)
    this.boundRenderIndex = this.renderIndex.bind(this)
    this.boundRenderWinPage = this.renderWinPage.bind(this)
  }

  /**
   * Render the last page of the game with the total time displayed.
   *
   * @memberof HanksMemory
   */
  renderWinPage () {
    this.win = true
    clearInterval(this.setIntervalId)
    this.totalTime = this.getTotalTime()

    this.clearShadowRoot()
    this.shadowRoot.appendChild(globalStyle.content.cloneNode(true))
    this.shadowRoot.appendChild(winTemp.content.cloneNode(true))

    this.getElement('#totalClicks').textContent = this.totalClicks
    this.getElement('#showTotalTime').textContent = `${this.totalTime} seconds`

    this.getElement('#startButton').addEventListener('click', this.boundStartReset)
    this.getElement('#sizeButton').addEventListener('click', this.boundRenderIndex)
  }

  /**
   * Starts the timer that will count how many seconds it takes to finnish the game.
   *
   * @memberof HanksMemory
   */
  startTimer () {
    this.getElement('#clock').textContent = '0'
    this.startTime = Date.now()
    this.setIntervalId = setInterval(() => {
      this.seconds++
      this.getElement('#clock').textContent = this.seconds
    }, 1000)
  }

  /**
   * Calculates the total time it took to finish the game.
   *
   * @returns {number} - Representing the total time.
   * @memberof HanksMemory
   */
  getTotalTime () {
    return ((Date.now() - this.startTime) / 1000).toFixed(2)
  }

  /**
   * Gives focus to the element by id. Catches an error if element does not exist.
   *
   * @param {string} id - Wich element whom will gain focus.
   * @memberof HanksMemory
   */
  giveFocus (id) {
    if (id >= 0 && id < this.cols * this.rows) {
      this.shadowRoot.getElementById(id).focus()
    }
  }

  /**
   * Starts or resets the game.
   *
   * @memberof HanksMemory
   */
  startReset () {
    const button = this.getElement('#startButton')
    this.totalClicks = 0
    this.matches = 0

    if (button.textContent === 'START') {
      button.textContent = 'RESTART'
      this.win = false
      this.startTimer()
      this.getElement('#brick-section').addEventListener('click', this.toggleAside.bind(this))
      this.getElement('#brick-section').addEventListener('keydown', this.arrowKeys.bind(this))
    } else {
      clearInterval(this.setIntervalId)
      this.resetGameData()
      this.runGame()
    }
  }

  /**
   * Resets game data.
   *
   * @memberof HanksMemory
   */
  resetGameData () {
    this.totalTime = null
    this.startTime = null
    this.totalClicks = 0
    this.turn1 = null
    this.turn2 = null
    this.flipped = []
    this.seconds = 0
    this.win = false
    this.setIntervalId = null
  }

  /**
   * Making it possible to move trough the gameboard with arrowkeys.
   *
   * @param {Obect} e - The event that invoked the function.
   * @memberof HanksMemory
   */
  arrowKeys (e) {
    e.preventDefault()
    switch (e.which) {
      case 38:
        this.giveFocus(+e.target.id - this.cols)
        break
      case 40:
        this.giveFocus(+e.target.id + this.cols)
        break
      case 37:
        this.giveFocus(+e.target.id - 1)
        break
      case 39:
        this.giveFocus(+e.target.id + 1)
        break
      case 13:
        this.toggleAside(e.target.children[1])
    }
  }

  /**
   * Returns the clicked element.
   *
   * @param {object} e - An event-object.
   * @returns - The element that was clicked.
   * @memberof HanksMemory
   */
  getTarget (e) {
    if (e.src) {
      return e
    } else if (e.target.src) {
      return e.target
    }
  }

  /**
   *  Flipps the cards.
   *
   * @param {object} e - An event-object.
   * @memberof HanksMemory
   */
  toggleAside (e) {
    const target = this.getTarget(e)
    const targetSiblings = target.parentNode.children
    this.totalClicks++

    if (!target.classList.contains('right')) {
      if (!this.turn1) {
        this.toggleClass(targetSiblings, 'aside')
        this.turn1 = target.parentNode.id
        this.saveFlippedCards(target)
      } else if (!this.turn2 && this.turn1 !== target.parentNode.id) {
        this.turn2 = target.parentNode.id
        this.toggleClass(targetSiblings, 'aside')
        this.saveFlippedCards(target)
      }
    }
  }

  /**
   *  Saves the curren two chosen cards in an array.
   *
   * @param {DOMElement} target - The chosen card to check.
   * @memberof HanksMemory
   */
  saveFlippedCards (target) {
    const imgsTags = target.parentNode.children

    for (let i = 0; i < imgsTags.length; i++) {
      if (!imgsTags[i].src.includes('0.png')) {
        const card = {
          img: imgsTags[i],
          src: imgsTags[i].src,
          parent: target.parentNode
        }

        if (this.flipped.length === 0 || this.flipped.length < 2 || this.flipped[0].parent.id !== card.parent.id) {
          this.flipped.push(card)
        }
      }
    }

    if (this.flipped.length === 2) {
      this.checkForMatch(this.flipped)
    }
  }

  /**
   * Checks if the two chosen cards is a match.
   *
   * @param {array} cards - An array of two cards.
   * @memberof HanksMemory
   */
  checkForMatch (cards) {
    if (cards[0].src === cards[1].src) {
      cards.forEach(card => {
        this.toggleClass(card.parent.children, 'right')
        this.matches += 1
        this.turn1 = null
        this.turn2 = null
      })
      this.checkAll()
    } else {
      setTimeout(e => {
        cards.forEach(card => {
          this.toggleClass(card.parent.children, 'aside')
          this.turn1 = null
          this.turn2 = null
        })
      }, 1000)
    }
    this.flipped = []
  }

  /**
   * Toggles the given class for all containing elements in the given array.
   *
   * @param {array} cards - An array of elements
   * @param {string} theClass - The class that will be toggled
   * @memberof HanksMemory
   */
  toggleClass (cards, theClass) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].classList.toggle(theClass)
    }
  }

  /**
   * Checks wether all cards has been matched and the game is finished.
   * Dispatches a custom-event if true.
   *
   * @memberof HanksMemory
   */
  checkAll () {
    if (this.matches >= this.cols * this.rows) {
      this.dispatchEvent(new window.CustomEvent('hanks-memory-win', { detail: 'win' }))
    }
  }

  /**
   * Gets data for columns and rows and sets up the game accordingly.
   *
   * @param {number} cols - Number of columns.
   * @param {number} rows - Number of rows.
   * @memberof HanksMemory
   */
  gameSetup (cols, rows) {
    const cards = this.getCards(cols, rows)
    this.createCardContainers(cards)
    this.setGrid()
  }

  /**
   * Gets the number of cards for the game.
   *
   * @param {number} cols - Number of columns.
   * @param {number} rows - Number of rows.
   * @returns {array} - An array of numbers that represents the cards.
   * @memberof HanksMemory
   */
  getCards (cols, rows) {
    const size = (cols * rows) / 2
    const cards = []
    for (let i = 1; i < size + 1; i++) {
      cards.push(...[i, i])
    }
    return this.shuffle(cards)
  }

  /**
   * Fisher-Yates shuffle.
   *
   * @memberof HanksMemory
   */
  shuffle (cards) {
    let currentIndex = cards.length
    let tempValue = ''
    let randomIndex = ''

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      tempValue = cards[currentIndex]
      cards[currentIndex] = cards[randomIndex]
      cards[randomIndex] = tempValue
    }
    return cards
  }

  /**
   * Sets columns and rows for the game.
   *
   * @memberof HanksMemory
   */
  setGrid () {
    this.getElement('#brick-section').style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`
    this.getElement('#brick-section').style.gridTemplateRows = `repeat(${this.rows}, 1fr)`
  }

  /**
   * Creates elements for all the cards and appends them to the gameboard.
   *
   * @param {array} cards - An array of names of the cards that will be included.
   * @memberof HanksMemory
   */
  createCardContainers (cards) {
    cards.forEach((card, i) => {
      const div = document.createElement('div')
      div.id = i
      div.setAttribute('tabindex', i + 1)

      const img = document.createElement('img')
      img.src = `js/hanks-memory/image/${card}.png`
      img.classList.add('aside')

      const imgBack = document.createElement('img')
      imgBack.src = 'js/hanks-memory/image/0.png'

      div.appendChild(img)
      div.appendChild(imgBack)

      this.getElement('#brick-section').appendChild(div)
    })
  }

  /**
   * Clears all existing elements in the shadowroot.
   *
   * @memberof HanksMemory
   */
  clearShadowRoot () {
    for (let i = 0; i < this.shadowRoot.children.length; i++) {
      this.shadowRoot.children[i].remove()
      i--
    }
  }

  /**
   * Finds elements in the shadowroot.
   *
   * @param {string} el - The element that will be located.
   * @returns - The chose element.
   * @memberof HanksMemory
   */
  getElement (el) {
    return this.shadowRoot.querySelector(el)
  }
}

window.customElements.define('hanks-memory', HanksMemory)
