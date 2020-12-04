'use strict'

if (document.querySelector('.tagCard')) {
  const wrapper = document.querySelector('.tagWrapper')
  wrapper.addEventListener('click', (e) => {
    const tags = document.querySelectorAll('.tagCardLabel')
    tags.forEach(tag => { tag.style.borderBottom = 'none' })
    setTimeout(() => { e.target.style.borderBottom = '5px solid grey' }, 0)
  })
}
