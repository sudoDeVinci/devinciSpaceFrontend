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
   * @type {HTMLDivElement} - The main taskbar enclosing element
   */
  element

  /**
   * @public
   * @type {HTMLDivElement} - The container for the taskbar buttons
   */
  buttonContainer

  /**
   * @public
   * @type {HTMLDivElement} - Current open windows scrollable container
   */
  scrollContainer

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
      z-index: 9998;
      background-color: ${config.background_color || '#c0c0c0'};
      color: ${config.text_color || '#fff'};
      overflow: hidden;
      cursor: default;
    `

    this.createTaskbarButtonContainer()
  }

  /**
   * Applies styles to a HTML element.
   * @private
   * @param {HTMLButtonElement | HTMLDivElement} htmlElement 
   * @param {object} styles 
   */
  applyStyles(htmlElement, styles = {}) {
    styles.keys().forEach(element => {
      htmlElement.style[element] = styles[element]
    })
  }

  /**
   * Creates the taskbar button container.
   * @param {object} styles - Additional styles to apply to the button container
   * @returns {void}
   */
  createTaskbarButtonContainer(styles = {}) {
    this.buttonContainer = document.createElement('div')
    this.buttonContainer.id = 'taskbar-button-container'
    this.buttonContainer.style.cssText = `
      display: flex;
      overflow-x: hidden;
      flex-grow: 1;
      height: 25px;
      min-width: 2px;
      padding: 2px 5px;
      justify-content: end;
      margin-left: 0px;
      alight-items: center;
    `

    this.applyStyles(this.buttonContainer, styles)
  }

  updateScrollButtonVisibility() {

  }

  /**
   * Scrolls the open windows in the taskbar by a specified amount.
   * @public
   * @param {number} amount 
   */
  scrollOpenWindows(amount) {
    this.buttonContainer.scrollBy({ left: amount, behavior: 'smooth' })
    setTimeout(() => {
      this.updateScrollButtonVisibility()
    }, 50)
  }

  /**
   * Creates the left scroll button for the taskbar.
   * @private
   * @param {object} styles - Additional styles to apply to the left scroll button
   * @returns {HTMLButtonElement} - The left scroll button element
   */
  createLeftScrollButton(styles={}) {
    this.leftScrollButton = document.createElement('button')
    this.leftScrollButton.id = 'taskbar-left-scroll-button'
    this.leftScrollButton.innerHTML = '&#10094;'
    this.leftScrollButton.style.cssText = `
      height: 25px;
      min-width: 25px;
      display: none;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      color: inherit;
      font-size: 16px;
      cursor: pointer;
    `
  }

  createTaskbarScrollContainer() {

  }


}