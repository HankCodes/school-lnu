'use strict'

if (document.querySelector('#searchField')) {
  const searchField = document.querySelector('#searchField')

  searchField.addEventListener('input', async (e) => {
    const res = await window.fetch('/snippets/search/rts?q=' + e.target.value)
    const snippets = await res.json()
    if (snippets.length >= 1) {
      document.querySelector('.snippetCollection').remove()
      const footer = document.querySelector('footer')
      const wrapper = document.createElement('section')
      wrapper.classList.add('snippetCollection')

      snippets.forEach(snippet => {
        const { tag, text, name, description, username, createdAt, _id } = snippet
        const snippetCard = document.createElement('div')
        snippetCard.classList.add('snippetCard')

        // Snippet tag
        const tagWrapper = document.createElement('div')
        tagWrapper.classList.add('tagWrapper')
        const langTag = document.createElement('div')
        langTag.classList.add(`${tag}Tag`)
        tagWrapper.appendChild(langTag)

        // Snippet code
        const snippetText = document.createElement('div')
        snippetText.classList.add('snippetText')
        const pre = document.createElement('pre')
        pre.classList.add(`language-${tag}`)
        const code = document.createElement('code')
        code.classList.add(`language-${tag}`)
        code.textContent = text
        pre.appendChild(code)
        snippetText.appendChild(pre)

        // snippet description
        const snippetDesc = document.createElement('div')
        snippetDesc.classList.add('snippetDescription')
        const header = document.createElement('h2')
        header.classList.add('headerClass')
        header.textContent = name
        const desc = document.createElement('p')
        desc.classList.add('snippetDescription')
        desc.textContent = description
        const author = document.createElement('p')
        author.classList.add('snippetAuthor')
        author.textContent = 'Created by: ' + username
        const date = document.createElement('p')
        date.classList.add('date')
        date.textContent = createdAt

        snippetDesc.appendChild(header)
        snippetDesc.appendChild(desc)
        snippetDesc.appendChild(author)
        snippetDesc.appendChild(date)

        // link to snippet
        const viewMore = document.createElement('div')
        viewMore.classList.add('viewMore')
        const a = document.createElement('a')
        a.href = `/snippets/${_id}/view`
        a.textContent = 'View more'

        viewMore.appendChild(a)

        // Assemble card
        snippetCard.appendChild(tagWrapper)
        snippetCard.appendChild(snippetText)
        snippetCard.appendChild(snippetDesc)
        snippetCard.appendChild(viewMore)

        wrapper.appendChild(snippetCard)
      })
      document.querySelector('body').insertBefore(wrapper, footer)
    } else {
      if (document.querySelector('.snippetCollection')) {
        const footer = document.querySelector('footer')
        const div = document.createElement('div')
        div.classList.add('flash')
        div.classList.add('warning')
        div.textContent = 'No snippets found'

        document.querySelector('body').insertBefore(div, footer)
        document.querySelector('.snippetCollection').remove()
      }
    }
  })
}
