import { getIssueCard } from './generateCards.js'
import { generatePopup } from './generatePopup.js'

// connect to websocket
const socket = window.io.connect()
socket.on('connected', data => {
  console.log('Client websocket: connected')
})

// data from webhook
socket.on('webhookData', data => {
  // makes a notification popup
  const popupContainer = document.querySelector('#popupContainer')
  popupContainer.children.length > 0 ? popupContainer.prepend(generatePopup(data.viewData)) : popupContainer.appendChild(generatePopup(data.viewData))

  // makes the new issue render on the issue-page.
  const path = window.location.pathname
  if (path.includes('issues') &&
  path.includes(data.viewData.project.id) &&
  data.viewData.object_kind !== 'note' &&
  data.viewData.object_attributes.action === 'open'
  ) {
    const container = document.querySelector('#newIssuesContainer')
    container.appendChild(getIssueCard(data.viewData))
  }
})
