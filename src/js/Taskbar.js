/**
 * @typedef {Object} TaskbarConfig
 * @property {string} background_color - The background color of the taskbar
 * @property {string} text_color - The text color of the taskbar
 */

/**
 * @class Taskbar
 * @public
 * @constructor
 */
export default class Taskbar {
    /**
     * The config for the taskbar.
     * @private
     * @type {TaskbarConfig}
     */
    #config

    /**
     * @public
     * @type {HTMLDivElement} - Current open windows scrollable container
     */
    taskbarScrollContainer

    /**
     * @public
     * @type {HTMLDivElement} - The main taskbar enclosing element
     */
    element

    /**
     * @public
     * @type {HTMLDivElement} - The notification container for the taskbar
     */
    notificationContainer

    /**
     * @public
     * @type {HTMLButtonElement} - The left scroll button for the taskbar
     */
    leftScrollButton

    /**
     * @public
     * @type {HTMLButtonElement} - The right scroll button for the taskbar
     */
    rightScrollButton



    /**
     * @param {TaskbarConfig} config - The configuration for the taskbar
     */
    constructor(config) {
        this.#config = config || {}
        this.element = document.createElement('div')
        this.element.id = 'taskbar'
        this.element.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        max-width: 100vw;
        display: flex;
        min-height: 30px;
        align-items: center;
        padding: 0 10px;
        z-index: 9999;
        background-color: ${config.background_color};
        color: ${config.text_color};
        overflow: hidden;
        cursor: default;
        `

        this.createNotificationContainer()
    }

    createNotificationContainer() {
        // Regular notif center box in the right hand corner
        this.notificationContainer = document.createElement('div')
        this.notificationContainer.id = 'notification-container'
        this.notificationContainer.style.display = 'flex'
        this.notificationContainer.style.overflowX = 'hidden'
        this.notificationContainer.style.flexGrow = 1
        this.notificationContainer.style.height = '25px'
        this.notificationContainer.style.minWidth = '2px'
        this.notificationContainer.style.maxWidth = '20vw'
        this.notificationContainer.style.boxShadow = 'rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset'
        this.notificationContainer.style.padding = '2px 5px'
        this.notificationContainer.style.justifyContent = 'end'
        this.notificationContainer.style.marginLeft = 'auto'
        this.notificationContainer.style.alignItems = 'center'

        // Clock in the corner
        this.datetime = new Date()
        const time = document.createElement('div')
        time.textContent = this.datetime.toLocaleTimeString()
        time.style.fontSize = '0.75rem'
        time.style.color = 'rgb(0, 0, 0)'
        time.style.whiteSpace = 'nowrap'
        time.style.overflow = 'hidden'
        time.style.textOverflow = 'ellipsis'

        setInterval(() => {
            this.datetime.setSeconds(this.datetime.getSeconds() + 1)
            time.textContent = this.datetime.toLocaleTimeString()
        }, 1000)

        this.notificationContainer.appendChild(time)
        this.element.appendChild(this.notificationContainer)
    }

    /**
     * Scrolls the open windows left or right by a specified amount.
     * @param {number} amount - The amount to scroll. Positive values scroll right, negative values scroll left.
     */
    scroll(amount) {
        this.taskbarScrollContainer.scrollBy({
          left: amount,
          behavior: 'smooth'
        })

        setTimeout(() => this.updateScrollButtons(), 25)
    }

    createScrollButtons() {
        // Left scroll button
        this.leftScrollButton = document.createElement('button')
        this.leftScrollButton.innerHTML = '&#10094;'  // Left chevron
        this.leftScrollButton.style.cssText = `
          left: 0;
          top: 0;
          bottom: 0;
          min-width: 20px;
          background: ${this.#config.background_color};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          margin-left: auto;
          margin-right: 5px;
        `
        this.leftScrollButton.addEventListener('click', () => this.scroll(-200))
        this.element.appendChild(this.leftScrollButton)
    
        // Create scroll container
        this.taskbarScrollContainer = document.createElement('div')
        this.taskbarScrollContainer.id = 'taskbar-scroll-container'
        this.taskbarScrollContainer.style.display = 'flex'
        this.taskbarScrollContainer.style.overflowX = 'hidden'
        this.taskbarScrollContainer.style.flexGrow = 1
        this.taskbarScrollContainer.style.height = '25px'
        this.taskbarScrollContainer.style.minWidth = '0'
        this.taskbarScrollContainer.style.maxWidth = '40vw'  // Leave space for scroll buttons
        this.taskbarScrollContainer.style.boxShadow = 'rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset'
        this.taskbarScrollContainer.style.alignItems = 'center'
        this.taskbarScrollContainer.style.padding = '2px 5px'
    
        this.element.appendChild(this.taskbarScrollContainer)
    
        // Right scroll button
        this.rightScrollButton = document.createElement('button')
        this.rightScrollButton.innerHTML = '&#10095;'  // Right chevron
        this.rightScrollButton.style.cssText = `
          right: 0;
          top: 0;
          bottom: 0;
          width: 12px;
          min-width: 12px;
          background: ${this.#config.background_color};
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          margin-left: 5px;
          margin-right: auto;
        `
        this.rightScrollButton.addEventListener('click', () => this.scroll(200))
        this.element.appendChild(this.rightScrollButton)
    
        // Initialize scroll state
        this.updateScrollButtons()
    }
}