'use strict'
const popupDeleteTemp = document.createElement('template')
popupDeleteTemp.innerHTML = `
<div class="popupContainer">
    <div>
        <h2>You are about to delete this item.</h2>
        <div class="buttonContainer">
        <form method="POST" id="deleteForm">
            <input type="hidden" name="id" id="itemId" />
            <input type="submit" class="btnMainStyle" value="Delete" />
        </form>
          <button class="btnMainStyle" id="closeBtn">Close</button>
        </div>
    </div>
</div>
`

const handleDeletePopup = (e) => {
  const parentNode = e.target.parentNode.parentNode

  const deletePopup = popupDeleteTemp.content.cloneNode(true)
  document.querySelector('body').appendChild(deletePopup)
  document.querySelector('#deleteForm').action = `/snippets/${parentNode.id}/delete`
  document.querySelector('#itemId').value = parentNode.id

  const closeBtn = document.querySelector('#closeBtn')
  closeBtn.addEventListener('click', () => {
    document.querySelector('.popupContainer').remove()
  })
}

if (document.querySelector('.delete')) {
  const deleteItems = Array.from(document.querySelectorAll('.delete'))

  deleteItems.forEach(item => {
    item.addEventListener('click', handleDeletePopup)
  })
}
