import Window from './window.js'
import WindowConfig from './window.js'
import ChatWindow from './chat.js'
import EmojiSelector from './emojiselector.js'
import Popup from './timedwindow.js'
import Icon from './Icon.js'

/**
 * Environment class for managing windows and icons in a desktop-like environment.
 * @class
 */
export default class Environment {

  /**
   * @param {boolean} autoRestore
   * @returns {Environment}
   * @constructor
   */
  constructor (autoRestore = false) {
    this.windows = new Map()
    this.icons = new Map()
    this.zIndexBase = 1000
    this.username = 'Anonymous-' + Math.floor(Math.random() * 1000)

    // Set default colors
    this.background_color = '#FAF9F6'
    this.taskbar_background_color = '#c0c0c0'
    this.taskbar_text_color = '#fff'

    /**
     * @property {typeof Window, WindowConfig>} windowTypes - The types of windows that can be created
     */
    this.windowTypes = new Map([
      [Window.name, {
        width: 600,
        height: 400,
        icon: '',
        title: 'Window',
        content: '',
        styles: {},
        events: {},
        savedstate: {}
      }],
      [ChatWindow.name, {
        width: 600,
        height: 400,
        icon: '',
        title: 'Chat',
        channel: 'general',
        username: 'Anonymous',
        content: '',
        styles: {},
        events: {
          toggleEmojis: () => this.toggleEmojis(window),
          usernameChanged: (username) => {this.username = username}
        },
        savedstate: {}
      }],
      [Popup.name, {
        width: 300,
        height: 200,
        icon: '',
        title: 'Popup',
        content: '',
        styles: {},
        events: {},
        savedstate: {}
      }],
      [EmojiSelector.name, 
        {
          width: 300,
          height: 400,
          icon: '',
          title: 'Emojis',
          content: '',
          styles: {},
          events: {},
          savedstate: {}
        }
      ]
    ]);

    // Add custom font for code blocks
    const fontLink = document.createElement('link')
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    // Page Environment Container
    this.environment = document.createElement('div')
    this.environment.id = 'window-environment'
    this.environment.style.cssText = `
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: ${this.background_color};
      background-image: url('images/bg.png');
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
      z-index: 9999;
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

    // Add default icons
    this.addDefaultTaskbarIcons()
    this.addDefaultIcons()
    this.createScrollButtons()

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

    const time = document.createElement('div')
    time.textContent = new Date().toLocaleTimeString()
    time.style.fontSize = '14px'
    time.style.color = 'rgb(0, 0, 0)'
    time.style.fontFamily = '"Pixelated MS Sans Serif", Arial'
    time.style.whiteSpace = 'nowrap'
    time.style.overflow = 'hidden'
    time.style.textOverflow = 'ellipsis'
    this.notificationContainer.appendChild(time)
    this.taskbar.appendChild(this.notificationContainer)

    // Bind methods
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.saveState = this.saveState.bind(this)

    // Global event listeners
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
    window.addEventListener('beforeunload', this.saveState)

    if (autoRestore && localStorage.getItem('windowEnvironmentState')) {
      this.restoreState()
    }

    // Append environment to the document
    document.body.appendChild(this.environment)
    // Append taskbar to the environment container
    this.environment.appendChild(this.taskbar)
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

  addDefaultTaskbarIcons () {
    const icon1 = this.createTaskbarIcon('Home', Window, null)
    this.taskbar.appendChild(icon1)
    const icon2 = this.createTaskbarIcon('Projects', Window, null)
    this.taskbar.appendChild(icon2)
    const icon3 = this.createTaskbarIcon('About Me', Window, null)
    this.taskbar.appendChild(icon3)
    const icon4 = this.createTaskbarIcon('Contact', Window, null)
    this.taskbar.appendChild(icon4)
    const icon5 = this.createTaskbarIcon('Source', Window, null)
    this.taskbar.appendChild(icon5)
  }

  /**
   * 
   * @param {Object} config 
   * @returns 
   */
  addIcon (config) {
    const icon = new Icon(config.title,
                          config.image,
                          config.onhover,
                          () => this.newWindow(config.type, config),
                          config.timed)
    icon.setPosition(config.x, config.y)
    this.iconContainer.appendChild(icon.element)
    this.icons.set(config.title, icon)
    return icon
  }

  addDefaultIcons () {
    const defaultIcons = [
      {
        title: 'Welcome',
        image: 'images/clippy.gif',
        onhover: 'images/clippy_closeup.gif',
        x: 20,
        y: 80,
        type: Window,
        height: 400,
        width: 550,
        content: "<img src = 'images/clippy.gif'/>"
      }
    ]

    defaultIcons.forEach(icon => {
      this.addIcon(icon)
    })
  }

  createTaskbarIcon (title, WindowClass, config) {
    const taskbarItem = document.createElement('button')
    taskbarItem.className = 'taskbar-item'
    taskbarItem.style.padding = '0 10px'
    taskbarItem.style.cursor = 'pointer'
    taskbarItem.whiteSpace = 'nowrap'
    taskbarItem.style.display = 'flex'
    taskbarItem.style.alignItems = 'center'
    taskbarItem.style.fontSize = '14px'
    taskbarItem.style.whiteSpace = 'nowrap'
    taskbarItem.style.minWidth = '20px'
    taskbarItem.style.textOverflow = 'ellipsis'
    taskbarItem.style.overflow = 'hidden'
    taskbarItem.textContent = title
    taskbarItem.onclick = () => this.newWindow(WindowClass, config || this.windowTypes.get(WindowClass.name))
    return taskbarItem
  }

  pinWindow (window) {
    const taskbarItem = document.createElement('button')
    taskbarItem.className = 'taskbar-item'
    taskbarItem.style.padding = '0 10px'
    taskbarItem.style.cursor = 'pointer'
    taskbarItem.whiteSpace = 'nowrap'
    taskbarItem.style.display = 'flex'
    taskbarItem.style.alignItems = 'center'
    taskbarItem.style.fontSize = '14px'
    taskbarItem.style.whiteSpace = 'nowrap'
    taskbarItem.style.minWidth = '20px'
    taskbarItem.style.textOverflow = 'ellipsis'
    taskbarItem.style.overflow = 'hidden'
    taskbarItem.textContent = window.title
    taskbarItem.onclick = () => window.toggleMinimize()
    this.taskbarScrollContainer.appendChild(taskbarItem)
    this.icons.set(window.id, taskbarItem)
    // Update scroll buttons after adding new item
    this.updateScrollButtons()
  }

  removeWindow (window) {
    console.log('Removing window:', window.id)
    if (this.windows.has(window.id)) {
      this.windows.delete(window.id)
      this.environment.removeChild(window.element)

      this.taskbarScrollContainer.removeChild(this.icons.get(window.id))
      this.icons.delete(window.id)

      window.destroy()

      this.updateZIndices()
      this.saveState()

      this.updateScrollButtons()
    }
  }

  /**
   * Create a new window and add it to the environment
   * @param {typeof Window} WindowClass - window class/subclass type
   * @param {WindowConfig} config - window configuration object
   */
  newWindow (WindowClass = Window, config = {}) {
    const window = this.createWindow(crypto.randomUUID(), WindowClass, config)
    this.pinWindow(window)
    this.bringToFront(window)
    this.updateZIndices()
    this.saveState()
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


    // Check if window with this id already exists
    if (this.windows.has(id)) {
      console.error(`Window with id ${id} already exists. Skipping creation.`)
      return this.windows.get(id)
    }

    // Check if window class is registered in windowTypes
    if (!this.windowTypes.has(WindowClass.name)) {
      console.error(`${WindowClass.name} class not registered in windowTypes`)
      
      // Check for window class inheritence
      if (WindowClass.prototype instanceof Window) {
        console.warn('Window class is a subclass of Window - Registering new Type')
        this.windowTypes.set(WindowClass, {
          width: config.width || 600,
          height: config.height || 400,
          title: config.title || '',
          icon: config.icon || '',
          styles: config.styles || {},
          events: config.events || {},
          savedstate: config.savedstate || {}
        })
      } else {
        console.error('Window class is not a subclass of Window - Using default Window class.')
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

    Object.entries(config.events).forEach(([event, handler]) => {
      newWindow.on(event, handler)
    })

    // Set up event listeners
    newWindow.on('close', (win) => this.removeWindow(win))
    newWindow.on('focus', (win) => this.bringToFront(win))
    newWindow.on('dragStart', () => this.startDragging(newWindow))
    newWindow.on('minimize', () => this.saveState())
    newWindow.on('drag', () => this.saveState())
    newWindow.on('dragEnd', () => this.saveState())
    newWindow.on('popup', (data) => this.newWindow(`${crypto.randomUUID()}-${id}`, data, Popup))

    this.windows.set(newWindow.id, newWindow)
    this.environment.appendChild(newWindow.element)
    this.updateZIndices()
    this.saveState()

    return newWindow
  }

  toggleEmojis (window) {
    if (!window.emojiSelector) {
      window.emojiSelector = this.createWindow(
        `emoji-${this.id}`,
        '',
        '',
        300,
        400,
        null,
        EmojiSelector
      )

      window.initEmojiSelector()
      this.bringToFront(window.emojiSelector)
    } else {
      // If already open, close it
      window.emojiSelector.emit('close')
      window.emojiSelector = null
    }
  }

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

  async restoreState () {
    try {
      const savedState = localStorage.getItem('windowEnvironmentState')
      if (savedState) {
        const state = JSON.parse(savedState)
        for (const windowState of state.windows) {
          // Import the appropriate window class based on the saved className
          const WindowClass = windowState.className // Default to base Window class
          this.createWindow(
            windowState.id,
            windowState.title,
            windowState.content,
            windowState.width,
            windowState.height,
            windowState,
            WindowClass
          )
        }
      }
    } catch (error) {
      console.error('Error restoring window state:', error)
    }
  }

  clearSavedState () {
    localStorage.removeItem('windowEnvironmentState')
  }
}
