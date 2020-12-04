import { mainStyleTemp, setSizePageTemp, gameBoardTemp, endPageTemp } from './hanksMinesweeperTemplates.js'
/**
 * A class representing the <hanks-minesweeper> custom element.
 *
 * @export
 * @class HanksMinesweeper
 * @extends {window.HTMLElement}
 */
export default class HanksMinesweeper extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.cols = null
    this.rows = null
    this.size = this.cols * this.rows
    this.bricks = []
    this.gameHandlerOnClick = null
    this.numOfMines = 0

    this.setIntervalId = null
    this.seconds = 0
    this.minutes = 0
    this.totalTime = null
    this.startTime = null
    this.gameStarted = false
  }

  /**
     * A function that runs every time the custom-element renders on the page.
     * @memberof HanksMinesweeper
     */
  connectedCallback () {
    this.renderSizePage()
    // this.renderLastPage()
  }

  /**
     * A function that runs when the custom-element is deleted from the page or the browser closes or change page.
     * @memberof HanksMinesweeper
     */
  disconnectedCallback () {
    // Good practice to use?
  }

  /**
   * Clears the shadowroot and renders the page for
   * setting the size of the gameboard.
   *
   * @memberof HanksMinesweeper
   */
  renderSizePage () {
    this.clearShadowRoot()
    this.resetGameboard()
    this.resetGamedata()
    this.shadowRoot.appendChild(mainStyleTemp.content.cloneNode(true))
    this.shadowRoot.appendChild(setSizePageTemp.content.cloneNode(true))

    this.getElement('#sizes').addEventListener('click', this.logInButtonHandler.bind(this))
  }

  /**
   * Clears the shadowroot and appends the gameboard with eventlisternes on the buttons.
   *
   * @memberof HanksMinesweeper
   */
  renderGameBoardPage () {
    this.clearShadowRoot()
    this.shadowRoot.appendChild(mainStyleTemp.content.cloneNode(true))
    this.shadowRoot.appendChild(gameBoardTemp.content.cloneNode(true))
    this.getElement('h1').textContent = 'Mines: ' + this.numOfMines

    this.getElement('#reset').addEventListener('click', this.newTurn.bind(this))
    this.getElement('#size').addEventListener('click', this.renderSizePage.bind(this))
  }

  /**
   * Renders the winnerpage.
   *
   * @memberof HanksMinesweeper
   */
  renderWinnerPage () {
    this.clearShadowRoot()
    this.shadowRoot.appendChild(mainStyleTemp.content.cloneNode(true))
    this.shadowRoot.appendChild(endPageTemp.content.cloneNode(true))
    this.getElement('#clock').textContent = this.totalTime
    this.getElement('#size').addEventListener('click', this.renderSizePage.bind(this))
  }

  /**
   * Resets gameboard-related parameters in the constructor.
   *
   * @memberof HanksMinesweeper
   */
  resetGameboard () {
    clearInterval(this.setIntervalId)
    this.cols = null
    this.rows = null
    this.size = this.cols * this.rows
    this.bricks = []
    this.gameHandlerOnClick = null
  }

  /**
   * Resets time-related parameters in the constructor.
   *
   * @memberof HanksMinesweeper
   */
  resetGamedata () {
    clearInterval(this.setIntervalId)
    this.setIntervalId = null
    this.seconds = 0
    this.minutes = 0
    this.totalTime = null
    this.startTime = null
    this.gameStarted = false
  }

  /**
 * Resets the game for a new turn
 *
 * @param {*} e
 * @memberof HanksMinesweeper
 */
  newTurn (e) {
    this.resetGamedata()
    this.bricks = this.getBricks2D(this.cols, this.rows)
    this.setNumberOfMines(this.bricks)
    this.runGame()
  }

  /**
   * Handles the functions triggered by login button.
   *
   * @param {object} e - The event-object that comes from the click-event.
   * @memberof HanksMinesweeper
   */
  logInButtonHandler (e) {
    this.getColsAndRows(e.target.value)
    this.bricks = this.getBricks2D(this.cols, this.rows)
    this.setNumberOfMines(this.bricks)
    this.runGame()
  }

  /**
   * Runs the game.
   *
   * @memberof HanksMinesweeper
   */
  runGame () {
    this.renderGameBoardPage()
    this.setGrid()
    this.appendGameBoardDivs(this.cols, this.rows)
    this.gameHandlerOnClick = this.gameHandler.bind(this)
    this.getElement('#gameBoard').addEventListener('click', this.gameHandlerOnClick)
    this.getElement('#gameBoard').addEventListener('contextmenu', this.flagBrick.bind(this))
  }

  /**
   * Makes it possible to flag potential mines.
   *
   * @param {event} e - An event captured by an event listener.
   * @memberof HanksMinesweeper
   */
  flagBrick (e) {
    e.preventDefault()
    e.target.classList.toggle('flagged')
  }

  /**
   * Handles the structure of the gamelogic
   *
   * @param {*} e
   * @memberof HanksMinesweeper
   */
  gameHandler (e) {
    if (!this.gameStarted) {
      this.startTimer()
      this.gameStarted = true
    }
    const brickId = this.getIdNumber(e.target.id)

    if (this.isMine(brickId)) {
      this.getAllMines(true)
      this.ifLoose()
    } else {
      this.searchNeighbors(brickId)
    }
  }

  /**
   * Changes the backgroundcolor and removes the ability to click any bricks
   *
   * @memberof HanksMinesweeper
   */
  ifLoose () {
    this.getElement('#gameBoard').removeEventListener('click', this.gameHandlerOnClick)
    this.getElement('#gameBoardBg').style.transition = 'background-color 5s ease-out'
    this.getElement('#gameBoardBg').style.backgroundColor = '#D13F3F'
  }

  /**
   * Changes the backgroundcolor and prepares the winpage in a timeout of 3s
   *
   * @memberof HanksMinesweeper
   */
  ifWin () {
    clearInterval(this.setIntervalId)
    this.totalTime = this.getTotalTime()
    this.getElement('#gameBoardBg').style.transition = 'background-color 3s ease-out'
    this.getElement('#gameBoardBg').style.backgroundColor = 'green'
    setTimeout(this.renderWinnerPage.bind(this), 3000)
  }

  /**
   * Searches through the specific brick's neighbors.
   * If the neighbouring brick does not have any nearby mines the function will
   * call itself.
   *
   * @param {number} brickId - The id of the brick.
   * @memberof HanksMinesweeper
   */
  searchNeighbors (brickId) {
    if (this.checkForWin()) {
      const neighbors = this.getNeighbors(brickId)
      const mines = this.getNeighborsMines(neighbors)
      this.getElement(`#brick${brickId}`).textContent = mines
      this.ifWin()
    }

    const brick = this.getBrickById(brickId)
    brick.flipped = true
    const neighbours = this.getNeighbors(brickId)

    const mines = this.getNeighborsMines(neighbours)
    if (mines > 0) {
      this.getElement(`#brick${brickId}`).textContent = mines
    }

    if (mines === 0) {
      this.getElement(`#brick${brickId}`).classList.add('flipped')
      neighbours.forEach(brick => {
        if (!brick.flipped) {
          this.searchNeighbors(brick.id)
        }
      })
    }
    return mines
  }

  /**
   * Checks if all bricks with non mines has been clicked.
   *
   * @returns - True if all bricks that is not mines is clicked, false if not.
   * @memberof HanksMinesweeper
   */
  checkForWin () {
    let flipped = 0
    const mines = this.getAllMines(false)
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (!this.bricks[i][j].mine && this.bricks[i][j].flipped) {
          flipped++
        }
      }
    }
    if ((mines.length + flipped + 1) === (this.rows * this.cols)) {
      return true
    } else {
      return false
    }
  }

  /**
   * Locates the specified brick by it's id.
   *
   * @param {number} brickId - The id for the brick to find.
   * @returns - An object representing the brick.
   * @memberof HanksMinesweeper
   */
  getBrickById (brickId) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.bricks[i][j].id === brickId) {
          return this.bricks[i][j]
        }
      }
    }
  }

  /**
   * gets the number of mines in the array.
   *
   * @param {*} neighbors - An array containing the neighbours of the clicked brick.
   * @returns - The number of mines.
   * @memberof HanksMinesweeper
   */
  getNeighborsMines (neighbors) {
    let mines = 0
    let mine = false
    neighbors.forEach(neighbour => {
      mine = this.isMine(neighbour.id)
      if (mine) {
        mines++
      }
    })
    return mines
  }

  /**
   * Checks if the specified brick is a mine.
   * Checks by id.
   *
   * @param {number} id - The id-number of the brick to check
   * @returns - True if it was a mine or false if not.
   * @memberof HanksMinesweeper
   */
  isMine (id) {
    let mine = false
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.bricks[i][j].id === id && this.bricks[i][j].mine) {
          mine = true
        }
      }
    }
    return mine
  }

  /**
   * Gets all the mines on the gameboard. If the parameter is set to true then
   * all mines will be revealed. If set to false an array containing all
   * the mines is returned.
   *
   * @param {boolean} revealed - A boolean value that determens if the mines should be revealed.
   * @returns - If parameter set to false, it will return an array of mines.
   * @memberof HanksMinesweeper
   */
  getAllMines (revealed) {
    const allMines = []
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.bricks[i][j].mine) {
          if (revealed) {
            clearInterval(this.setIntervalId)
            this.getElement(`#brick${this.bricks[i][j].id}`).classList.add('mine')
          } else {
            allMines.push(this.bricks[i][j])
          }
        }
      }
    }
    return allMines
  }

  /**
 * Creates an array containing all the nearest neighbours to the specified brick.
 *
 * @param {number} id - The id of the brick to collect neighbours for.
 * @returns - An array of brick-objects.
 * @memberof HanksMinesweeper
 */
  getNeighbors (id) {
    const neighbors = []
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (this.bricks[i][j].id === id) {
          if (this.bricks[i - 1] !== undefined && this.bricks[i - 1][j - 1] !== undefined) {
            neighbors.push(this.bricks[i - 1][j - 1])
          }

          if (this.bricks[i - 1] !== undefined && this.bricks[i - 1][j] !== undefined) {
            neighbors.push(this.bricks[i - 1][j])
          }

          if (this.bricks[i - 1] !== undefined && this.bricks[i - 1][j + 1] !== undefined) {
            neighbors.push(this.bricks[i - 1][j + 1])
          }

          if (this.bricks[i] !== undefined && this.bricks[i][j - 1] !== undefined) {
            neighbors.push(this.bricks[i][j - 1])
          }

          if (this.bricks[i] !== undefined && this.bricks[i][j + 1] !== undefined) {
            neighbors.push(this.bricks[i][j + 1])
          }

          if (this.bricks[i + 1] !== undefined && this.bricks[i + 1][j - 1] !== undefined) {
            neighbors.push(this.bricks[i + 1][j - 1])
          }

          if (this.bricks[i + 1] !== undefined && this.bricks[i + 1][j] !== undefined) {
            neighbors.push(this.bricks[i + 1][j])
          }

          if (this.bricks[i + 1] !== undefined && this.bricks[i + 1][j + 1] !== undefined) {
            neighbors.push(this.bricks[i + 1][j + 1])
          }
        }
      }
    }
    return neighbors
  }

  /**
   * Gets the number in the id of the elements.
   *
   * @param {string} id - A string representing the id of an element
   * @returns - a number representing an id of the element and a index in this.bricks
   * @memberof HanksMinesweeper
   */
  getIdNumber (id) {
    const regExp = /(\d+)/
    const match = regExp.exec(id)
    return +match[1]
  }

  /**
   * Gets and sets the number of columns and rows for the game board.
   * Updates this.cols and this.rows with the chosen values by the player.
   *
   * @param {string} str A string of both numbers and letters (ex: '3x3' or '12x12').
   * @memberof HanksMinesweeper
   */
  getColsAndRows (str) {
    const regExp = /(\d+)\w(\d+)/
    const match = regExp.exec(str)
    this.cols = +match[1]
    this.rows = +match[2]
  }

  /**
   * Sets columns and rows for the game.
   *
   * @memberof HanksMemory
   */
  setGrid () {
    this.getElement('#gameBoard').style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`
    this.getElement('#gameBoard').style.gridTemplateRows = `repeat(${this.rows}, 1fr)`
    this.getElement('#gameBoard').style.width = `${(this.cols * 30)}px`
    this.getElement('#gameBoard').style.height = `${(this.rows * 30)}px`
  }

  /**
   * Sets the number of divs for the gameboard and appends them to the board.
   *
   * @param {number} cols - Number of columns.
   * @param {number} rows - Number of rows.
   * @memberof HanksMinesweeper
   */
  appendGameBoardDivs (cols, rows) {
    const size = cols * rows
    for (let i = 0; i < size; i++) {
      const div = document.createElement('div')
      div.id = `brick${i}`
      div.classList.add('hidden')
      this.getElement('#gameBoard').appendChild(div)
    }
  }

  /**
   * gets and 2D array that will represent the game board.
   *
   * @param {number} cols - Number of columns in the array.
   * @param {number} rows - Number of rows in the array.
   * @returns
   * @memberof HanksMinesweeper
   */
  getBricks2D (cols, rows) {
    const bricks = []
    let intForId = -1

    for (let i = 0; i < cols; i++) {
      const brickRows = []
      for (let j = 0; j < rows; j++) {
        intForId++
        const brick = this.createBrick(intForId)
        brickRows.push(brick)
      }
      bricks.push(brickRows)
    }
    return bricks
  }

  /**
   * Determine how many mines there will be in the game based on gameboard
   * size and spreads them randomly across the board.
   *
   * @memberof HanksMinesweeper
   */
  setNumberOfMines () {
    this.numOfMines = Math.floor((this.cols * this.rows) / 4)
    const uniqueNumbers = []

    while (uniqueNumbers.length < this.numOfMines) {
      const randomInt = Math.floor(Math.random() * (this.cols * this.rows))
      if (uniqueNumbers.indexOf(randomInt) === -1) {
        uniqueNumbers.push(randomInt)
      }
    }

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        uniqueNumbers.forEach((number) => {
          if (number === this.bricks[i][j].id) {
            this.bricks[i][j].mine = true
          }
        })
      }
    }
  }

  /**
 * Creates an object that will represent the state and id of a brick.
 *
 * @returns - An object containing the state of a brick.
 * @memberof HanksMinesweeper
 */
  createBrick (id) {
    return {
      id: id,
      flipped: false,
      mine: false,
      flagged: false
    }
  }

  /**
     * Clears all existing elements in the shadowroot.
     *
     * @memberof HanksMinesweeper
     */
  clearShadowRoot () {
    for (let i = 0; i < this.shadowRoot.children.length; i++) {
      this.shadowRoot.children[i].remove()
      i--
    }
  }

  /**
     * Starts the timer that will count how many seconds it takes to finnish the game.
     *
     * @memberof HanksMinesweeper
     */
  startTimer () {
    this.getElement('#clock').textContent = '0:0'
    this.startTime = Date.now()
    this.setIntervalId = setInterval(() => {
      this.seconds++
      if (this.seconds === 60) {
        this.seconds = 0
        this.minutes++
      }

      this.getElement('#clock').textContent = `${this.minutes}:${this.seconds}`
    }, 1000)
  }

  /**
     * Calculates the total time it took to finish the game.
     *
     * @returns {number} - Representing the total time.
     * @memberof HanksMinesweeper
     */
  getTotalTime () {
    return ((Date.now() - this.startTime) / 1000).toFixed(2)
  }

  /**
     * Finds elements in the shadowroot.
     *
     * @param {string} el - The element that will be located.
     * @returns - The chose element.
     * @memberof HanksMinesweeper
     */
  getElement (el) {
    return this.shadowRoot.querySelector(el)
  }
}

window.customElements.define('hanks-minesweeper', HanksMinesweeper)
