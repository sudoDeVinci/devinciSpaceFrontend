/**
 * @typedef {Object} IconConfig
 * @property {string} title - The title of the icon, displayed underneath the icon image.
 * @property {string} image - The path to the image to be displayed as the icon.
 * @property {string} onhover - The path to the image to be displayed when the icon is hovered over.
 * @property {function} clickhandler - The function to be called when the icon is clicked.
 * @property {string} initialURL - The initial URL to be opened when the icon is clicked.
 * @property {number} x - The x-coordinate of the icon in px.
 * @property {number} y - The y-coordinate of the icon in px.
 */

class Icon {

  /**
   * Create a new Icon.
   * @param {string} title - The title of the icon, displayed underneath the icon image.
   * @param {string} imagePath - The path to the image to be displayed as the icon.
   * @param {string} onhoverPath - The path to the image to be displayed when the icon is hovered over.
   * @param {function} clickHandler - The function to be called when the icon is clicked. 
   */
  constructor (title,
               imagePath,
               onhoverPath,
               clickHandler
               ) {

    title = title || ''
    imagePath = imagePath || 'imagees/0.png'
    onhoverPath = onhoverPath || 'images/0.png'
    this.element = document.createElement('div')
    this.element.className = 'desktop-icon'

    this.image = document.createElement('img')
    this.image.src = imagePath
    this.image.alt = title

    this.label = document.createElement('span')
    this.label.textContent = title

    this.element.appendChild(this.image)
    this.element.appendChild(this.label)

    // Change to double-click handler
    if (clickHandler) {
      this.element.addEventListener('dblclick', clickHandler)
    }

    this.element.style.cssText = `
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
      cursor: pointer;
      padding: 8px;
    `

    // Add hover state
    this.element.addEventListener('mouseenter', () => {
      this.image.src = onhoverPath
    })

    this.element.addEventListener('mouseleave', () => {
      this.image.src = imagePath
    })

    this.image.style.cssText = `
      width: 60px;
      height: 60px;
      margin-bottom: 4px;
      border-radius: 4px;
      this.transition: all 0.5s;
    `

    this.label.style.cssText = `
      color: white;
      text-align: center;
      font-size: 13px;
      text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
      word-wrap: break-word;
      max-width: 76px;
      font-family: "Pixelated MS Sans Serif", Arial;
    `
  }

  setPosition (x, y) {
    this.element.style.left = `${x}px`
    this.element.style.top = `${y}px`
  }
}

export {Icon}
export {IconConfig}