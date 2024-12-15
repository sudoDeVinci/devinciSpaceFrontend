import Timer from './timer.js'

export default class Icon {
  constructor (title,
               imagePath,
               onhoverPath,
               clickHandler,
               onTime = null
               ) {
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
    `
  }

  setPosition (x, y) {
    this.element.style.left = `${x}px`
    this.element.style.top = `${y}px`
  }
}
