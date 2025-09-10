import {Window} from './Windows/window.js'
import Popup from './Windows/timedwindow.js'
import {Icon} from './Icon.js'
import MusicPlayer from './Windows/musicplayer.js'
import SecretWindow from './Windows/secretwindow.js'


/** @import {WindowConfig} from './Windows/window.js' */
/** @import {IconConfig} from './Icon.js' */
/** @import {TaskbarConfig} from './Taskbar.js'*/


/**
 * @typedef TaskbarButtonConfig
 * @property {string} title - The title of the taskbar button.
 * @property {Function} clickhandler - The function to be called when the button is clicked. 
 */


/**
 * @typedef EnvironmentConfigStyleGuide
 * @property {string} background_color - The background color of the environment.
 * @property {string} background_image - The background image of the environment.
 */


/**
 * @typedef EnvironmentConfig
 * @property {TaskbarConfig} taskbarConfig - The configuration for the taskbar.
 * @property {Map<typeof Window, WindowConfig>} windowDefaults - The types of windows that can be created and their defaults.
 * @property {Map<string, WindowConfig>} startupWindows - The default window titles and their configurations.
 * @property {IconConfig[] | Icon[]} icons - The default icons to be added to the desktop.
 * @property {TaskbarButtonConfig[]} taskbarItems - The default taskbar items to be added to the taskbar.
 * @property {number} iconLoadDelay - Delay in milliseconds between loading each default icon.
 * @property {number} zIndexBase - The base z-index for windows in the environment.
 * @property {EnvironmentConfigStyleGuide} styles - Additional CSS styles to be applied to the environment.
 */


/**
 * Environment class for managing windows and icons in a desktop-like environment.
 * @class Environment
 * @constructor
 * @public
 */
export default class Environment {

