/** @import {IconConfig} from '../Icon.js' */

/**
 * @typedef {Object} WindowConfig
 * @property {number} width - Default window width
 * @property {number} height - Default window height
 * @property {number} x - Default window x position
 * @property {number} y - Default window y position
 * @property {number} zIndex - Default window z-index
 * @property {boolean} isMinimized - Whether the window is minimized
 * @property {string} icon - Icon path
 * @property {string} title - Window title
 * @property {string} content - Window content
 * @property {string} initialURL - Initial URL to fetch window contents from
 * @property {Object} [styles] - Styles for the window
 * @property {Object.<string, Function[]>} [events] - Event listeners & callbacks
 * @property {Object} [savedState] - Saved window state
 */


/**
 * Base event emitter class for handling window events
 */
class EventEmitter {
  /**
     * @private
     * @type {object.<string, Function[]>}
     */
  #listeners = {}

  /**
   * Register an event listener
   * @param {string} event - The event name to listen for
   * @param {Function} callback - The callback function to execute
   */
  on (event, callback) {
    if (!this.#listeners[event]) this.#listeners[event] = []
    this.#listeners[event].push(callback)
  }

  /**
   * Emit an event to all registered listeners
   * @param {string} event - The event name to emit
   * @param {*} [data] - Optional data to pass to the listeners
   */
  emit (event, data) {
    if (this.#listeners[event]) this.#listeners[event].forEach(callback => callback(data))
  }
}

/**
 * Represents a draggable window component with a title bar and content area
 * @extends EventEmitter
 * @fires Window#close
 * @fires Window#focus
 * @fires Window#dragStart
 * @fires Window#drag
 * @fires Window#dragEnd
 * @fires Window#minimize
 */
export default class Window extends EventEmitter {

  /**
	 * @private
	 * @property WindowConfig
	 */
	#config

  /**
   * Create a new Window instance with the provided configuration.
   * @param {string} Id - The window identifier
   * @param {WindowConfig} config - The window configuration
   */
  constructor (Id, config) {
    super()
		this.#config = config
		this.id = Id
		this.width = Math.min(this.#config.width, window.innerWidth - 100)
		this.height = Math.min(this.#config.height, window.innerHeight - 100)
    this.title = this.#config.title
    this.content = this.#config.content
    this.zIndex = this.#config.zIndex || 1
		this.isMinimized = config.isMinimized || false
		this.icon = config.icon || null
    this.isDragging = false
		this.isResizing = false
    this.initialX = 0
    this.initialY = 0
    this.initialMouseX = 0
    this.initialMouseY = 0
    this.children = []


		this.x = config.x || 70
		this.y = config.y || 75
		this.#createElement()

		if (this.isMinimized) this.minimize()

		window.addEventListener('resize', this.handleResize.bind(this))
		this.createResizeHandles()
  }

  /**
   * Creates the DOM elements for the window
   * @private
   */
  async #createElement () {
    this.element = document.createElement('div')
    this.element.className = 'window'
    this.element.style.position = 'fixed'
    this.element.style.left = `${this.x}px`
    this.element.style.top = `${this.y}px`
    this.element.style.width = `${this.width}px`
    this.element.style.height = `${this.height}px`
    this.element.style.overflow = 'hidden'
    this.element.style.display = 'flex'
    this.element.style.flexDirection = 'column'

    for (const key in this.#config.styles) {
      this.element.style[key] = this.#config.styles[key]
    }


    this.titleBar = document.createElement('div')
    this.titleBar.className = 'window-title-bar title-bar'
    this.titleBar.style.cursor = 'move'
    this.titleBar.style.userSelect = 'none'
    this.titleBar.style.display = 'flex'
    this.titleBar.style.justifyContent = 'space-between'
		this.titleBar.style.padding = '5px 8px'
    this.titleBar.style.alignItems = 'center'
    this.titleBar.style.flexShrink = '0'

    this.titleText = document.createElement('div')
    this.titleText.className = 'window-title-bar-text title-bar-text'
    this.titleText.textContent = this.title
    this.titleText.style.fontSize = '1rem'
    this.titleBar.appendChild(this.titleText)

		const buttonContainer = document.createElement('div')
    buttonContainer.className = 'title-bar-controls'
    buttonContainer.style.display = 'flex'

    this.minimizeButton = document.createElement('button')
    this.minimizeButton.className = 'window-minimize-button'
    this.minimizeButton.ariaLabel = 'Minimize'

    this.minimizeButton.onclick = e => {
      e.stopPropagation()
      this.toggleMinimize()
    }

    buttonContainer.appendChild(this.minimizeButton)

		this.closeButton = document.createElement('button')
    this.closeButton.className = 'window-close-button'
    this.closeButton.ariaLabel = 'Close'
    
    this.closeButton.onclick = e => {
      e.stopPropagation()
      this.emit('close', this)
    }
    buttonContainer.appendChild(this.closeButton)
    this.titleBar.appendChild(buttonContainer)

		this.contentArea = document.createElement('div')
    this.contentArea.className = 'window-content window-body'
    this.contentArea.innerHTML = this.content
    this.contentArea.style.overflow = 'auto'
    this.contentArea.style.flexGrow = '1'
    this.contentArea.style.position = 'relative'
    this.contentArea.style.padding = '10px'
    this.contentArea.style.minWidth = 'fit-content'

    this.titleBar.onmousedown = e => {
      e.preventDefault()
      this.startDrag(e)
    }

    this.element.appendChild(this.titleBar)
    this.element.appendChild(this.contentArea)

    this.element.onclick = () => this.emit('focus', this)

    if (this.#config?.initialURL) await this.fetchWindowContents(this.#config.initialURL)
	}



  /**
   * Return a mix of the current state and the initial config
   * If the field is not in the config, use the current state
   * This also extends to optional fields such as events and styles.
   * @returns {WindowConfig} 
   */
  getConfig () {
    /**@type {WindowConfig} */
    const config = {...this.#config}
    const state = this.getState()
    return {...config, ...state}
  }
  
  /**
   * Creates resize handles for the window
   * @private
   */
  createResizeHandles () {
    const resizeHandles = [
      { cursor: 'nwse-resize', position: 'top-left', dx: -1, dy: -1 },
      { cursor: 'nesw-resize', position: 'top-right', dx: 1, dy: -1 },
      { cursor: 'nesw-resize', position: 'bottom-left', dx: -1, dy: 1 },
      { cursor: 'nwse-resize', position: 'bottom-right', dx: 1, dy: 1 }
    ]

    resizeHandles.forEach(handle => {
      const resizeHandle = document.createElement('div')
      resizeHandle.className = `resize-handle resize-${handle.position}`
      resizeHandle.style.cssText = `
        position: absolute;
        background: transparent;
        z-index: 10;
        cursor: ${handle.cursor};
      `

      // Position and size the resize handles
      switch (handle.position) {
        case 'top-left':
          resizeHandle.style.top = '-5px'
          resizeHandle.style.left = '-5px'
          resizeHandle.style.width = '15px'
          resizeHandle.style.height = '15px'
          break
        case 'top-right':
          resizeHandle.style.top = '-5px'
          resizeHandle.style.right = '-5px'
          resizeHandle.style.width = '15px'
          resizeHandle.style.height = '15px'
          break
        case 'bottom-left':
          resizeHandle.style.bottom = '-5px'
          resizeHandle.style.left = '-5px'
          resizeHandle.style.width = '15px'
          resizeHandle.style.height = '15px'
          break
        case 'bottom-right':
          resizeHandle.style.bottom = '-5px'
          resizeHandle.style.right = '-5px'
          resizeHandle.style.width = '15px'
          resizeHandle.style.height = '15px'
          break
      }

      // Add resize event listener
      resizeHandle.addEventListener('mousedown', (e) => this.startResize(e, handle.dx, handle.dy))

      this.element.appendChild(resizeHandle)
    })
  }

  /**
   * Handles window repositioning when browser window is resized
   * @private
   */
  handleResize () {
    // Ensure the window stays within the new viewport boundaries
    const maxX = Math.max(0, window.innerWidth - this.width)
    const maxY = Math.max(0, window.innerHeight - this.height)

    // Adjust x and y coordinates if they're now out of bounds
    this.x = Math.min(this.x, maxX)
    this.y = Math.min(this.y, maxY)

    // Update the window's position
    this.updatePosition()
  }

  /**
   * Initiates window dragging
   * @param {MouseEvent} event - The mousedown event
   * @fires Window#dragStart
   * @private
   */
  startDrag (event) {
    this.isDragging = true
    this.initialX = this.x
    this.initialY = this.y
    this.initialMouseX = event.clientX
    this.initialMouseY = event.clientY
    this.emit('dragStart', this)
  }

  /**
   * Updates window position during drag
   * @param {MouseEvent} event - The mousemove event
   * @fires Window#drag
   */
  drag (event) {
    if (!this.isDragging) return

    // Calculate the distance moved
    const deltaX = event.clientX - this.initialMouseX
    const deltaY = event.clientY - this.initialMouseY

    // Calculate new position
    let newX = this.initialX + deltaX
    let newY = this.initialY + deltaY

    // Constrain to viewport bounds
    newX = Math.max(0, Math.min(newX, window.innerWidth - this.width))
    newY = Math.max(20, Math.min(newY, window.innerHeight - this.height))

    this.x = newX
    this.y = newY
    this.updatePosition()
    /**
     * @event Window#drag
     * @type {Window}
     * @property {Window} window - The window instance that is being dragged
     */
    this.emit('drag', this)
  }

  /**
   * Ends the window dragging operation
   * @fires Window#dragEnd
   */
  dragEnd () {
    if (!this.isDragging) return
    this.isDragging = false
    /**
     * @event Window#dragEnd
     * @type {Window}
     * @property {Window} window - The window instance that was dragged
     */
    this.emit('dragEnd', this)
  }

  /**
   * Toggles the window's minimized state
   * @fires Window#minimize
   */
  toggleMinimize () {
    if (this.isMinimized) {
      this.restore()
    } else {
      this.minimize()
    }
    /**
     * @event Window#minimize
     * @type {Window}
     * @property {Window} window - The window instance that was minimized
     */
    this.emit('minimize', this)
  }

  /**
   * Minimizes the window
   */
  minimize () {
    this.isMinimized = true
    this.element.style.display = 'none'
  }

  /**
   * Restores the window from minimized state
   */
  restore () {
    this.isMinimized = false
    this.element.style.display = 'block'
  }

  /**
   * Updates the window's position on screen
   * @private
   */
  updatePosition () {
    this.element.style.left = `${this.x}px`
    this.element.style.top = `${this.y}px`
  }

  /**
   * Sets the window's z-index
   * @param {number} index - The z-index value
   */
  setZIndex (index) {
    this.zIndex = index
    this.element.style.zIndex = index
  }

  /**
	 * Get the window state as a WindowConfig object
	 * @returns {WindowConfig}
	 */
	getState () {
		return {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
			zIndex: this.zIndex,
			isMinimized: this.isMinimized,
			icon: this.icon,
			title: this.title,
			content: this.content,
			styles: this.#config.styles,
			events: this.#config.events,
		}
	}

  /**
   * Removes the window from the DOM
   */
  destroy () {
    this.element.remove()
  }

  /**
   * Initiates window resizing
   * @param {MouseEvent} event - The mousedown event
   * @param {number} dx - Horizontal resize direction (-1, 0, or 1)
   * @param {number} dy - Vertical resize direction (-1, 0, or 1)
   * @private
   */
  startResize (event, dx, dy) {
    event.stopPropagation()
    
    // Prevent text selection during resize
    event.preventDefault()

    // Store initial window state
    this.isResizing = true
    this.initialWidth = this.width
    this.initialHeight = this.height
    this.initialX = this.x
    this.initialY = this.y
    this.initialMouseX = event.clientX
    this.initialMouseY = event.clientY
    this.resizeDirX = dx
    this.resizeDirY = dy

    // Add global event listeners for resize
    document.addEventListener('mousemove', this.resize.bind(this))
    document.addEventListener('mouseup', this.endResize.bind(this))
  }

  /**
   * Handles window resizing
   * @param {MouseEvent} event - The mousemove event
   * @private
   */
  resize (event) {
    if (!this.isResizing) return

    // Calculate the distance moved
    const deltaX = event.clientX - this.initialMouseX
    const deltaY = event.clientY - this.initialMouseY

    // Calculate new dimensions and position
    let newWidth = this.initialWidth
    let newHeight = this.initialHeight
    let newX = this.x
    let newY = this.y

    // Horizontal resize
    if (this.resizeDirX !== 0) {
      newWidth = Math.max(200, this.initialWidth + (deltaX * this.resizeDirX))
      
      // Adjust X position for left-side resize
      if (this.resizeDirX < 0) {
        newX = this.initialX + (this.initialWidth - newWidth)
      }
    }

    // Vertical resize
    if (this.resizeDirY !== 0) {
      newHeight = Math.max(100, this.initialHeight + (deltaY * this.resizeDirY))
      
      // Adjust Y position for top-side resize
      if (this.resizeDirY < 0) {
        newY = this.initialY + (this.initialHeight - newHeight)
      }
    }

    // Constrain to viewport bounds
    newX = Math.max(0, Math.min(newX, window.innerWidth - newWidth))
    newY = Math.max(0, Math.min(newY, window.innerHeight - newHeight))

    // Update window properties
    this.width = newWidth
    this.height = newHeight
    this.x = newX
    this.y = newY

    // Update window styling
    this.element.style.width = `${this.width}px`
    this.element.style.height = `${this.height}px`
    this.updatePosition()
  }

  /**
   * Ends the window resizing operation
   * @private
   */
  endResize () {
    if (!this.isResizing) return

    this.isResizing = false

    // Emit resize event if needed
    this.emit('resize', this)
  }

  /**
     * @typedef {Object} TextFragment
     * @property {string} type
     * @property {string} content
     */


  /**
   * @param {string} text
   * @returns {TextFragment[]} Fragments of text
   * @description Splits text into code and text fragments
   */
  static parseMessageContent (text) {
    const fragments = []
    let currentIndex = 0
    const codeBlockRegex = /```([\s\S]*?)```/g

    let match
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        fragments.push({
          type: 'text',
          content: text.slice(currentIndex, match.index)
        })
      }

      // Add code block
      fragments.push({
        type: 'code',
        content: match[1].trim()
      })

      currentIndex = match.index + match[0].length
    }

    // Add remaining text
    if (currentIndex < text.length) {
      fragments.push({
        type: 'text',
        content: text.slice(currentIndex)
      })
    }

    return fragments
  }


  /**
   * Parse scripts as either inline or external and append to the content area.
   * @param {HTMLScriptElement[]} scripts 
   * @param {HTMLBodyElement} page
   */
  async handleScripts (scripts, page) {
    const outscripts = []

    for (const script of scripts) {
      // Handle inline scripts
      if (script.src === "" || !script.src) {
        outscripts.push(script.cloneNode(true))
        continue
      }

      try {
        const response = await fetch(script.src)
        const scriptElement = document.createElement('script')
        
        // Preserve original attributes
        for (const attr of script.attributes) {
          if (attr.name !== 'src') {
            scriptElement.setAttribute(attr.name, attr.value)
          }
        }
        
        scriptElement.textContent = await response.text()
        outscripts.push(scriptElement)
      } catch (err) {
        console.error('Failed to load external script:', err)
        // Fallback to original script with src
        outscripts.push(script.cloneNode(true))
      }
    }

    outscripts.forEach(script => page.appendChild(script))
  }


  /**
   * Parse linked stylesheets and append to the content area.
   * @param {HTMLLinkElement[]} styles
   * @param {HTMLBodyElement} page
   */
  async handleStyles (styles, page) {
    const outstyles = []

    for (const style of styles) {
      try {
        const response = await fetch(style.href)
        const styleElement = document.createElement('style')
        styleElement.textContent = await response.text()
        outstyles.push(styleElement)
      } catch (err) {
        console.error('Failed to load external stylesheet:', err)
      }
    }

    outstyles.forEach(style => page.appendChild(style))
  }


  /**
   * Fetch the contents of the window from a URL.
   * @param {string} url - URL to fetch window contents from
   */
  async fetchWindowContents(url) {
    const oldTitle = this.title
    const oldContent = this.content

    this.title = 'Loading...'
    this.titleText.textContent = this.title

    // Create a container for centering
    const loadingContainer = document.createElement('div')
    loadingContainer.style.display = 'flex'
    loadingContainer.style.justifyContent = 'center'
    loadingContainer.style.alignItems = 'center'
    loadingContainer.style.height = '100%'
    loadingContainer.style.width = '100%'

    // Create progress bar with limited width
    const loadingBar = document.createElement('div')
    const innerbar = document.createElement('span')
    loadingBar.className = 'progress-indicator'
    loadingBar.style.width = '80%' // Not full width for better appearance
    loadingBar.style.maxWidth = '400px' // Limit maximum width
    innerbar.className = 'progress-indicator-bar'
    innerbar.style.width = '0%'
    loadingBar.appendChild(innerbar)
    
    // Add progress bar to the centering container
    loadingContainer.appendChild(loadingBar)
    
    // Clear content and add the container
    this.contentArea.innerHTML = ''
    this.contentArea.appendChild(loadingContainer)

    // Function to update progress with animation frame
    const updateProgress = (percent) => {
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          innerbar.style.width = `${percent}%`
          setTimeout(resolve, 50)
        })
      })
    }

