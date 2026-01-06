/**
 * @typedef {Object} TaskbarConfig
 * @property {string} background_color - The background color of the taskbar
 * @property {string} text_color - The text color of the taskbar
 */

/**
 * @typedef {Object} TaskbarButtonConfig
 * @property {string} title - The title of the taskbar button
 * @property {Function} clickhandler - The function to be called when the button is clicked
 * @property {string} [icon] - Optional icon for the button
 */

/**
 * @class Taskbar
 * @public
 * @description A modular taskbar component for desktop-like environments
 */
export default class Taskbar {
  /**
   * The config for the taskbar.
   * @private
   * @type {TaskbarConfig}
   */
  #config;

  /**
   * @public
   * @type {HTMLDivElement} - The main taskbar enclosing element
   */
  element;

  /**
   * @public
   * @type {HTMLButtonElement} - The start button element
   */
  startButton;

  /**
   * @public
   * @type {HTMLDivElement} - The container for the taskbar buttons (pinned items)
   */
  buttonContainer;

  /**
   * @public
   * @type {HTMLDivElement} - Current open windows scrollable container
   */
  scrollContainer;

  /**
   * @public
   * @type {HTMLDivElement} - The notification container for the taskbar
   */
  notificationContainer;

  /**
   * @public
   * @type {HTMLButtonElement} - The left scroll button for the taskbar
   */
  leftScrollButton;

  /**
   * @public
   * @type {HTMLButtonElement} - The right scroll button for the taskbar
   */
  rightScrollButton;

  /**
   * @public
   * @type {HTMLDivElement} - The time display element
   */
  timeDisplay;

  /**
   * @private
   * @type {number|null} - Interval ID for the clock update
   */
  #clockIntervalId = null;

  /**
   * @private
   * @type {Map<string, HTMLButtonElement>} - Map of window IDs to their taskbar buttons
   */
  #windowButtons = new Map();

  /**
   * @param {TaskbarConfig} config - The configuration for the taskbar
   */
  constructor(config = {}) {
    this.#config = config;
    this.#createTaskbarElement();
    this.#createStartButton();
    this.#createButtonContainer();
    this.#createScrollButtons();
    this.#createScrollContainer();
    this.#createNotificationContainer();
    this.#assembleTaskbar();
  }

