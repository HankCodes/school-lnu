const generatePopup = (data) => {
  const displayData = {
    id: 'n2',
    author: 'Unknown',
    text: 'Unknown',
    title: 'Unknown',
    repo: 'Unknown'
  }

  const popup = document.querySelector('#popupTemp')

  // render popups
  if (data.object_kind === 'issue') {
    displayData.id = 'a' + data.object_attributes.iid
    displayData.author = '@' + data.user.username
    displayData.text = 'New issue'
    displayData.title = data.object_attributes.title
    displayData.repo = data.project.name
  } else if (data.object_kind === 'note') {
    displayData.id = 'a' + data.object_attributes.id
    displayData.author = 'on issue: ' + data.issue.title
    displayData.text = 'New comment'
    displayData.title = 'From ' + data.user.username
    displayData.repo = data.project.name
  }

  popup.content.querySelector('.newPopupWrapper').id = displayData.id
  popup.content.querySelector('.newPopupAuthor').textContent = displayData.author
  popup.content.querySelector('.newPopupText').textContent = displayData.text
  popup.content.querySelector('.newPopupTitle').textContent = displayData.title
  popup.content.querySelector('.newPopupRepo').textContent = displayData.repo

  return popup.content.cloneNode(true)
}

export { generatePopup }
