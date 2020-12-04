
const generateElement = (el) => {
  const { tag, cssClass, id, action, method, type, children, name, textContent, href } = el
  const element = document.createElement(tag)

  if (cssClass) {
    cssClass.forEach(attr => {
      element.classList.add(attr)
    })
  }

  if (id) {
    element.id = id
  }

  if (action) {
    element.action = action
  }

  if (method) {
    element.method = method
  }

  if (type) {
    element.type = type
  }

  if (name) {
    element.name = name
  }

  if (textContent) {
    element.textContent = textContent
  }

  if (href) {
    element.href = href
  }

  if (children) {
    children.forEach(child => {
      const childElement = generateElement(child)
      element.appendChild(childElement)
    })
  }

  return element
}

export { generateElement }
