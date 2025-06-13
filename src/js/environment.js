import {Window} from './Windows/window.js'
import Popup from './Windows/timedwindow.js'
import {Icon} from './Icon.js'
import MusicPlayer from './Windows/musicplayer.js'

/** @import {WindowConfig} from './Windows/window.js' */
/** @import {IconConfig} from './Icon.js' */
/** @import {TaskbarConfig} from './Taskbar.js'*/



/**
 * @typedef EnvironmentConfig
 * @property {string} bgc - The background color of the environment.
 * @property {TaskbarConfig} taskbar - The configuration for the taskbar.
 * @property {Map<typeof Window, WindowConfig>} windowTypes - The types of windows that can be created and their defaults.
 * @property {Map<string, WindowConfig>} defaultConfigs - The default configurations for windows.
 */



/**
 * Environment class for managing windows and icons in a desktop-like environment.
 * @class Environment
 * @constructor
 * @public
 */
export default class Environment {
  constructor () {
    /**
     * A Map of windows by id
     * @type {Map<string, Window>}
     */
    this.windows = new Map()

    /**
     * A Map of icons by title
     * @type {Map<string, Icon>}
     */
    this.icons = new Map()

    /**@type {number}*/
    this.zIndexBase = 100
    /**@type {string}*/
    this.background_color = '#FAF9F6'
    /**@type {string}*/
    this.taskbar_background_color = '#c0c0c0'
    /**@type {string}*/
    this.taskbar_text_color = '#fff'

    /**
     * @property {typeof Window, WindowConfig>} windowTypes - The types of windows that can be created and their defaults.
     */
    this.windowTypes = new Map([
      [Window.name, {}],
      [Popup.name, {}],
      [MusicPlayer.name, {}]
    ])

    /** @type {Map<string, WindowConfig>} - default windows and their configs */
    this.defaultConfigs = new Map([
      [
        "welcome",
        {
          height: 600,
          width: 500,
          x: 50,
          y: 50,
          icon: null,
          title: 'Welcome!',
          content: '<p>This is a test</p>',
          initialURL: '/welcome',
          styles: {
            minHeight: '10px',
            minWidth: '10px'
          }
        }
      ],
      [
        "music",
        {
          width: 400,
          height: 400,
          x: 50,
          y: 50,
          icon: null,
          title: 'Win98 Music Player',
          content: '<div id="music-player"></div>',
          tracks: [{title: 'Bill_Nye - Tadj Cazaubon & Violet Mirrors',
                    url: '/audio/Bill_Nye.wav'},
                   {title: 'Jello - WayKool',
                    url: '/audio/jello.mp3'},
                   {title: 'Weather - Tadj Cazaubon & Violet Mirrors',
                    url: '/audio/Weather.wav'},
                   {title: 'Boomer - Violet Mirrors',
                    url: '/audio/boomer.wav'},
                   {title: 'In Awe of The Machine - Tadj Cazaubon & Violet Mirrors',
                    url: '/audio/machine.wav'}],
          styles: {
            titlebar_fontsize: '12px',
            minHeight: '10px',
            minWidth: '10px'
          }
        }
      ],
      [
        "projects",
        {
          height: 925,
          width: 730,
          x: 50,
          y: 50,
          icon: null,
          title: 'Projects!',
          content: '<p>Projects</p>',
          initialURL: '/projects'
        }
      ],
      [
        "contact",
        {
          height: 500,
          width: 400,
          icon: null,
          title: 'Contact',
          content: '<p>Contact</p>',
          initialURL: '/contact',
          styles: {
              minHeight: '550px',
              minWidth: '300px'
          }
        }
      ],
      [
        "about",
        {
          height: 600,
          width: 600,
          icon: null,
          title: 'Who I Am',
          content: '<p>About</p>',
          initialURL: '/about',
          styles: {
            minHeight: '550px',
            minWidth: '300px'
          }
        }
      ],
      [
        "popup",
        {
          height: 100,
          width: 300,
          icon: "/icons/messages.png",
          title: 'Message',
          content: '<p>This is a popup message</p>',
          styles: {}
        }
      ],
      [
        "doom",
        {
          height: 600,
          width: 1000,
          icon: "icons/doom.png",
          title: 'Doom',
          content: '<p>Doom</p>',
          initialURL: '/doom',
          styles: {
            minHeight: '10px',
            minWidth: '10px'
          }
        }
      ]
    ])

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

    this.datetime = new Date()
    const time = document.createElement('div')
    time.textContent = this.datetime.toLocaleTimeString()
    time.style.fontSize = '14px'
    time.style.color = 'rgb(0, 0, 0)'
    time.style.whiteSpace = 'nowrap'
    time.style.overflow = 'hidden'
    time.style.textOverflow = 'ellipsis'
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
    const icon1 = this.createTaskbarIcon('Welcome', Window, this.defaultConfigs.get('welcome'))
    this.taskbar.appendChild(icon1)

    const icon2 = this.createTaskbarIcon('Projects', Window, this.defaultConfigs.get('projects'))                                                  
    this.taskbar.appendChild(icon2)
    
    const icon4 = this.createTaskbarIcon('Contact', Window, this.defaultConfigs.get('contact'))
    this.taskbar.appendChild(icon4)

    const icon5 = this.createTaskbarIcon('Source', null, null, () => globalThis.window.open('https://github.com/sudoDeVinci/devinci.cloud-frontend'))
    this.taskbar.appendChild(icon5)

    const icon6 = this.createTaskbarIcon('About', Window, this.defaultConfigs.get('about'))
    this.taskbar.appendChild(icon6)
  }

