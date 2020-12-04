/** 
 * This code snippet is needed to be able to log in again after logging out with voice command.
 * 
 * Since the query in the url will presist in the browsers addressbar when a voice command is executed 
 * the query string for logging out will remain and prevent the user from logging in again.
 * When resetting the query string to the root url of the application this behaviour can be avoided
*/
document.addEventListener("DOMContentLoaded", () => {
    window.history.replaceState({}, document.title, "/a3/")
})

// Making the command instruction collapsable, only shown when authenticated.
if (document.querySelector('#collapsable')) {
    const collapsable = document.querySelector('#collapsable')
    const content = document.querySelector('#collapsable_content')
    let isCollapsed = true

    collapsable.addEventListener('click', (e) => {
        isCollapsed = !isCollapsed
        isCollapsed ? content.style.display = 'none' : content.style.display = 'block'
    })
}
