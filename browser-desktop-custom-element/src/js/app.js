
/**
 * Startingpoint of the application.
 *
 * @author Henrik Holstad
 * @version 1.2.0
 * @module src/app.js
 */

import './hanks-desktop-element/hanks-desktop.js'
import './hanks-window-element/hanks-window.js'
import './hanks-taskbar-element/hanks-taskbar.js'
import './hanks-memory/js/hanks-memory.js'
import './hanks-chat/hanks-chat.js'
import './hanks-minesweeper/hanks-minesweeper.js'

// Checks in the navigator object if theres a service worker

const isServiceWorker = async function () {
  try {
    if ('serviceWorker' in navigator) {
      const registered = await navigator.serviceWorker.register('./sw.js', { scope: './' })
      console.log('SwerviceWorker: Found', registered)
    }
  } catch (err) {
    console.log('The serviceWorker failed to register', err)
  }
}

window.addEventListener('load', isServiceWorker)
