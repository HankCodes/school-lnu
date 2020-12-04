const hanksTaskbarTemp = document.createElement('template')
hanksTaskbarTemp.innerHTML = `
<style id="hanks-tskbarStyle">
   #tskbar-container {
      display: flex;
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 100px;
  }

  #tskbarapp-container {
      display: flex;
      height: inherit;
      margin: 0 auto;
      z-index: 999;
      position: relative;
      bottom: -100px;
      transition: transform .2s ease-in-out;
   }

    .appIcon {
      position: relative;
      cursor: pointer;
      height: 100px;
      width: 100px;
      margin: 0 5px;
      font-size: 0;
      transition: transform .2s ease-in-out;
    }
    
    .appIcon > img {
      width: 100%;
      height: 100%;
    }

    .appIcon:hover {
      transform: translate3d(0px, -20px, 0px);
    }

</style>

<div id="tskbar-container">
    <div id="tskbarapp-container"></div>
</div>
`

/**
 * Represents the <hanks-taskbar> custom element.
 *
 * @export
 * @class HanksTaskbar
 * @extends {window.HTMLElement}
 */
export default class HanksTaskbar extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.taskbar = ''
    this.visible = false
    this.boundAddCustomEvent = ''
    this.boundShowOrHideTaskbar = ''
    this.taskbarApps = []

    this.memory = {
      name: 'hanks-memory',
      img: 'js/hanks-memory/image/memory-logo.svg',
      width: 400,
      height: 550
    }

    this.chat = {
      name: 'hanks-chat',
      img: 'js/hanks-chat/images/hanks-chat-logo.svg',
      width: 400,
      height: 600
    }

    this.minesweeper = {
      name: 'hanks-minesweeper',
      img: './js/hanks-minesweeper/images/mine_1.svg',
      width: 600
    }
  }

  /**
     * Function that is called every time the component renders on the site.
     *
     * @memberof HanksWindow
     */
  connectedCallback () {
    this.shadowRoot.appendChild(hanksTaskbarTemp.content.cloneNode(true))
    this.taskbar = this.shadowRoot.querySelector('#tskbarapp-container')

    this.newApp(this.memory, this.chat, this.minesweeper)
    this.bindFunctions()
    this.addEventHandlers()
  }

  /**
   * A collection of event listerners that will be set during connectedCallback.
   *
   * @memberof HanksTaskbar
   */
  addEventHandlers () {
    this.taskbar.addEventListener('click', this.boundAddCustomEvent)
    this.taskbar.parentNode.addEventListener('mouseenter', this.boundShowOrHideTaskbar)
    this.taskbar.parentNode.addEventListener('mouseleave', this.boundShowOrHideTaskbar)
  }

  /**
   * Shows or hides the taskbar on the webpage.
   *
   * @memberof HanksTaskbar
   */
  showOrHideTaskbar () {
    if (this.visible === false) {
      this.taskbar.style.transform = 'translate3d(0px, -110px, 0px)'
      this.visible = true
    } else {
      setTimeout(() => { this.taskbar.style.transform = 'translate3d(0px, 0px, 0px)' }, 100)
      this.visible = false
    }
  }

  /**
   * Dispatches a custom event with information about the app that was clicked.
   *
   * @param {event} e - The event-object that was captured by the eventlisterner.
   * @memberof HanksTaskbar
   */
  addCustomEvent (e) {
    this.taskbarApps.forEach(app => {
      if (e.target.id === app.name) {
        this.dispatchEvent(new window.CustomEvent('tskbariconclicked', { detail: app }))
      }
    })
  }

  /**
   * Binds this in a function to a variable to be able to remove the eventlistener.
   *
   * @memberof HanksTaskbar
   */
  bindFunctions () {
    this.boundAddCustomEvent = this.addCustomEvent.bind(this)
    this.boundShowOrHideTaskbar = this.showOrHideTaskbar.bind(this)
  }

  /**
   * A function that is called when the element is removed from the webpage.
   *
   * @memberof HanksTaskbar
   */
  disconnectedCallback () {
    this.taskbar.removeEventListener('click', this.boundAddCustomEvent)
    this.taskbar.parentNode.removeEventListener('mouseenter', this.boundShowOrHideTaskbar)
    this.taskbar.parentNode.removeEventListener('mouseleave', this.boundShowOrHideTaskbar)
  }

  /**
   * Creates an icon for a new app and appends it in the taskbar. It also saves
   * an object containing information about the app in the array this.taskbarApps.
   *
   * @param {object} - An object containing information about the app. Can take any number of arguments.
   * @memberof HanksTaskbar
   */
  newApp (app) {
    for (let i = 0; i < arguments.length; i++) {
      const tskbar = this.shadowRoot.querySelector('#tskbarapp-container')
      const appContainer = document.createElement('div')
      appContainer.classList.add('appIcon')
      const img = document.createElement('img')
      img.id = arguments[i].name
      img.src = arguments[i].img
      this.taskbarApps.push(arguments[i])
      appContainer.appendChild(img)
      tskbar.appendChild(appContainer)
    }
  }
}

window.customElements.define('hanks-taskbar', HanksTaskbar)