  /**
   * @param {IconConfig} config 
   * @returns {Icon} - The created icon
   */
  addIcon (config) {
    console.log('Adding icon:', config.title)
    const icon = new Icon(config.title,
                          config.image,
                          config.onhover,
                          config.clickhandler
                        )
    icon.setPosition(config.x, config.y)
    this.icons.set(config.title, icon)
    this.iconContainer.appendChild(icon.element)
    return icon
  }

  addDefaultIcons () {

    /**@type {IconConfig[]} - Default icons to be added to the desktop*/
    const defaultIcons = [
      {
        title: 'Welcome',
        image: 'images/clippy.gif',
        onhover: 'images/clippy_closeup.gif',
        x: 20,
        y: 50,
        clickhandler: () => this.newWindow(Window, this.defaultConfigs.get('welcome'))
      },
      {
        title: 'Current Projects',
        image: 'icons/console.png',
        onhover: 'icons/console.png',
        x: 20,
        y: 175,
        content: "",
        clickhandler: () => this.newWindow(Window, this.defaultConfigs.get('projects'))
      },
      {
        title: 'Music',
        image: 'icons/music.png',
        onhover: 'icons/music.png',
        x: 20,
        y: 300,
        clickhandler: () => this.newWindow(MusicPlayer, this.defaultConfigs.get('music'))
      },
      {
        title: 'Doom',
        image: 'icons/doom.png',
        onhover: 'icons/doom.png',
        x: 20,
        y: 425,
        clickhandler: () => this.newWindow(Window, this.defaultConfigs.get('doom'))
      }
    ]

    defaultIcons.forEach(icon => {
      this.addIcon(icon)
    })
  }

  /**
   * 
   * @param {string} title 
   * @param {typeof Window} WindowClass 
   * @param {WindowConfig} config 
   * @param {Function} callback 
   * @returns 
   */
  createTaskbarIcon (title, WindowClass, config, callback=null) {
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
    else taskbarItem.onclick = () => this.newWindow(WindowClass, config)
    return taskbarItem
  }

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
    this.icons.set(window.id, taskbarItem)
    // Update scroll buttons after adding new item
    this.updateScrollButtons()
  }

  /**
   * Destroy a window instance and remove its icon from the taskbar.
   * @param {Window} window 
   */
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
   * Export the current icon configuration of a window, then add it to the environment.
   * The icon will act as a shortcut to the window.
   * @param {Window} window - The window to export the icon for
   */
  exportIconConfig (window) {
    const config = {
      title: window.title,
      image: window.icon,
      onhover: window.icon,
      x: 20,
      y: 50,
      clickhandler: () => this.newWindow(typeof window, window.getConfig())
    }
    this.addIcon(config)
  }

  /**
   * Create a new window and add it to the environment
   * @param {typeof Window} WindowClass - window class/subclass type
   * @param {WindowConfig} config - window configuration object
   * @returns {Window} window instance
   */
  newWindow (WindowClass = Window, config = {}) {
    const win = this.createWindow(crypto.randomUUID(), WindowClass, config)
    this.pinWindow(win)
    this.bringToFront(win)
    this.updateZIndices()
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


    // Check if window with this id already exists
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
    newWindow.on('exportIconConfig', () => this.exportIconConfig(newWindow))
    newWindow.on('changeTaskbarTitle', (data) => {this.icons.get(data.id).textContent = data.title})
  
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
