import { desktopMain, notificationTemp } from './hanksDesktopTemplates.js'

/**
 * A class representing the <hanks-window> custom element.
 *
 * @export
 * @class HanksDesktop
 * @extends {window.HTMLElement}
 */
export default class HanksDesktop extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.windows = []
    this.zTop = 0
    this.windowPos = 60
    this.socket = ''
    this.noticeDialouges = 0
    this.notifications = false
  }

  /**
   * Function that is called every time the component renders on the site.
   *
   * @memberof HanksDesktop
   */
  connectedCallback () {
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'charcords')
    this.shadowRoot.appendChild(desktopMain.content.cloneNode(true))
    this.getElement('#main').appendChild(document.createElement('hanks-taskbar'))
    this.bindEventCallbacks()
    setTimeout(this.getNotifications.bind(this), 3000)
    this.addEventHandlers()
  }

  /**
   * Collection of eventlisterners that will be set in connectedCallback.
   *
   * @memberof HanksDesktop
   */
  addEventHandlers () {
    this.getElement('#main').addEventListener('click', e => {
      if (e.target.id.includes('window') && e.target.getAttribute('zvalue') < this.zTop) {
        const win = this.shadowRoot.querySelector(`#${e.target.id}`)
        if (win !== null) {
          win.setAttribute('zvalue', this.zTop += 1)
        }
      }
    })

    this.getElement('hanks-taskbar').addEventListener('tskbariconclicked', e => {
      const win = this.createWindow(e.detail)
      win.addEventListener('closeWindow', e => {
        this.getElement('#main').removeChild(win)
        this.windowPos -= 15
      })
    })
  }

  /**
   * Creates a new window and dispatches an custom event with information about what app that should be
   * appended in the created window.
   *
   * @param {object} appObj - An object containing information about the app that will be appended in the created window.
   * @returns - A new window-element.
   * @memberof HanksDesktop
   */
  createWindow (appObj) {
    const { width, height, img, name } = appObj
    const newWin = document.createElement('hanks-window')
    this.windows.push(newWin)
    newWin.setAttribute('winpos', this.windowPos)
    newWin.setAttribute('width', width)
    newWin.setAttribute('height', height)
    newWin.setAttribute('img', img)
    this.getElement('#main').appendChild(newWin)

    newWin.setAttribute('name', name)
    newWin.id = 'window' + this.windows.length
    newWin.setAttribute('zvalue', this.zTop += 1)

    this.windowPos += 20
    this.dispatchEvent(new window.CustomEvent('get-app', { detail: 'hanks-memory' }))
    this.enableOrDisableNotifications(appObj, newWin)

    return newWin
  }

  /**
     * Creates a dialouge box that makes it possible to enable notifications from the chat.
     *
     * @param {*} e
     * @memberof HanksDesktop
     */
  getNotifications (e) {
    const notice = this.newNotice()
    this.getElement('#main').appendChild(notice)
    this.getElement(`#${notice.id}`).addEventListener('click', e => {
      if (e.target.id === 'closeButton') {
        this.hideNotification(`#${notice.id}`)
      } else {
        this.notifications = true
        this.socket.addEventListener('message', this.boundAppendNotice)
        this.hideNotification(`#${notice.id}`)
      }
    })
    this.showNotification(`#${notice.id}`)
  }

  /**
   * Enables or disables notifications from the chat.
   *
   * @param {object} appObj - Object containing information about the app
   * @param {DOMElement} newWin - A dom element containing the app.
   * @memberof HanksDesktop
   */
  enableOrDisableNotifications (appObj, newWin) {
    if (appObj.name === 'hanks-chat') {
      newWin.addEventListener('noticeOnOff', (e) => {
        if (e.detail && this.notifications) {
          console.log('remove notice')
          this.socket.removeEventListener('message', this.boundAppendNotice)
          this.notifications = false
        } else if (!e.detail && this.notifications) {
          console.log('remove notice')
          this.socket.removeEventListener('message', this.boundAppendNotice)
          this.notifications = false
        } else {
          console.log('add notice')
          this.socket.addEventListener('message', this.boundAppendNotice)
          this.notifications = true
        }
      })
    }
  }

  /**
     * Creates new notification popup.
     *
     * @returns - A DOM-element representing a popup chat notice.
     * @memberof HanksDesktop
     */
  newNotice () {
    this.noticeDialouges += 1
    const notice = document.createElement('div')
    notice.classList.add('not-bg')
    notice.id = `notice${this.noticeDialouges}`
    notice.appendChild(notificationTemp.content.cloneNode(true))
    return notice
  }

  /**
       * Evaluates the conditions for making a popup chat notice.
       *
       * @param {object} message - The message from the server.
       * @returns - true or false.
       * @memberof HanksDesktop
       */
  evaluateAcess (message) {
    let makeNotice = true
    const windows = Array.from(this.shadowRoot.querySelectorAll('hanks-window'))
    windows.forEach(window => {
      if (window.name === 'hanks-chat') {
        makeNotice = false
      }
    })

    if (makeNotice &&
        message.type !== 'heartbeat' &&
        message.username !== 'The Server' &&
        message.username !== window.localStorage.getItem('hanks-chat-username')
    ) {
      return true
    } else {
      return false
    }
  }

  /**
       * Renders popup chat notice on the webpage.
       *
       * @param {object} e - The message from the server.
       * @memberof HanksDesktop
       */
  appendNotice (e) {
    const message = JSON.parse(e.data)

    if (this.evaluateAcess(message)) {
      const notice = this.newNotice()
      notice.querySelector('#notification').textContent = `New message from ${message.username}`
      this.getElement('#main').appendChild(notice)
      this.saveMsgs(message)
      this.showNotification(`#${notice.id}`)
      setTimeout(() => {
        this.hideNotification(`#${notice.id}`)
      }, 2000)
    }
  }

  /**
     * Moves a chat notification upwards.
     *
     * @param {number} elementID - The DOM Element id that will be moved upwards.
     * @memberof HanksDesktop
     */
  showNotification (elementID) {
    let pos = 0
    const id = setInterval(() => {
      if (pos === 30) {
        clearInterval(id)
      } else {
        pos++
        this.getElement(elementID).style.bottom = pos + 'px'
      }
    }, 5)
  }

  /**
     * Removes a notification.
     *
     * @param {number} - The DOM Element id of the element to remove.
     * @memberof HanksDesktop
     */
  hideNotification (elementID) {
    let pos = 1
    const id = setInterval(() => {
      if (pos < 0) {
        clearInterval(id)
      } else {
        pos -= 0.1
        this.getElement(elementID).style.opacity = pos
      }
    }, 7)
    setTimeout(() => {
      this.getElement(elementID).remove()
    }, 1500)
  }

  /**
     * Saves messages in local storage.
     *
     * @param {object} message - A user object including the message.
     * @memberof HanksChat
     */
  saveMsgs (message) {
    const storage = window.localStorage
    const savedMsgs = storage.getItem('hanks-chat-msgs') || '[]'
    const storeMsgs = [...JSON.parse(savedMsgs), message]
    storage.setItem('hanks-chat-msgs', JSON.stringify(storeMsgs))
  }

  /**
     * Binds this to a function to be able to remove a event listener.
     *
     * @memberof HanksDesktop
     */
  bindEventCallbacks () {
    this.boundAppendNotice = this.appendNotice.bind(this)
  }

  /**
   * Gets an element from the shadowroot.
   *
   * @param {string} element - The element you want to find.
   * @returns - The chosen element.
   * @memberof HanksDesktop
   */
  getElement (element) {
    return this.shadowRoot.querySelector(element)
  }
}

window.customElements.define('hanks-desktop', HanksDesktop)