    try {
      await updateProgress(20)

      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      await updateProgress(40)
      
      const data = await response.text()
      const page = new DOMParser().parseFromString(data, 'text/html')

      await updateProgress(60)

      // Update window content
      this.title = page.querySelector('title')?.textContent || oldTitle
      this.titleText.textContent = this.title
      this.changeTaskbarTitle(this.title)

      // Clear content area first
      this.contentArea.innerHTML = ''

      // Special handling for Doom or other games
      if (url.includes('/doom')) {
        await this.handleGameContent(page)
      } else {
        await this.handleRegularContent(page)
      }

      await updateProgress(100)
      
    } catch (err) {
      console.error('Failed to fetch window contents:', err)
      this.title = oldTitle
      this.contentArea.innerHTML = oldContent
    }
  }

  /**
   * Handle game content (like Doom) with special DOM handling
   * @param {Document} page - The parsed HTML document
   */
  async handleGameContent(page) {
    const body = page.querySelector('body')
    if (!body) return

    // Create a container that preserves the game's expected DOM structure
    const gameContainer = document.createElement('div')
    gameContainer.style.width = '100%'
    gameContainer.style.height = '100%'
    gameContainer.style.position = 'relative'

    // Clone all body children to preserve their structure
    Array.from(body.children).forEach(child => {
      gameContainer.appendChild(child.cloneNode(true))
    })

    // Handle styles first
    const styles = Array.from(page.querySelectorAll('style, link[rel="stylesheet"]'))
    for (const style of styles) {
      if (style.tagName === 'STYLE') {
        gameContainer.appendChild(style.cloneNode(true))
      } else if (style.href) {
        try {
          const response = await fetch(style.href)
          const styleElement = document.createElement('style')
          styleElement.textContent = await response.text()
          gameContainer.appendChild(styleElement)
        } catch (err) {
          console.error('Failed to load stylesheet:', err)
        }
      }
    }

    this.contentArea.appendChild(gameContainer)

    // Handle scripts after DOM is ready
    await this.handleGameScripts(page.querySelectorAll('script'), gameContainer)
  }

  /**
   * Handle scripts for games with proper execution context
   * @param {NodeList} scripts - Script elements from the page
   * @param {HTMLElement} container - Container element
   */
  async handleGameScripts(scripts, container) {
    for (const script of scripts) {
      try {
        const scriptElement = document.createElement('script')
        
        // Copy all attributes
        Array.from(script.attributes).forEach(attr => {
          scriptElement.setAttribute(attr.name, attr.value)
        })

        if (script.src) {
          // For external scripts, load the content
          const response = await fetch(script.src)
          const scriptContent = await response.text()
          scriptElement.textContent = scriptContent
          scriptElement.removeAttribute('src') // Remove src to prevent double loading
        } else {
          // For inline scripts
          scriptElement.textContent = script.textContent
        }

        // Append to the container (not to a separate body element)
        container.appendChild(scriptElement)
        
        // Small delay to ensure script execution order
        await new Promise(resolve => setTimeout(resolve, 10))
        
      } catch (err) {
        console.error('Failed to load script:', err)
      }
    }
  }

  /**
   * Handle regular content (non-games)
   * @param {Document} page - The parsed HTML document
   */
  async handleRegularContent(page) {
    const inbody = page.querySelector('body')
    let body = document.createElement('div')
    
    if (inbody) {
      Array.from(inbody.childNodes).forEach(node => {
        body.appendChild(node.cloneNode(true))
      })
    }

    const scripts = Array.from(page.querySelectorAll('script'))
    const styles = Array.from(page.querySelectorAll('link[rel="stylesheet"]'))

    await this.handleScripts(scripts, body)
    await this.handleStyles(styles, body)

    this.contentArea.innerHTML = body.innerHTML
  }


  /**
   * Emit a signal ''exportIconConfig'' to the environment.
   * @fires Window#exportIconConfig
   */
  exportIconConfig () {
    this.emit('exportIconConfig', this)
  }

  /**
   * Emit a signal 'Change Taskbar Title' to the environment.
    * @fires Window#changeTaskbarTitle
    * 
    * @param {string} title - The new title for the taskbar
   */
  changeTaskbarTitle (title) {
    this.emit('changeTaskbarTitle', {id: this.id, title: this.title})
  }
}

// Export the Window class and WindowConfigtype
export {Window}
export {WindowConfig}