  /**
   * @param {EnvironmentConfig} envconfig - Configuration object for the environment. 
   */
  constructor (envconfig = {}) {
    console.log('Environment constructor started!')
 
    /**@type {number}*/
    this.zIndexBase = envconfig.zIndexBase || 100

    /**@type {string}*/
    this.background_color = envconfig.styles.background_color || '#FAF9F6'

    /**@type {string}*/
    this.background_image = envconfig.styles.background_image || 'images/bg.png'

    /**@type {string}*/
    this.taskbar_background_color = '#c0c0c0'

    /**@type {string}*/
    this.taskbar_text_color = '#fff'

    /** @type {Map<string, Window>} Map of Window ids to their window objects*/
    this.windows = new Map()

    /** @type {Map<string, HTMLButtonElement>} Map of window ids to their taskbar buttons.*/
    this.taskbarWindowButtons = new Map()

    /** @type {Map<string, Icon>} Map of icon titles to their Icon objects*/
    this.icons = new Map()

    /** @type {Map<typeof Window, WindowConfig>} The types of windows that can be created and their defaults.*/
    this.windowTypes = envconfig.windowDefaults || new Map()

    // Page Environment Container
    this.environment = document.createElement('div')
    this.environment.id = 'window-environment'
    this.environment.style.cssText = `
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: ${this.background_color};
      background-image: url('${this.background_image}');
      background-size: cover;
    `

    // Taskbar DOM element
    this.taskbar = document.createElement('div')
    this.taskbar.id = 'taskbar'
    this.taskbar.style.cssText = `
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
      background-color: ${this.taskbar_background_color};
      color: ${this.taskbar_text_color};
      overflow: hidden;
      cursor: default;
    `

    // Icon container DOM element
    this.iconContainer = document.createElement('div')
    this.iconContainer.id = 'icon-container'
    this.iconContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 40px);
      z-index: ${this.zIndexBase - 1};
      pointer-events: auto;
    `

    this.environment.appendChild(this.iconContainer)

    this.taskbarButtonContainer = document.createElement('div')
    this.taskbarButtonContainer.id = 'taskbar-button-container'
    this.taskbarButtonContainer.style.cssText = `
      display: flex;
      overflow-x: hidden;
      height: 25px;
      min-width: 2px;
      padding: 2px 5px;
      justify-content: end;
      margin-left: 0px;
      align-items: center;
    `

    // Add default icons
    this.taskbar.appendChild(this.taskbarButtonContainer)
    this.addTaskbarIcons(envconfig.taskbarItems || [])
    this.addDesktopIcons(envconfig.icons || [], envconfig.iconLoadDelay || 5)
    this.createScrollButtons()

    this.notificationContainer = document.createElement('div')
    this.notificationContainer.id = 'notification-container'
    this.notificationContainer.style.cssText = `
      display: flex;
      overflow-x: hidden;
      flex-grow: 1;
      height: 25px;
      min-width: 2px;
      max-width: 20vw;
      box-shadow: rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset;
      padding: 2px 5px;
      justify-content: end;
      margin-left: auto;
      align-items: center;
    `

    this.datetime = new Date()
    const time = document.createElement('div')
    time.textContent = this.datetime.toLocaleTimeString()
    time.style.cssText = `
      font-size: 14px;
      color: rgb(0, 0, 0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
    this.notificationContainer.appendChild(time)

    this.taskbar.appendChild(this.notificationContainer)
    setInterval(() => {
      this.datetime.setSeconds(this.datetime.getSeconds() + 1)
      time.textContent = this.datetime.toLocaleTimeString()
    }, 1000)
    // Bind methods
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.saveState = this.saveState.bind(this)

    // Global event listeners
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('beforeunload', this.saveState)

    // Append environment to the document
    document.body.appendChild(this.environment)
    // Append taskbar to the environment container
    this.environment.appendChild(this.taskbar)

    // Load up the startup windows from config
    if (envconfig.startupWindows) {
      envconfig.startupWindows.forEach((config, title) => {
        if (config.openOnStart) {
          this.newWindow(config?.type | Window, config)
        }
      })
    }
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
      background: ${this.taskbar_background_color};
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
    this.taskbar.appendChild(this.leftScrollButton)

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

    this.taskbar.appendChild(this.taskbarScrollContainer)

    // Right scroll button
    this.rightScrollButton = document.createElement('button')
    this.rightScrollButton.innerHTML = '&#10095;'  // Right chevron
    this.rightScrollButton.style.cssText = `
      right: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      min-width: 12px;
      background: ${this.taskbar_background_color};
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
    this.taskbar.appendChild(this.rightScrollButton)

    // Initialize scroll state
    this.updateScrollButtons()
  }

  scroll(amount) {
    this.taskbarScrollContainer.scrollBy({
      left: amount,
      behavior: 'smooth'
    })
    
    // Update scroll button states after a short delay
    setTimeout(() => this.updateScrollButtons(), 50)
  }

  updateScrollButtons() {
    const container = this.taskbarScrollContainer
    const scrollLeft = container.scrollLeft
    const scrollWidth = container.scrollWidth
    const clientWidth = container.clientWidth

    // Update left button
    this.leftScrollButton.style.opacity = scrollLeft > 0 ? 1 : 0

    // Update right button
    this.rightScrollButton.style.opacity = 
      (scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth) ? 1 : 0
  }

  /**
   * Add default taskbar icons from configuration.
   * @param {TaskbarButtonConfig[]} icons - Array of taskbar button configurations to be added.
   * @returns {void}
   */
  addTaskbarIcons (icons) {
    icons.forEach(iconConfig => {
      const taskbarIcon = this.createTaskbarIcon(iconConfig)
      this.taskbarButtonContainer.appendChild(taskbarIcon)
    })
  }

  /**
   * @param {IconConfig | Icon} config - The configuration for the icon to be added.
   * @param {boolean} visible - Whether the icon should be visible or hidden.
   * @returns {Icon} - The created icon
   */
  addIcon (config, visible = true) {

    console.log(`Adding icon: ${config.title} of type: ${config.constructor.name}`)
    if (this.icons.has(config.title)) {
      console.warn(`Icon with title ${config.title} already exists. Skipping addition.`)
      return this.icons.get(config.title)
    }

    /** @type {Icon} */
    var icon

    if (!(config instanceof Icon)) {
      console.log('Creating new Icon instance for:', config.title)
      icon = new Icon(config.title,
                      config.image,
                      config.onhover,
                      config.clickhandler
                    )
      icon.setPosition(config.x, config.y)
    }
    else {
      console.log('Using existing Icon instance for:', config.title)
      icon = config
    }

    this.icons.set(config.title, icon)
    icon.element.style.display = visible ? 'block' : 'none'
    this.iconContainer.appendChild(icon.element)
    return icon
  }

  /**
   * Add icons from list to the desktop with a staggered delay.
   * @param {IconConfig[] | Icon[]} configs - Array of icon/configurations to be added.
   * @param {number} delay - Delay in milliseconds between loading each icon.
   * @returns {void}
   */
  addDesktopIcons (configs, delay = 5) {
    /** @type {Icon[]} */
    const iconArray = new Array(configs.length).fill(null)

    if (!Array.isArray(configs) || configs.length === 0) {
      console.error('Configs must be an array of IconConfig or Icon objects.')
      return
    }

    var index = 0
    configs.forEach(iconConfig => {
      const icon = this.addIcon(iconConfig, false)
      iconArray[index] = icon
      index++
    })

    index = 0
    const interval = setInterval(() => {
      const icon = iconArray[index]
      icon.element.style.display = 'block'
      index++
      if (index >= configs.length) {
        clearInterval(interval)
        return
      }
    }, delay)
  }

  /**
   * Create a taskbar icon element.
   * @param {TaskbarButtonConfig} iconfig - The config for the taskbar icon to be created.
   * @returns {HTMLButtonElement} - The created taskbar icon element.
   */
  createTaskbarIcon (iconfig) {
    const callback = iconfig.clickhandler
    const title = iconfig.title

    const taskbarItem = document.createElement('button')
    taskbarItem.id = `taskbar-item-${title.toLowerCase()}`
    taskbarItem.className = 'taskbar-item'
    taskbarItem.style.padding = '0 10px'
    taskbarItem.style.cursor = 'pointer'
    taskbarItem.whiteSpace = 'nowrap'
    taskbarItem.style.display = 'flex'
    taskbarItem.style.alignItems = 'center'
    taskbarItem.style.fontSize = '1rem'
    taskbarItem.style.whiteSpace = 'nowrap'
    taskbarItem.style.minWidth = '20px'
    taskbarItem.style.textOverflow = 'ellipsis'
    taskbarItem.style.overflow = 'hidden'
    taskbarItem.textContent = title

    if (callback) taskbarItem.onclick = callback

    return taskbarItem
  }

  /**
   * Pin a given window to the taskbar.
   * @param {Window} window 
   */
  pinWindow (window) {
    const taskbarItem = document.createElement('button')
    taskbarItem.className = `taskbar-item taskbar-item-${window.id}`
    taskbarItem.style.padding = '0 10px'
    taskbarItem.style.cursor = 'pointer'
    taskbarItem.whiteSpace = 'nowrap'
    taskbarItem.style.display = 'flex'
    taskbarItem.style.alignItems = 'center'
    taskbarItem.style.fontSize = '1rem'
    taskbarItem.style.whiteSpace = 'nowrap'
    taskbarItem.style.minWidth = '20px'
    taskbarItem.style.textOverflow = 'ellipsis'
    taskbarItem.style.overflow = 'hidden'
    taskbarItem.textContent = window.title
    taskbarItem.onclick = () => window.toggleMinimize()
    this.taskbarScrollContainer.appendChild(taskbarItem)
    this.taskbarWindowButtons.set(window.id, taskbarItem)
    this.updateScrollButtons()
  }

  /**
   * Destroy a window instance and remove its icon from the taskbar.
   * @param {Window} window 
   */
  removeWindow (window) {
    if (!this.windows.has(window.id)) return

    this.windows.delete(window.id)
    this.environment.removeChild(window.element)

    this.taskbarScrollContainer.removeChild(this.taskbarWindowButtons.get(window.id))
    this.taskbarWindowButtons.delete(window.id)

    window.destroy()

    this.updateZIndices()
    this.saveState()

    this.updateScrollButtons()
  }

  /**
   * Check if a window with the same title already exists.
   * @param {WindowConfig} config - window configuration object
   * @returns {Window|null} existing window instance or null
   */
  windowAlreadyExists (config) {
    for (const win of this.windows.values()) {
      console.log(`Checking existing window: ${win.title} against new window: ${config.title}`)
      if (win.title.toLowerCase() === config.title.toLocaleLowerCase()) {
        return win
      }
    }
    return null
  }

  /**
   * Create a new window and add it to the environment
   * @param {typeof Window} WindowClass - window class/subclass type
   * @param {WindowConfig} config - window configuration object
   * @returns {Window} window instance
   */
  newWindow (WindowClass = Window, config = {}) {
    var win = this.windowAlreadyExists(config)
    if (win && (win.singleInstance || config.singleInstance)) {
      if (win.minimized) win.toggleMinimize()
    }
    else {
      var win = this.createWindow(crypto.randomUUID(), WindowClass, config)
      this.pinWindow(win)
    }
    this.bringToFront(win)
    this.saveState()
    return win
  }

  
  /**
   * Factory method for creating windows by passed type.
   * @param {string} id - unique window id
   * @param {WindowConfig} config - window configuration object
   * @param {typeof Window} WindowClass - window class/subclass type
   * @returns {Window} window or window subclass
   */
  createWindow (
    id,
    WindowClass = Window,
    config = {}
  ) {

    if (this.windows.has(id)) {
      console.error(`Window with id ${id} already exists. Skipping creation.`)
      return this.windows.get(id)
    }

    // Check if window class is registered in windowTypes
    if (!this.windowTypes.has(WindowClass.name)) {
      console.log(`>> ${WindowClass.name} class not registered in windowTypes`)
      
      // Check for window class inheritence
      if (WindowClass.prototype instanceof Window) {
        console.log('>>> Window class is a subclass of Window - Registering new Type')
        this.windowTypes.set(WindowClass, {
          width: config.width || 600,
          height: config.height || 400,
          title: config.title || '',
          icon: config.icon || '',
          styles: config.styles || {},
          events: config.events || {},
          savedstate: config.savedState || {}
        })
      } else {
        console.error('>>>Window class is not a subclass of Window - Using default Window class.')
        WindowClass = Window
      }

    } else {
      // Merge config with default config - if attributes are missing, use default
      const defaultconfig = this.windowTypes.get(WindowClass.name)
      for (const defaultKey in defaultconfig) {
        config[defaultKey] = config[defaultKey] || defaultconfig[defaultKey]
      }
    }

    const newWindow = new WindowClass(id, config)

    if (config.events) {
      Object.entries(config.events).forEach(([event, handler]) => {
        newWindow.on(event, handler)
      })
    }

    // Set up event listeners
    newWindow.on('close', (win) => this.removeWindow(win))
    newWindow.on('focus', (win) => this.bringToFront(win))
    newWindow.on('dragStart', () => this.startDragging(newWindow))
    newWindow.on('minimize', () => this.saveState())
    newWindow.on('drag', () => this.saveState())
    newWindow.on('dragEnd', () => this.saveState())
    newWindow.on('popup', (data) => this.newWindow(`${crypto.randomUUID()}-${id}`, data, Popup))
    newWindow.on('changeTaskbarTitle', (data) => {this.taskbarWindowButtons.get(data.id).textContent = data.title})
  
    this.windows.set(newWindow.id, newWindow)
    this.environment.appendChild(newWindow.element)
    this.updateZIndices()
    this.saveState()

    return newWindow
  }


  /**
   * Bring a window to the front of the z-index stack.
   * @param {Window} window 
   */
  bringToFront (window) {
    const windowArray = Array.from(this.windows.values())
    const index = windowArray.indexOf(window)
    if (index !== -1) {
      windowArray.splice(index, 1)
      windowArray.push(window)
      this.windows.clear()
      windowArray.forEach(w => this.windows.set(w.id, w))
      this.updateZIndices()
      this.saveState()
    }
  }

  updateZIndices () {
    let index = 0
    this.windows.forEach(window => {
      window.setZIndex(this.zIndexBase + index)
      index++
    })
  }

  startDragging (window) {
    this.currentlyDragging = window
    this.bringToFront(window)
  }

  onMouseMove (event) {
    if (this.currentlyDragging) {
      this.currentlyDragging.drag(event)
    }
  }

  onMouseUp (event) {
    if (this.currentlyDragging) {
      this.currentlyDragging.dragEnd(event)
      this.currentlyDragging = null
    }
  }

  saveState () {
    const state = {
      windows: Array.from(this.windows.values()).map(window => ({
        ...window.getState(),
        className: window.constructor.name // Store the class name
      }))
    }
    localStorage.setItem('windowEnvironmentState', JSON.stringify(state))
  }

  clearSavedState () {
    localStorage.removeItem('windowEnvironmentState')
  }


}
