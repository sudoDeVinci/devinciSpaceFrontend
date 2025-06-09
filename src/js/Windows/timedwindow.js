import {Window} from './window.js'
/** @import {WindowConfig} from './window.js' */
import Timer from '../timer.js'

export default class Popup extends Window {

  /**
   * Create a new Window instance with the provided configuration.
   * @param {string} id - The window identifier
   * @param {WindowConfig} config - The window configuration
   */
  constructor (id, config) {
    super(id, config)

    // Create timer with fade effect
    this.timer = new Timer({
      onComplete: () => {
        this.element.style.transition = 'opacity 0.5s ease-out'
        this.element.style.opacity = '0'
        setTimeout(() => this.emit('close', this), 500)
      },
      format: 'seconds'
    })

    this.timer.on('tick', seconds => this.updateTitleBarDisplay(seconds))

    // Create an enhanced message display
    const messageContainer = document.createElement('div')
    messageContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 10px;
      text-align: center;
      background: linear-gradient(to bottom, #ffffff, #f7f7f7);
    `

    // Add icon/emoji based on content type (success, warning, etc)
    /**@type {HTMLImageElement} */
    const icon = document.createElement('img')
    icon.style.cssText = `
      font-size: 3em;
      margin-bottom: 10px;
      src: ${this.config.icon || 'https://via.placeholder.com/50'};
    `

    const message = document.createElement('div')
    message.style.cssText = `
      font-size: 1.25em;
      font-weight: bold;
      color: #374151;
      margin-bottom: 10px;
      line-height: 1.5;
    `
    
    message.innerHTML = this.content
    messageContainer.appendChild(icon)
    messageContainer.appendChild(message)

    this.contentArea.appendChild(messageContainer)
    this.element.appendChild(this.contentArea)

    const duration = 15
    this.timer.start(duration)
  }

  updateTitleBarDisplay (seconds) {
    this.titletextdiv = this.titleBar.getElementsByClassName('window-title-bar-text')[0]
    this.titletextdiv.textContent = `Closing in ${seconds}s`
  }
}