  /**
   * Gets the background color from config
   * @private
   * @returns {string}
   */
  get #backgroundColor() {
    return this.#config.background_color || "#c0c0c0";
  }

  /**
   * Gets the text color from config
   * @private
   * @returns {string}
   */
  get #textColor() {
    return this.#config.text_color || "#000";
  }

  /**
   * Applies styles to a HTML element.
   * @private
   * @param {HTMLElement} htmlElement
   * @param {object} styles
   */
  #applyStyles(htmlElement, styles = {}) {
    Object.keys(styles).forEach((key) => {
      htmlElement.style[key] = styles[key];
    });
  }

  /**
   * Creates the main taskbar element.
   * @private
   */
  #createTaskbarElement() {
    this.element = document.createElement("div");
    this.element.id = "taskbar";
    this.element.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-width: 100vw;
      display: flex;
      min-height: 30px;
      align-items: center;
      padding: 0 10px;
      z-index: 9998;
      background-color: ${this.#backgroundColor};
      color: ${this.#textColor};
      overflow: hidden;
      cursor: default;
    `;
  }

  /**
   * Creates the start button on the left side of the taskbar.
   * @private
   */
  #createStartButton() {
    this.startButton = document.createElement("button");
    this.startButton.id = "taskbar-start-button";
    this.startButton.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px 8px;
      margin-right: 10px;
      cursor: pointer;
      background: ${this.#backgroundColor};
      border: none;
      box-shadow: rgb(223, 223, 223) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(255, 255, 255) -2px -2px inset, rgb(128, 128, 128) 2px 2px inset;
      height: 25px;
      min-width: 60px;
    `;

    const startIcon = document.createElement("img");
    startIcon.src = "/icons/start.png";
    startIcon.alt = "Start";
    startIcon.style.cssText = `
      height: 20px;
      width: auto;
      margin-right: 4px;
    `;

    const startLabel = document.createElement("span");
    startLabel.textContent = "Start";
    startLabel.style.cssText = `
      font-size: 14px;
      font-weight: bold;
      color: ${this.#textColor};
    `;

    this.startButton.appendChild(startIcon);
    this.startButton.appendChild(startLabel);

    // Add click effect
    this.startButton.addEventListener("mousedown", () => {
      this.startButton.style.boxShadow =
        "rgb(0, 0, 0) -1px -1px inset, rgb(223, 223, 223) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(255, 255, 255) 2px 2px inset";
    });

    this.startButton.addEventListener("mouseup", () => {
      this.startButton.style.boxShadow =
        "rgb(223, 223, 223) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(255, 255, 255) -2px -2px inset, rgb(128, 128, 128) 2px 2px inset";
    });

    this.startButton.addEventListener("mouseleave", () => {
      this.startButton.style.boxShadow =
        "rgb(223, 223, 223) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(255, 255, 255) -2px -2px inset, rgb(128, 128, 128) 2px 2px inset";
    });
  }

  /**
   * Creates the taskbar button container for pinned items.
   * @private
   * @param {object} styles - Additional styles to apply to the button container
   */
  #createButtonContainer(styles = {}) {
    this.buttonContainer = document.createElement("div");
    this.buttonContainer.id = "taskbar-button-container";
    this.buttonContainer.style.cssText = `
      display: flex;
      overflow-x: hidden;
      height: 25px;
      min-width: 2px;
      padding: 2px 5px;
      justify-content: end;
      margin-left: 0px;
      align-items: center;
    `;
    this.#applyStyles(this.buttonContainer, styles);
  }

  /**
   * Creates the scroll buttons for navigating open windows.
   * @private
   */
  #createScrollButtons() {
    // Left scroll button
    this.leftScrollButton = document.createElement("button");
    this.leftScrollButton.id = "taskbar-left-scroll-button";
    this.leftScrollButton.innerHTML = "&#10094;"; // Left chevron
    this.leftScrollButton.style.cssText = `
      left: 0;
      top: 0;
      bottom: 0;
      min-width: 20px;
      background: ${this.#backgroundColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      margin-left: auto;
      margin-right: 5px;
      opacity: 0;
    `;
    this.leftScrollButton.addEventListener("click", () => this.scroll(-200));

    // Right scroll button
    this.rightScrollButton = document.createElement("button");
    this.rightScrollButton.id = "taskbar-right-scroll-button";
    this.rightScrollButton.innerHTML = "&#10095;"; // Right chevron
    this.rightScrollButton.style.cssText = `
      right: 0;
      top: 0;
      bottom: 0;
      width: 12px;
      min-width: 12px;
      background: ${this.#backgroundColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      margin-left: 5px;
      margin-right: auto;
      opacity: 0;
    `;
    this.rightScrollButton.addEventListener("click", () => this.scroll(200));
  }

  /**
   * Creates the scroll container for open window buttons.
   * @private
   */
  #createScrollContainer() {
    this.scrollContainer = document.createElement("div");
    this.scrollContainer.id = "taskbar-scroll-container";
    this.scrollContainer.style.cssText = `
      display: flex;
      overflow-x: hidden;
      flex-grow: 1;
      height: 25px;
      min-width: 0;
      max-width: 40vw;
      box-shadow: rgb(255, 255, 255) -1px -1px inset, rgb(0, 0, 0) 1px 1px inset, rgb(128, 128, 128) -2px -2px inset, rgb(223, 223, 223) 2px 2px inset;
      align-items: center;
      padding: 2px 5px;
    `;
  }

  /**
   * Creates the notification container with clock.
   * @private
   */
  #createNotificationContainer() {
    this.notificationContainer = document.createElement("div");
    this.notificationContainer.id = "notification-container";
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
    `;

    // Create time display
    this.timeDisplay = document.createElement("div");
    this.timeDisplay.id = "taskbar-time";
    this.timeDisplay.style.cssText = `
      font-size: 14px;
      color: rgb(0, 0, 0);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    this.notificationContainer.appendChild(this.timeDisplay);
  }

  /**
   * Assembles all taskbar components in the correct order.
   * @private
   */
  #assembleTaskbar() {
    this.element.appendChild(this.startButton);
    this.element.appendChild(this.buttonContainer);
    this.element.appendChild(this.leftScrollButton);
    this.element.appendChild(this.scrollContainer);
    this.element.appendChild(this.rightScrollButton);
    this.element.appendChild(this.notificationContainer);
  }

  /**
   * Starts the clock update interval.
   * @public
   */
  startClock() {
    // Update immediately
    this.#updateTime();

    // Then update every second
    this.#clockIntervalId = setInterval(() => {
      this.#updateTime();
    }, 1000);
  }

  /**
   * Stops the clock update interval.
   * @public
   */
  stopClock() {
    if (this.#clockIntervalId) {
      clearInterval(this.#clockIntervalId);
      this.#clockIntervalId = null;
    }
  }

  /**
   * Updates the time display.
   * @private
   */
  #updateTime() {
    const now = new Date();
    this.timeDisplay.textContent = now.toLocaleTimeString();
  }

  /**
   * Scrolls the open windows container by a specified amount.
   * @public
   * @param {number} amount - The amount to scroll (positive = right, negative = left)
   */
  scroll(amount) {
    this.scrollContainer.scrollBy({
      left: amount,
      behavior: "smooth",
    });

    // Update scroll button visibility after animation
    setTimeout(() => this.updateScrollButtonVisibility(), 50);
  }

  /**
   * Updates the visibility of scroll buttons based on scroll position.
   * @public
   */
  updateScrollButtonVisibility() {
    const container = this.scrollContainer;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    // Show/hide left button based on scroll position
    this.leftScrollButton.style.opacity = scrollLeft > 0 ? "1" : "0";

    // Show/hide right button if there's more content to scroll
    this.rightScrollButton.style.opacity =
      scrollWidth > clientWidth && scrollLeft + clientWidth < scrollWidth
        ? "1"
        : "0";
  }

  /**
   * Adds multiple taskbar icons/buttons.
   * @public
   * @param {TaskbarButtonConfig[]} icons - Array of taskbar button configurations
   */
  addIcons(icons) {
    icons.forEach((iconConfig) => {
      const taskbarIcon = this.createIcon(iconConfig);
      this.buttonContainer.appendChild(taskbarIcon);
    });
  }

  /**
   * Creates a taskbar icon/button element.
   * @public
   * @param {TaskbarButtonConfig} config - The config for the taskbar icon
   * @returns {HTMLButtonElement} - The created taskbar icon element
   */
  createIcon(config) {
    const { title, clickhandler } = config;

    const taskbarItem = document.createElement("button");
    taskbarItem.id = `taskbar-item-${title.toLowerCase().replace(/\s+/g, "-")}`;
    taskbarItem.className = "taskbar-item";
    taskbarItem.style.cssText = `
      padding: 0 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 1rem;
      white-space: nowrap;
      min-width: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      background: transparent;
      border: none;
      color: inherit;
    `;
    taskbarItem.textContent = title;

    if (clickhandler) {
      taskbarItem.onclick = clickhandler;
    }

    return taskbarItem;
  }

  /**
   * Pins a window to the taskbar (adds it to the scroll container).
   * @public
   * @param {string} windowId - The unique ID of the window
   * @param {string} title - The title to display on the taskbar button
   * @param {Function} onClick - Callback when the taskbar button is clicked
   * @returns {HTMLButtonElement} - The created taskbar button
   */
  pinWindow(windowId, title, onClick) {
    const taskbarItem = document.createElement("button");
    taskbarItem.id = `taskbar-window-${windowId}`;
    taskbarItem.className = `taskbar-item taskbar-item-${windowId}`;
    taskbarItem.style.cssText = `
      padding: 0 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 1rem;
      white-space: nowrap;
      min-width: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      background: transparent;
      border: none;
      color: inherit;
    `;
    taskbarItem.textContent = title;

    if (onClick) {
      taskbarItem.onclick = onClick;
    }

    this.scrollContainer.appendChild(taskbarItem);
    this.#windowButtons.set(windowId, taskbarItem);
    this.updateScrollButtonVisibility();

    return taskbarItem;
  }

  /**
   * Unpins/removes a window from the taskbar.
   * @public
   * @param {string} windowId - The unique ID of the window to remove
   * @returns {boolean} - True if the window was removed, false if not found
   */
  unpinWindow(windowId) {
    const taskbarItem = this.#windowButtons.get(windowId);

    if (!taskbarItem) {
      return false;
    }

    this.scrollContainer.removeChild(taskbarItem);
    this.#windowButtons.delete(windowId);
    this.updateScrollButtonVisibility();

    return true;
  }

  /**
   * Gets a taskbar button for a specific window.
   * @public
   * @param {string} windowId - The unique ID of the window
   * @returns {HTMLButtonElement|undefined} - The taskbar button or undefined
   */
  getWindowButton(windowId) {
    return this.#windowButtons.get(windowId);
  }

  /**
   * Updates the title of a pinned window's taskbar button.
   * @public
   * @param {string} windowId - The unique ID of the window
   * @param {string} newTitle - The new title to display
   * @returns {boolean} - True if updated, false if window not found
   */
  updateWindowTitle(windowId, newTitle) {
    const taskbarItem = this.#windowButtons.get(windowId);

    if (!taskbarItem) {
      return false;
    }

    taskbarItem.textContent = newTitle;
    return true;
  }

  /**
   * Adds content to the notification container.
   * @public
   * @param {HTMLElement} element - The element to add to the notification area
   */
  addNotification(element) {
    // Insert before the time display
    this.notificationContainer.insertBefore(element, this.timeDisplay);
  }

  /**
   * Mounts the taskbar to a parent element.
   * @public
   * @param {HTMLElement} parent - The parent element to append the taskbar to
   */
  mount(parent) {
    parent.appendChild(this.element);
    this.startClock();
    this.updateScrollButtonVisibility();
  }

  /**
   * Unmounts the taskbar from its parent.
   * @public
   */
  unmount() {
    this.stopClock();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  /**
   * Sets the click handler for the start button.
   * @public
   * @param {Function} handler - The function to call when the start button is clicked
   */
  setStartButtonHandler(handler) {
    if (handler && typeof handler === "function") {
      this.startButton.onclick = handler;
    }
  }

  /**
   * Updates the taskbar configuration and re-applies styles.
   * @public
   * @param {Partial<TaskbarConfig>} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    this.#config = { ...this.#config, ...newConfig };

    // Update main element colors
    this.element.style.backgroundColor = this.#backgroundColor;
    this.element.style.color = this.#textColor;

    // Update scroll button backgrounds
    this.leftScrollButton.style.background = this.#backgroundColor;
    this.rightScrollButton.style.background = this.#backgroundColor;
    this.startButton.style.background = this.#backgroundColor;
  }

  /**
   * Destroys the taskbar and cleans up resources.
   * @public
   */
  destroy() {
    this.stopClock();
    this.#windowButtons.clear();

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
