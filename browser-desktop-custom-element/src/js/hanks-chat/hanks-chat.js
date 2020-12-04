import { chatLayoutTemp, serverMessageTemp, userMessageTemp, logInTemp } from './hanksChatTemplates.js'
/**
 * A class representing the hanks-chat custom element.
 *
 * @export
 * @class HanksChat
 * @extends {window.HTMLElement}
 */
export default class HanksChat extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.socket = ''
    this.username = ''
    this.storage = window.localStorage
    this.msgId = 0
    this.notifications = false
  }

  /**
   * A callback function that runs everytime the custom element is renderd in the DOM.
   *
   * @memberof HanksChat
   */
  connectedCallback () {
    this.bindFunctions()
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/', 'charcords')
    this.chatStartUp()
  }

  /**
   * A callback function that will run every time the element is removed from the DOM.
   *
   * @memberof HanksChat
   */
  disconnectedCallback () {
    this.socket.close()
    this.socket.removeEventListener('message', this.boundGetMsgFromServer)
    this.getElement('form').removeEventListener('submit', this.boundHandleUserMsg)
    this.getElement('form').removeEventListener('keypress', this.boundFindKeyPress)
  }

  /**
   * Binds this to functions and stores the function in a variable.
   *
   * @memberof HanksChat
   */
  bindFunctions () {
    this.boundGetMsgFromServer = this.getMsgFromServer.bind(this)
    this.boundHandleUserMsg = this.handleUserMsg.bind(this)
    this.boundFindKeyPress = this.findKeyPress.bind(this)
    this.boundLogInButtonCallback = this.logInButtonCallback.bind(this)
  }

  /**
   * Checks wether a username exist and either makes a log in page or continues to the chat.
   *
   * @memberof HanksChat
   */
  chatStartUp () {
    if (this.storage.getItem('hanks-chat-username')) {
      this.username = this.storage.getItem('hanks-chat-username')
      this.renderChatPage()
    } else {
      this.renderLoginPage()
    }

    this.append20latestMsg(this.getLastMsgs())
    this.scrollPage()
  }

  /**
   * Gets messages from local storage and selects the 20 latest messages.
   *
   * @returns - An array of the last 20 messages.
   * @memberof HanksChat
   */
  getLastMsgs () {
    if (this.storage.getItem('hanks-chat-msgs')) {
      const msgs = JSON.parse(this.storage.getItem('hanks-chat-msgs'))
      return msgs.slice(-20, msgs.length)
    }
  }

  /**
   * Gets an array of messages and appending them to the chat.
   *
   * @param {array} messages - An array containing messages from local storage.
   * @memberof HanksChat
   */
  append20latestMsg (messages) {
    if (messages !== undefined) {
      messages.forEach(message => {
        if (this.username === message.username && message.origin === 'hanks-chat') {
          const msgCont = this.getUserMsgContainer(message)
          this.getElement('#chatContent').appendChild(msgCont)
        } else {
          const serverCont = this.getServerMsgContainer(message)
          this.getElement('#chatContent').appendChild(serverCont)
        }
      })
    }
  }

  /**
   * Makes the login page for the application.
   *
   * @memberof HanksChat
   */
  renderLoginPage () {
    this.clearShadowRoot()
    this.shadowRoot.appendChild(logInTemp.content.cloneNode(true))
    this.getElement('#logInBtn').addEventListener('click', this.boundLogInButtonCallback)
  }

  /**
   * A handler for the log in button that includes getting username, render chat, activating recieve
   * and send messages and activating the dropdown menu.
   *
   * @param {object} e - The event that triggered the event listener.
   * @memberof HanksChat
   */
  logInButtonCallback (e) {
    e.preventDefault()
    this.username = this.shadowRoot.querySelector('#logInField').value
    if (this.validateMsg(this.username)) {
      this.storage.setItem('hanks-chat-username', this.username)
      this.getElement('#logInBtn').removeEventListener('click', this.boundLogInButtonCallback)
      this.renderChatPage()
      this.append20latestMsg(this.getLastMsgs())
      this.scrollPage()
    }
  }

  /**
   * Renders the chatpage and adds eventlisterners related to the page.
   *
   * @memberof HanksChat
   */
  renderChatPage () {
    this.clearShadowRoot()
    this.shadowRoot.appendChild(chatLayoutTemp.content.cloneNode(true))
    this.getElement('#chatUsernameP').textContent = this.username

    this.socket.addEventListener('message', this.boundGetMsgFromServer)
    this.getElement('form').addEventListener('submit', this.boundHandleUserMsg)
    this.getElement('form').addEventListener('keypress', this.boundFindKeyPress)
    this.handleDropdown()
  }

  /**
   * A handler for the dropdown menu.
   *
   * @memberof HanksChat
   */
  handleDropdown () {
    const dropdownBtn = this.getElement('#dropbtn')
    const chatContainer = this.getElement('#chatContainer')
    const dropdownCont = this.getElement('#dropdown-content')
    const changeName = this.getElement('#changeName')
    const notifications = this.getElement('#notifics')

    dropdownBtn.addEventListener('click', e => {
      if (dropdownCont.style.display === 'inline-block') {
        dropdownCont.style.display = 'none'
      } else {
        dropdownCont.style.display = 'inline-block'
      }
    })

    chatContainer.addEventListener('click', e => {
      if (e.target !== changeName && e.target !== dropdownBtn) {
        dropdownCont.style.display = 'none'
      }
    })

    changeName.addEventListener('click', e => {
      this.socket.removeEventListener('message', this.boundGetMsgFromServer)
      this.getElement('form').removeEventListener('submit', this.boundHandleUserMsg)
      this.getElement('form').removeEventListener('keypress', this.boundFindKeyPress)
      this.renderLoginPage()
    })

    notifications.addEventListener('click', e => {
      this.notifications ? this.notifications = false : this.notifications = true
      this.dispatchEvent(new window.CustomEvent('noticeOnOff', { detail: this.notifications }))
    })
  }

  /**
   * Checks if enter key was pressed and if so calls the function handleUserMsg().
   *
   * @param {event} e - The keypressed-event
   * @memberof HanksChat
   */
  findKeyPress (e) {
    if (e.which === 13) {
      this.handleUserMsg(e)
    }
  }

  /**
   * Gets the messages from the server.
   *
   * @param {event} event - The event that invoked the function.
   * @memberof HanksChat
   */
  getMsgFromServer (event) {
    this.renderServerMsg(JSON.parse(event.data))
  }

  /**
   * Clones a template for rendering of a message sent from the server (other users).
   *
   * @param {object} message - A object containing user information.
   * @returns - A DOM element.
   * @memberof HanksChat
   */
  getServerMsgContainer (message) {
    const container = serverMessageTemp.content.cloneNode(true)
    container.querySelector('.serverUsername').textContent = message.username
    container.querySelector('.serverMessage').textContent = message.data
    container.querySelector('.msgContainer').style.alignItems = 'flex-start'

    return container
  }

  /**
   * Renders messages to the chat.
   *
   * @param {object} message - An object containing information from the server.
   * @memberof HanksChat
   */
  renderServerMsg (message) {
    if (this.evaluateAcess(message)) {
      if (this.username === message.username && message.origin === 'hanks-chat') {
        this.getElement('#chatContent').appendChild(this.getUserMsgContainer(message))
      } else {
        this.getElement('#chatContent').appendChild(this.getServerMsgContainer(message))
        this.saveMsgs(message)
      }
    }

    this.scrollPage()
  }

  /**
   * Evaluates the conditions if a message shall be rendered or not.
   *
   * @param {object} message - The message from the server.
   * @returns - true or false.
   * @memberof HanksDesktop
   */
  evaluateAcess (message) {
    if (message.type !== 'heartbeat' &&
    message.username !== 'The Server' &&
    this.validateMsg(message.data)
    ) {
      return true
    } else {
      return false
    }
  }

  /**
   * Checks if the input contains only whitespaces.
   *
   * @param {object} msg - An object containing user information.
   * @returns - True if theres not only whitespace, otherwise false.
   * @memberof HanksChat
   */
  validateMsg (msg) {
    if (/\S+/.test(msg)) {
      return true
    } else {
      return false
    }
  }

  /**
   * Creates a DOM-element containing the message from the user.
   *
   * @param {object} message - A message object containing information about the user and the message that the user has sent.
   * @returns - A DOM-element
   * @memberof HanksChat
   */
  getUserMsgContainer (message) {
    const container = userMessageTemp.content.cloneNode(true)
    container.querySelector('.username').textContent = message.username
    container.querySelector('.userMessage').textContent = message.data
    container.querySelector('.msgContainer').style.alignItems = 'flex-end'

    return container
  }

  /**
   * Finds the right DOM element
   *
   * @param {object} e - The event target
   * @returns - A DOM element
   * @memberof HanksChat
   */
  findtarget (e) {
    if (e.type === 'submit') {
      return e.target
    } else {
      return e.target.parentNode
    }
  }

  /**
   * Formats users message to an object and validates if it will be sent to the server or not.
   *
   * @param {object} target - A user object containing information and the message.
   * @memberof HanksChat
   */
  handleUserMsg (target) {
    target.preventDefault()
    target = this.findtarget(target)

    const userMsg = this.getUserMsg(target, this.username)

    if (this.validateMsg(userMsg.data)) {
      this.sendMsgToServer(userMsg)
    }
  }

  /**
   * Scrolls the chatpage to bottom.
   *
   * @memberof HanksChat
   */
  scrollPage () {
    const div = this.getElement('#chatContent')
    if (div !== null) {
      div.scrollTop = div.scrollHeight
    }
  }

  /**
   * Sends the users message to the server
   *
   * @param {object} message - A object containing user information and the message
   * @memberof HanksChat
   */
  sendMsgToServer (message) {
    this.socket.send(JSON.stringify(message))
    this.saveMsgs(message)
  }

  /**
   * Formats the user message
   *
   * @param {element} target - A DOM element
   * @param {string} username - The users name
   * @returns - An object containing user information including the message.
   * @memberof HanksChat
   */
  getUserMsg (target, username) {
    this.msgId++
    const msg = {
      type: 'message',
      data: target.children[0].value,
      username: username,
      channel: 'my, not so secret, channel',
      key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd',
      origin: 'hanks-chat'
    }

    target.children[0].value = ''

    return msg
  }

  /**
   * Saves messages in local storage.
   *
   * @param {object} message - a user object including the message.
   * @memberof HanksChat
   */
  saveMsgs (message) {
    if (message.type !== 'notification') {
      const savedMsgs = this.storage.getItem('hanks-chat-msgs') || '[]'
      const storeMsgs = [...JSON.parse(savedMsgs), message]
      this.storage.setItem('hanks-chat-msgs', JSON.stringify(storeMsgs))
    }
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

  /**
   * Clears the shadowroot from elements.
   *
   * @memberof HanksChat
   */
  clearShadowRoot () {
    for (let i = 0; i < this.shadowRoot.children.length; i++) {
      this.shadowRoot.children[i].remove()
      i--
    }
  }
}

window.customElements.define('hanks-chat', HanksChat)
