import { hanksWindowTemp } from './hanksWindowTemplates.js'

/**
 * A class representing the <hanks-window> custom element.
 *
 * @export
 * @class HanksWindow
 * @extends {window.HTMLElement}
 */
export default class HanksWindow extends window.HTMLElement {
  constructor (id) {
    super()
    this.attachShadow({ mode: 'open' })
    this.minimized = false
    this.windowId = id
    this.name = 'window'
    this.width = ''
    this.height = ''
    this.img = '#'
    this.position = 0

    this.main = ''
    this.dragItem = ''

    this.active = false
    this.currentX = 0
    this.currentY = 0
    this.initialX = 0
    this.initialY = 0
    this.xOffset = 0
    this.yOffset = 0
    this.storedY = 0
    this.storedX = 0
    this.currentZ = 0
    this.topZ = 500
  }

  /**
   * Sets the attributes of the element.
   *
   * @readonly
   * @static
   * @memberof BrowserDesktop
   */
  static get observedAttributes () {
    return ['height', 'width', 'img', 'name', 'zvalue', 'winpos']
  }

  /**
   * Watches for changes in the attributes of the element.
   *
   * @param {string} name - The name of the attribute to change.
   * @param {string} oldValue - The old value of the attribute, the attribute that will be changed.
   * @param {string} newValue - The new value that is going to be set for the attribute.
   * @memberof HanksWindow
   */
  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      case 'name':
        this.name = newValue
        this.getElement('#topbar-p').textContent = this.name.toUpperCase().replace('-', ' ')
        this.addApp(this.name)
        break
      case 'width':
        this.width = newValue
        break
      case 'height':
        this.height = newValue
        break
      case 'img':
        this.img = newValue
        break
      case 'winpos':
        this.position = newValue
        break
      case 'zvalue':
        this.getElement('#hw-container').style.zIndex = newValue
        this.currentZ = newValue
        break
    }
  }

  /**
   * Function that is called every time the component renders on the site.
   *
   * @memberof HanksWindow
   */
  connectedCallback () {
    this.shadowRoot.appendChild(hanksWindowTemp.content.cloneNode(true))
    this.setWindowAttributes()

    this.main = this.getElement('#hw-container')
    this.dragItem = this.getElement('#top-bar')

    this.addEventHandlers()
  }

  /**
   * Creates an element and appends it in the window.
   *
   * @param {string} - The name of the element.
   */
  addApp (name) {
    const element = document.createElement(name)
    if (name === 'hanks-chat') {
      element.addEventListener('noticeOnOff', (e) => {
        this.dispatchEvent(new window.CustomEvent('noticeOnOff', { detail: e.detail }))
      })
    }
    this.getElement('#content').appendChild(element)
  }

  /**
   * Activates event handlers.
   *
   * @memberof HanksWindow
   */
  addEventHandlers () {
    this.main.addEventListener('mousedown', this.dragStart.bind(this))
    window.addEventListener('mouseup', this.dragEnd.bind(this))
    window.addEventListener('mousemove', this.drag.bind(this))
    this.getElement('#min').addEventListener('click', this.minimizeWindow.bind(this))
    this.getElement('#close').addEventListener('click', this.closeWindow.bind(this))
  }

  /**
   * A callback function that runs when the element is removed from the browser.
   *
   * @memberof HanksWindow
   */
  disconnectedCallback () {
    document.removeEventListener('click', this.minimizeWindow.bind(this))
    document.removeEventListener('click', this.closeWindow.bind(this))
  }

  /**
   * Sets attributes for the element.
   *
   * @memberof HanksWindow
   */
  setWindowAttributes () {
    this.getElement('#content').style.width = `${this.width}px`
    this.getElement('#content').style.height = `${this.height}px`
    this.getElement('#icon').src = this.img
    this.getElement('#topbar-p').textContent = this.name
    this.getElement('#hw-container').style.top = `${this.position}px`
    this.getElement('#hw-container').style.left = `${this.position}px`
  }

  /**
   * Minimizes the window.
   *
   * @param {event} e - The event that triggered the event listener.
   * @memberof HanksWindow
   */
  minimizeWindow (e) {
    e.preventDefault()
    let display = ''
    let icon = ''

    if (this.minimized) {
      display = 'block'
      icon = "url('js/hanks-window-element/images/minimize-icon.svg')"
      this.minimized = false
      this.setTranslate(this.storedX, this.storedY, this.getElement('#hw-container'))
      this.yOffset = this.storedY
      this.xOffset = this.storedX
    } else {
      display = 'none'
      icon = "url('js/hanks-window-element/images/maximize-icon.svg')"
      this.minimized = true
      this.storedY = this.yOffset
      this.storedX = this.xOffset
      this.yOffset = (window.innerHeight - 200)
      this.xOffset = 0
      this.setTranslate(this.xOffset, this.yOffset, this.getElement('#hw-container'))
    }

    this.getElement('#content').style.display = display
    this.getElement('#bottom-bar').style.display = display
    this.getElement('#min').style.backgroundImage = icon
  }

  /**
   * Makes it possible to close a window. Dispatches a custom-event if button is clicked.
   *
   * @param {event} e - The event that triggered the event listener.
   * @memberof HanksWindow
   */
  closeWindow (e) {
    e.preventDefault()
    this.dispatchEvent(new window.CustomEvent('closeWindow', { detail: 'close' }))
  }

  /**
   * Finds and returns the right target.
   *
   * @param {DOM-Element} target - The DOM-Element that triggered the event listener.
   * @returns - The correct DOM-Element.
   * @memberof HanksWindow
   */
  findTarget (target) {
    if (target.id === 'top-bar') {
      return target
    } else {
      return target.parentNode.parentNode
    }
  }

  /**
   * Finds the position of the mouse when the mousedown event is triggered.
   *
   * @param {object} e - The event that triggered the event listener.
   * @memberof HanksWindow
   */
  dragStart (e) {
    const target = this.findTarget(e.target)
    this.initialX = e.clientX - this.xOffset
    this.initialY = e.clientY - this.yOffset

    this.main.style.zIndex = this.topZ

    if (target === this.dragItem) {
      this.active = true
    }
  }

  /**
   * Tracks the movement of the mouse during the mousemove-event.
   *
   * @param {object} e - The event that triggered the event listener.
   * @memberof HanksWindow
   */
  drag (e) {
    if (this.active) {
      e.preventDefault()

      this.currentX = e.clientX - this.initialX
      this.currentY = e.clientY - this.initialY

      this.xOffset = this.currentX
      this.yOffset = this.currentY
      this.container = this.getElement('#hw-container')
      this.setTranslate(this.currentX, this.currentY, this.container)
    }
  }

  /**
   * Changes the position of the window in relation to the mouse during the mousemove-event.
   *
   * @param {number} xPos - The amount of pixels the window will move in its x-position.
   * @param {number} yPos - The amount of pixels the window will move in its y-position.
   * @param {element} el - The element that will be moved.
   * @memberof HanksWindow
   */
  setTranslate (xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`
  }

  /**
   * Saves information about the position to be used in a possible next drag-event.
   *
   * @param {object} e - The event that triggered the event listener.
   * @memberof HanksWindow
   */
  dragEnd (e) {
    this.initialX = this.currentX
    this.initialY = this.currentY
    this.active = false
    this.main.style.zIndex = this.currentZ
  }

  /**
   * Finds the specified element in the shadowroot.
   *
   * @param {string} el - The string representing the element to find.
   * @returns - The specified element.
   * @memberof HanksWindow
   */
  getElement (el) {
    return this.shadowRoot.querySelector(el)
  }
}

window.customElements.define('hanks-window', HanksWindow)
