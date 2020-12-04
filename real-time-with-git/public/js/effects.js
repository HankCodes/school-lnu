
// Makes the chosen link in sidebar green
switch (window.location.pathname) {
  case '/profile':
    document.querySelector('#profile').style.backgroundColor = '#377C0A'
    break
  case '/profile/subscriptions':
    document.querySelector('#subscriptions').style.backgroundColor = '#377C0A'
    break
  case '/profile/settings':
    document.querySelector('#settings').style.backgroundColor = '#377C0A'
    break
}

// Makes the comment to reply green in discussion section
if (document.querySelector('#sendForm')) {
  const discussionContainer = document.querySelector('.discussionContainer')
  discussionContainer.addEventListener('click', (event) => {
    event.preventDefault()

    if (event.target.classList.contains('commentReply')) {
      const input = document.querySelector('#comment')
      input.value = event.target.id
      const replyTags = document.querySelectorAll('.commentReply')

      replyTags.forEach(reply => {
        reply.style.color = 'white'
      })
      setTimeout(() => {
        const text = document.querySelector(`#${event.target.id}`)
        text.style.color = 'green'
      }, 0)
    }
  })
}

// delete popup
const popupContainer = document.querySelector('#popupContainer')
popupContainer.addEventListener('click', event => {
  if (event.target.classList.contains('deletePopup')) {
    document.querySelector('#' + event.target.parentNode.parentNode.id).remove()
  }
})

// animate create account
if (document.querySelector('#uspWrapper')) {
  const showCreateAccount = document.querySelector('#showCreateAccount')
  showCreateAccount.addEventListener('click', event => {
    const createAccountForm = document.querySelector('#formWrapper')
    const uspWrapper = document.querySelector('#uspWrapper')
    createAccountForm.style.right = '-10%'
    uspWrapper.style.left = '-1000px'
  })
}
