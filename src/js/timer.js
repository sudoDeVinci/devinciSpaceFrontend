// Event emitter for window events
class TimerEventEmitter {
  constructor () {
    this.listeners = {}
  }

  on (event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit (event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }
}

/**
 * A robust timer class for handling countdown functionality.
 */
export default class Timer extends TimerEventEmitter {
  /**
   * @type {number|null} - Timer interval ID
   * @private
   */
  #intervalId = null

  /**
   * @type {number} - Remaining time in milliseconds
   * @private
   */
  #remainingTime = 0

  /**
   * @type {number} - Initial duration in milliseconds (for reset)
   * @private
   */
  #initialDuration = 0

  /**
   * @type {boolean} - Pause state
   * @private
   */
  #isPaused = false

  /**
   * @type {Function|null} - Callback for timer completion
   * @private
   */
  #onComplete = null

  /**
   * @type {Function|null} - Callback for timer reset
   * @private
   */
  #onReset = null

  /**
   * Creates a new Timer instance.
   * @param {object} onComplete - Timer config object.
   * @param {Function} onComplete.onComplete - Callback for timer completion
   * @param {Function} onComplete.onReset - Callback for timer reset
   * @param {string} onComplete.format - Time format ('seconds' or 'minutes')
   */
  constructor ({
    onComplete = null,
    onReset = null,
    format = 'seconds'
  } = {}) {
    super()
    this.#onComplete = onComplete
    this.#onReset = onReset
    this.format = format
  }

  /**
   * Starts the timer.
   * @param {number} duration - Duration in seconds
   * @throws {Error} If duration is invalid or timer is already running
   */
  start (duration) {
    if (!duration || duration <= 0) {
      throw new Error('Duration must be a positive number')
    }
    if (this.#intervalId !== null) {
      throw new Error('Timer is already running')
    }

    this.#initialDuration = duration * 1000
    this.#remainingTime = this.#initialDuration
    this.#isPaused = false

    this.#startInterval()
  }

  /**
   * Stops and resets the timer.
   */
  stop () {
    if (this.#intervalId) {
      clearInterval(this.#intervalId)
      this.#intervalId = null
    }
    this.#remainingTime = 0
    this.#isPaused = false
  }

  /**
   * Resets the timer to its initial duration.
   * @param {boolean} [autostart] - Whether to automatically start the timer after reset
   */
  reset (autostart = false) {
    const wasRunning = this.isRunning()

    if (this.#intervalId) {
      clearInterval(this.#intervalId)
      this.#intervalId = null
    }

    this.#remainingTime = this.#initialDuration
    this.#isPaused = false

    if (this.#onReset) {
      this.#onReset(this.#initialDuration / 1000)
    }

    if (autostart || wasRunning) {
      this.#startInterval()
    }
  }

  /**
   * Pauses the timer.
   */
  pause () {
    if (this.#intervalId && !this.#isPaused) {
      clearInterval(this.#intervalId)
      this.#intervalId = null
      this.#isPaused = true
    }
  }

  /**
   * Resumes the timer from a paused state.
   */
  resume () {
    if (this.#isPaused) {
      this.#isPaused = false
      this.#startInterval()
    }
  }

  /**
   * Gets the remaining time in seconds.
   * @returns {number} Remaining time in seconds
   */
  getTimeRemaining () {
    return Math.ceil(this.#remainingTime / 1000)
  }

  /**
   * Gets the initial duration in seconds.
   * @returns {number} Initial duration in seconds
   */
  getInitialDuration () {
    return this.#initialDuration / 1000
  }

  /**
   * Checks if the timer is currently running.
   * @returns {boolean} True if timer is running
   */
  isRunning () {
    return this.#intervalId !== null && !this.#isPaused
  }

  /**
   * @private
   */
  #startInterval () {
    this.#intervalId = setInterval(() => {
      if (!this.#isPaused) {
        this.#remainingTime = Math.max(0, this.#remainingTime - 100)
        const remainingSeconds = Math.ceil(this.#remainingTime / 1000)

        this.emit('tick', remainingSeconds)

        if (this.#remainingTime <= 0) {
          this.stop()
          if (this.#onComplete) {
            this.#onComplete()
          }
        }
      }
    }, 100)
  }
}
