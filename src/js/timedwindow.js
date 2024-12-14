import Window from './window.js'
import Timer from './timer.js'

export default class Popup extends Window {
  constructor (id, config) {
    super(id, config)

    // Enhanced styling for popups
    this.element.style.boxShadow = config.styles.boxShadow || '0 4px 20px rgba(0,0,0,0.15)'
    this.element.style.borderRadius = config.styles.borderRadius || '12px'
    this.element.style.border = config.styles.border || 'none'

    // Style the title bar
    this.titleBar.style.backgroundColor = config.styles.backgroundColor || '#4338ca'
    this.titleBar.style.borderTopLeftRadius = config.styles.borderTopLeftRadius || '12px'
    this.titleBar.style.borderTopRightRadius = config.styles.borderTopRightRadius || '12px'

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
    const icon = document.createElement('div')
    icon.style.cssText = `
      font-size: 3em;
      margin-bottom: 10px;
    `
    icon.textContent = this.getAppropriateIcon(content.type)

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

  getAppropriateIcon (type) {
    if (type.toLowerCase() === 'win') return '🏆'
    else if (type.toLowerCase() === 'time') return '⏰'
    else if (type.toLowerCase() === 'star') return '🌟'
    else if (type.toLowerCase() === 'warning') return '⚠️'
    else return 'ℹ️'
  }

  updateTitleBarDisplay (seconds) {
    this.titletextdiv = this.titleBar.getElementsByClassName('window-title-bar-text')[0]
    this.titletextdiv.textContent = `Closing in ${seconds}s`
  }
}
