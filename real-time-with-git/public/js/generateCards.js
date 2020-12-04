/**
 * Creates a issue card.
 *
 * @param {object} issue - Repo info.
 * @returns {object} - DOM Element.
 */
const getIssueCard = (issue) => {
  const cardWrapper = document.createElement('div')
  cardWrapper.classList.add('issueCardWrapper')
  cardWrapper.classList.add('bg-segment')
  // content
  const content = document.createElement('div')
  content.classList.add('content')
  content.classList.add('text-offWhite')

  const header = document.createElement('h3')
  header.classList.add('header')
  header.classList.add('text-fat')
  header.textContent = issue.object_attributes.title

  const author = document.createElement('p')
  author.classList.add('author')
  author.classList.add('text-slim')
  author.textContent = 'Created by: ' + issue.user.username

  const lastUpdated = document.createElement('p')
  lastUpdated.classList.add('lastUpdated')
  lastUpdated.classList.add('text-slim')
  lastUpdated.textContent = 'Last updated: ' + issue.object_attributes.updated_at.slice(0, 10)

  const state = document.createElement('p')
  state.classList.add('state')
  state.classList.add('text-slim')
  state.textContent = 'State: ' + issue.object_attributes.state

  const newItem = document.createElement('p')
  state.classList.add('text-softGreen')
  state.classList.add('text-italic')
  state.classList.add('text-slim')
  state.textContent = 'New issue'

  // button
  const buttonWrapper = document.createElement('div')
  buttonWrapper.classList.add('btnWrapper')
  const button = document.createElement('a')
  button.classList.add('btn')
  button.classList.add('bg-focus')
  button.classList.add('text-slim')
  button.classList.add('text-offWhite')
  button.href = `/profile/${issue.project.id}/issues/${issue.object_attributes.iid}/comments`
  button.textContent = 'View issue'

  // append elements
  content.append(header, author, lastUpdated, state, newItem)
  buttonWrapper.appendChild(button)

  cardWrapper.append(content, buttonWrapper)
  return cardWrapper
}

/**
 * Creates a repo card.
 *
 * @param {object} repo - Repo info.
 * @returns {object} - DOM Element.
 */
const getRepoCard = (repo) => {
  const repoWrapper = document.createElement('div')
  repoWrapper.classList.add('repoCardWrapper')
  repoWrapper.classList.add('bg-segment')
  // content
  const content = document.createElement('div')
  content.classList.add('content')
  content.classList.add('text-offWhite')

  const header = document.createElement('h3')
  header.classList.add('header')
  header.classList.add('text-fat')
  header.textContent = repo.name

  const org = document.createElement('p')
  org.classList.add('org')
  org.classList.add('text-slim')
  org.textContent = repo.org

  const newIssues = document.createElement('p')
  newIssues.classList.add('newIssues')
  newIssues.classList.add('text-slim')
  newIssues.classList.add('text-softGreen')
  newIssues.textContent = repo.newIssues || 'No new Issues'

  // button
  const buttonWrapper = document.createElement('div')
  buttonWrapper.classList.add('btnWrapper')
  const button = document.createElement('button')
  button.classList.add('btn')
  button.classList.add('bg-focus')
  button.classList.add('text-slim')
  button.classList.add('text-offWhite')
  button.name = repo._links.issues
  button.textContent = 'View issues'

  // append elements
  content.append(header, org, newIssues)
  buttonWrapper.appendChild(button)

  repoWrapper.append(content, buttonWrapper)
  return repoWrapper
}

/**
 * Takes a DOM element and removes all children.
 *
 * @param {object} element - The DOM element to remove all children from.
 */
const removeChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

export {
  getIssueCard,
  getRepoCard,
  removeChildren
}
