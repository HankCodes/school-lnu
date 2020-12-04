'use strict'
const popupLogoutTemp = document.createElement('template')
popupLogoutTemp.innerHTML = `
<div class="popupContainer">
    <div>
        <h2>You are about to sign out</h2>
        <div class="buttonContainer">
          <form method="GET" action="/logout">
            <input type="submit" class="btnMainStyle"  value="Sign me out" />
          </form>
          <button class="btnMainStyle" id="closeBtn">Close</button>
        </div>
    </div>
</div>
`

const logOutPopUp = (e) => {
  e.preventDefault()
  const popupWindow = popupLogoutTemp.content.cloneNode(true)
  // const popupContainer = document.createElement('div')
  // popupContainer.classList.add('popupContainer')

  // const popup = document.createElement('div')

  // const text = document.createElement('h2')
  // text.textContent = 'You are about to sign out'

  // const signOutBtn = document.createElement('a')
  // signOutBtn.classList.add('redBtn')
  // signOutBtn.href = '/logout'
  // signOutBtn.textContent = 'Sign me out'

  // const closeBtn = document.createElement('button')
  // closeBtn.textContent = 'close'
  // closeBtn.addEventListener('click', (e) => {
  //   document.querySelector('.popupContainer').remove()
  // })

  // popup.appendChild(text)
  // popup.appendChild(signOutBtn)
  // popup.appendChild(closeBtn)
  // popupContainer.appendChild(popup)

  // document.querySelector('body').appendChild(popupContainer)
  document.querySelector('body').appendChild(popupWindow)
  const closeBtn = document.querySelector('#closeBtn')
  closeBtn.addEventListener('click', (e) => {
    document.querySelector('.popupContainer').remove()
  })
}

if (document.querySelector('#logOut')) {
  const logOutBtn = document.querySelector('#logOut')
  logOutBtn.addEventListener('click', logOutPopUp)
}
