import { Window } from "./Windows/window.js";
/** @import {WindowPositionStrategy} from './Windows/window.js' */
import Popup from "./Windows/timedwindow.js";
import { Icon } from "./Icon.js";
import Taskbar from "./Taskbar.js";

/** @import {WindowConfig} from './Windows/window.js' */
/** @import {IconConfig} from './Icon.js' */
/** @import {TaskbarConfig, TaskbarButtonConfig} from './Taskbar.js'*/

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
  constructor(envconfig = {}) {
    console.log("Environment constructor started!");

    /**@type {number}*/
    this.zIndexBase = envconfig.zIndexBase || 100;

    /**@type {string}*/
    this.background_color = envconfig.styles.background_color || "#FAF9F6";

    /**@type {string}*/
    this.background_image =
      envconfig.styles.background_image || "images/bg.png";

    /** @type {Map<string, Window>} Map of Window ids to their window objects*/
    this.windows = new Map();

    /** @type {Map<string, Icon>} Map of icon titles to their Icon objects*/
    this.icons = new Map();

    /** @type {Map<typeof Window, WindowConfig>} The types of windows that can be created and their defaults.*/
    this.windowTypes = envconfig.windowDefaults || new Map();

    // Page Environment Container
    this.environment = document.createElement("div");
    this.environment.id = "window-environment";
    this.environment.style.cssText = `
      height: 100vh;
      width: 100vw;
      overflow-x: hidden;
      overflow-y: hidden;
      background-color: ${this.background_color};
      background-image: url('${this.background_image}');
      background-size: cover;
    `;

    // Icon container DOM element
    this.iconContainer = document.createElement("div");
    this.iconContainer.id = "icon-container";
    this.iconContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 40px);
      padding-bottom: 40px;
      box-sizing: border-box;
      z-index: ${this.zIndexBase - 1};
      pointer-events: auto;
    `;

    this.environment.appendChild(this.iconContainer);

    // Create the modular Taskbar
    /** @type {Taskbar} */
    this.taskbar = new Taskbar(
      envconfig.taskbarConfig || {
        background_color: "#c0c0c0",
        text_color: "#000",
      },
    );

    // Add default taskbar icons and desktop icons
    this.taskbar.addIcons(envconfig.taskbarItems || []);
    this.addDesktopIcons(envconfig.icons || [], envconfig.iconLoadDelay || 5);

    // Bind methods
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.saveState = this.saveState.bind(this);

    // Global event listeners
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("beforeunload", this.saveState);

    // Append environment to the document
    document.body.appendChild(this.environment);
    // Mount taskbar to the environment container
    this.taskbar.mount(this.environment);

    // Load up the startup windows from config
    if (envconfig.startupWindows) {
      envconfig.startupWindows.forEach((config, title) => {
        if (config.openOnStart) {
          this.newWindow(config?.type | Window, config);
        }
      });
    }
  }

  /**
   * Add taskbar icons/buttons to the taskbar.
   * @param {TaskbarButtonConfig[]} icons - Array of taskbar button configurations
   */
  addTaskbarIcons(icons) {
    this.taskbar.addIcons(icons);
  }

  /**
   * @param {IconConfig | Icon} config - The configuration for the icon to be added.
   * @param {boolean} visible - Whether the icon should be visible or hidden.
   * @returns {Icon} - The created icon
   */
  addIcon(config, visible = true) {
    console.log(
      `Adding icon: ${config.title} of type: ${config.constructor.name}`,
    );
    if (this.icons.has(config.title)) {
      console.warn(
        `Icon with title ${config.title} already exists. Skipping addition.`,
      );
      return this.icons.get(config.title);
    }

    /** @type {Icon} */
    var icon;

    if (!(config instanceof Icon)) {
      console.log("Creating new Icon instance for:", config.title);
      icon = new Icon(
        config.title,
        config.image,
        config.onhover,
        config.clickhandler,
      );
      icon.setPosition(config.x, config.y);
    } else {
      console.log("Using existing Icon instance for:", config.title);
      icon = config;
    }

    this.icons.set(config.title, icon);
    icon.element.style.display = visible ? "block" : "none";
    this.iconContainer.appendChild(icon.element);
    return icon;
  }

  /**
   * Add icons from list to the desktop with a staggered delay.
   * @param {IconConfig[] | Icon[]} configs - Array of icon/configurations to be added.
   * @param {number} delay - Delay in milliseconds between loading each icon.
   * @returns {void}
   */
  addDesktopIcons(configs, delay = 5) {
    /** @type {Icon[]} */
    const iconArray = new Array(configs.length).fill(null);

    if (!Array.isArray(configs) || configs.length === 0) {
      return;
    }

    var index = 0;
    configs.forEach((iconConfig) => {
      const icon = this.addIcon(iconConfig, false);
      iconArray[index] = icon;
      index++;
    });

    index = 0;
    const interval = setInterval(() => {
      const icon = iconArray[index];
      icon.element.style.display = "block";
      index++;
      if (index >= configs.length) {
        clearInterval(interval);
        return;
      }
    }, delay);
  }

  /**
   * Pin a given window to the taskbar.
   * @param {Window} window
   */
  pinWindow(window) {
    this.taskbar.pinWindow(window.id, window.title, () =>
      window.toggleMinimize(),
    );
  }

  /**
   * Destroy a window instance and remove its icon from the taskbar.
   * @param {Window} window
   */
  removeWindow(window) {
    if (!this.windows.has(window.id)) return;

    this.windows.delete(window.id);
    this.environment.removeChild(window.element);

    this.taskbar.unpinWindow(window.id);

    window.destroy();

    // Reset cascade counter when all windows are closed
    if (this.windows.size === 0) {
      Window.resetCascade();
    }

    this.updateZIndices();
    this.saveState();
  }

  /**
   * Check if a window with the same title already exists.
   * @param {WindowConfig} config - window configuration object
   * @returns {Window|null} existing window instance or null
   */
  windowAlreadyExists(config) {
    for (const win of this.windows.values()) {
      console.log(
        `Checking existing window: ${win.title} against new window: ${config.title}`,
      );
      if (win.title.toLowerCase() === config.title.toLocaleLowerCase()) {
        return win;
      }
    }
    return null;
  }

  /**
   * Create a new window and add it to the environment
   * @param {typeof Window} WindowClass - window class/subclass type
   * @param {WindowConfig} config - window configuration object
   * @returns {Window} window instance
   */
  newWindow(WindowClass = Window, config = {}) {
    var existingWin = this.windowAlreadyExists(config);
    if (existingWin && (existingWin.singleInstance || config.singleInstance)) {
      // Single instance window - just restore if minimized
      if (existingWin.minimized) existingWin.toggleMinimize();
      this.bringToFront(existingWin);
      this.saveState();
      return existingWin;
    } else {
      // Cascade only if a window with the same title already exists
      // Otherwise, use the config's position (or default to center)
      const windowConfig = {
        ...config,
        position: existingWin ? "cascade" : config.position || "center",
      };
      var win = this.createWindow(
        crypto.randomUUID(),
        WindowClass,
        windowConfig,
      );
      this.pinWindow(win);
      this.bringToFront(win);
      this.saveState();
      return win;
    }
  }

  /**
   * Factory method for creating windows by passed type.
   * @param {string} id - unique window id
   * @param {WindowConfig} config - window configuration object
   * @param {typeof Window} WindowClass - window class/subclass type
   * @returns {Window} window or window subclass
   */
  createWindow(id, WindowClass = Window, config = {}) {
    if (this.windows.has(id)) {
      console.error(`Window with id ${id} already exists. Skipping creation.`);
      return this.windows.get(id);
    }

    // Check if window class is registered in windowTypes
    if (!this.windowTypes.has(WindowClass.name)) {
      console.log(`>> ${WindowClass.name} class not registered in windowTypes`);

      // Check for window class inheritence
      if (WindowClass.prototype instanceof Window || WindowClass === Window) {
        console.log(
          ">>> Window class is a subclass of Window - Registering new Type",
        );
        this.windowTypes.set(WindowClass, {
          width: config.width || 600,
          height: config.height || 400,
          title: config.title || "",
          icon: config.icon || "",
          styles: config.styles || {},
          events: config.events || {},
          savedstate: config.savedState || {},
        });
      } else {
        console.error(
          ">>>Window class is not a subclass of Window - Using default Window class.",
        );
        WindowClass = Window;
      }
    } else {
      // Merge config with default config - if attributes are missing, use default
      const defaultconfig = this.windowTypes.get(WindowClass.name);
      for (const defaultKey in defaultconfig) {
        config[defaultKey] = config[defaultKey] || defaultconfig[defaultKey];
      }
    }

    const newWindow = new WindowClass(id, config);

    if (config.events) {
      Object.entries(config.events).forEach(([event, handler]) => {
        newWindow.on(event, handler);
      });
    }

    // Set up event listeners
    newWindow.on("close", (win) => this.removeWindow(win));
    newWindow.on("focus", (win) => this.bringToFront(win));
    newWindow.on("dragStart", () => this.startDragging(newWindow));
    newWindow.on("minimize", () => this.saveState());
    newWindow.on("drag", () => this.saveState());
    newWindow.on("dragEnd", () => this.saveState());
    newWindow.on("popup", (data) =>
      this.newWindow(`${crypto.randomUUID()}-${id}`, data, Popup),
    );
    newWindow.on("changeTaskbarTitle", (data) => {
      this.taskbar.updateWindowTitle(data.id, data.title);
    });

    this.windows.set(newWindow.id, newWindow);
    this.environment.appendChild(newWindow.element);
    this.updateZIndices();
    this.saveState();

    return newWindow;
  }

  /**
   * Bring a window to the front of the z-index stack.
   * @param {Window} window
   */
  bringToFront(window) {
    const windowArray = Array.from(this.windows.values());
    const index = windowArray.indexOf(window);
    if (index !== -1) {
      windowArray.splice(index, 1);
      windowArray.push(window);
      this.windows.clear();
      windowArray.forEach((w) => this.windows.set(w.id, w));
      this.updateZIndices();
      this.saveState();
    }
  }

  updateZIndices() {
    let index = 0;
    this.windows.forEach((window) => {
      window.setZIndex(this.zIndexBase + index);
      index++;
    });
  }

  startDragging(window) {
    this.currentlyDragging = window;
    this.bringToFront(window);
  }

  onMouseMove(event) {
    if (this.currentlyDragging) {
      this.currentlyDragging.drag(event);
    }
  }

  onMouseUp(event) {
    if (this.currentlyDragging) {
      this.currentlyDragging.dragEnd(event);
      this.currentlyDragging = null;
    }
  }

  saveState() {
    const state = {
      windows: Array.from(this.windows.values()).map((window) => ({
        ...window.getState(),
        className: window.constructor.name, // Store the class name
      })),
    };
    localStorage.setItem("windowEnvironmentState", JSON.stringify(state));
  }

  clearSavedState() {
    localStorage.removeItem("windowEnvironmentState");
  }
}
