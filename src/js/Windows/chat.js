import Window from './window.js'

export default class ChatWindow extends Window {
  /**
   *
   * @param {string} id - The uuid of the window.
   * @param {WindowConfig} config - The configuration object for the window.
   */
  constructor (
    id,
    config
  ) {
    config.title = `Chat - ${config.channel}`
    config.content = '<div class="chat-container"></div>'
    super(id, config)

    this.username = config.username || this.getUsername()
    this.channel = config.channel || 'general'
    this.messages = this.loadCachedMessages() || []
    this.setupChatUI()
    this.connectWebSocket()

    setTimeout(() => {
      for (const message of this.messages) {
        if (message.type === 'message') this.displayMessage(message)
      }
    }, 250)

    this.senderColor = config.senderColor || localStorage.getItem('senderColor') || '#e3f2fd'
    this.receiverColor = config.receiverColor || localStorage.getItem('receiverColor') || '#f5f5f5'
    this.addColorPickers()
  }

  /**
   * Return an object containing the array of cached messages from last session.
   * @returns {object} - The cached messages.
   */
  loadCachedMessages () {
    const key = `chat-messages-${this.channel}`
    const cached = localStorage.getItem(key)
    return cached ? JSON.parse(cached) : null
  }

  saveCachedMessages () {
    // Filter out system messages and only keep user messages
    const userMessages = this.messages.filter(message =>
      message.type === 'message' && message.username !== 'System'
    )

    const key = `chat-messages-${this.channel}`
    // Keep last 50 user messages
    localStorage.setItem(key, JSON.stringify(userMessages.slice(-50)))
  }

  addColorPickers () {
    const controls = document.createElement('div')
    controls.className = 'chat-controls'
    controls.innerHTML = `
      <div class="color-pickers">
        <div class="picker-group">
          <label>Your messages:</label>
          <input type="color" id="sender-color" value="${this.senderColor}">
        </div>
        <div class="picker-group">
          <label>Others' messages:</label>
          <input type="color" id="receiver-color" value="${this.receiverColor}">
        </div>
      </div>
    `

    const container = this.contentArea.querySelector('.chat-container')
    container.prepend(controls)

    // Add event listeners
    const senderPicker = controls.querySelector('#sender-color')
    const receiverPicker = controls.querySelector('#receiver-color')

    senderPicker.addEventListener('change', (e) => {
      this.senderColor = e.target.value
      localStorage.setItem('senderColor', this.senderColor)
      this.updateMessageColors()
    })

    receiverPicker.addEventListener('change', (e) => {
      this.receiverColor = e.target.value
      localStorage.setItem('receiverColor', this.receiverColor)
      this.updateMessageColors()
    })
  }

  updateMessageColors () {
    const messages = this.contentArea.querySelectorAll('.chat-message')
    messages.forEach(msg => {
      if (!msg.classList.contains('chat-message')) return

      if (msg.classList.contains('sent')) msg.style.backgroundColor = this.senderColor
      else if (msg.classList.contains('received')) msg.style.backgroundColor = this.receiverColor
      else msg.style.backgroundColor = '#f9f9f9'
    })
  }

  updateMessageUsername (oldname, newname) {
    if (!oldname || !newname) return
    if (oldname === newname) return

    localStorage.setItem('chat-username', newname)
    this.messages.forEach(message => {
      if (message.username === oldname) {
        message.username = newname
      }
    })
    this.saveCachedMessages()

    const messages = this.contentArea.querySelectorAll('.chat-message')
    messages.forEach(msg => {
      if (!msg.classList.contains('chat-message')) return

      const header = msg.querySelector('.message-sender')
      if (header.textContent === oldname) {
        header.textContent = newname
      }
    })
  }

  setupChatUI () {
    const container = this.element.querySelector('.chat-container')
    container.style.cssText = `
      display: flex;
      flex-direction: column;
      max-height: 600px;
      max-width: 100%;
      width:100%;
      overflow-y: auto;
      overflow-x: hidden;
    `

    // Message history container
    this.messageContainer = document.createElement('div')
    this.messageContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 10px;
      background: #f9f9f9;
      margin-bottom: 10px;
      max-height: 350px;
      max-width: 300px;
    `
    container.appendChild(this.messageContainer)

    // Input area
    const inputContainer = document.createElement('div')
    inputContainer.style.cssText = `
      flex: 1;
      padding: 10px;
      border-top: 1px solid #ddd;
      background: white;
    `

    this.messageInput = document.createElement('textarea')
    this.messageInput.style.cssText = `
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: none;
      margin-bottom: 8px;
      max-height: 300px;
      max-width: 250px;
      width: 100%;
    `
    this.messageInput.placeholder = 'Type your message...'
    this.messageInput.rows = 3

    const sendButton = document.createElement('button')
    sendButton.textContent = 'Send'
    sendButton.style.cssText = `
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 0rem;
    `
    sendButton.onclick = () => this.sendMessage()

    this.messageInput.onkeydown = e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        this.sendMessage()
      }
    }

    inputContainer.appendChild(this.messageInput)
    inputContainer.appendChild(sendButton)
    container.appendChild(inputContainer)

    // Add emoji button next to the send button
    const emojiButton = document.createElement('button')
    emojiButton.textContent = '😊'
    emojiButton.style.cssText = `
      padding: 8px 16px;
      margin-right: 8px;
      margin-bottpm: 10px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `

    emojiButton.onclick = () => this.emit('toggleEmojis', this)
    inputContainer.insertBefore(emojiButton, inputContainer.lastChild)

    const changeUsernameButton = document.createElement('button')
    changeUsernameButton.textContent = 'New name'
    changeUsernameButton.style.cssText = `
      padding: 8px 16px;
      margin-right: 8px;
      margin-bottpm: 10px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    `

    changeUsernameButton.onclick = () => this.changeUsername()
    inputContainer.insertBefore(changeUsernameButton, inputContainer.lastChild)

    // Store reference to input for emoji insertion
    this.messageInput = inputContainer.querySelector('textarea')
    container.scrollTop = container.scrollHeight
  }

  parseMessageContent (text) {
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

  displayMessage (message) {
    const messageElement = document.createElement('div')

    let msgcolor = '#f9f9f9'
    if (message.username === this.username) msgcolor = this.senderColor
    else if (message.username === 'System' && message.username === 'The Server') msgcolor = '#f9f9f9'

    messageElement.style.cssText = `
      margin-bottom: 10px;
      padding: 8px;
      border-radius: 4px;
      background: ${
        msgcolor
      };
      border: 1px solid #ddd;
    `

    const header = document.createElement('div')
    header.className = 'message-sender'
    header.style.cssText = `
      padding: 4px 8px;
      max-width: 180px;
      overflow-x: hidden;
      font-weight: bold;
      margin-bottom: 4px;
      color: #666;
    `
    header.textContent = message.username
    messageElement.appendChild(header)

    const content = document.createElement('div')
    const fragments = this.parseMessageContent(message.data)

    fragments.forEach(fragment => {
      const element = document.createElement('div')
      if (fragment.type === 'code') {
        element.style.cssText = `
          font-family: 'Fira Code', monospace;
          font-size: 0.95em;
          line-height: 1.4;
          white-space: pre-wrap;
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 12px;
          border-radius: 6px;
          margin: 8px 0;
          border-left: 4px solid #007acc;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          tab-size: 2;
          -moz-tab-size: 2;
        `
      } else {
        element.style.cssText = `
          margin: 4px 0;
          line-height: 1.5;
          max-width: 215px;
          overflow-x: hidden;
          overflow-wrap: break-word;
        `
      }
      element.textContent = fragment.content
      content.appendChild(element)
    })

    messageElement.className = 'chat-message'
    if (message.username === this.getUsername()) messageElement.classList.add('sent')
    else if (message.username === 'System' || message.username === 'The Server') messageElement.classList.add('system')
    else messageElement.classList.add('received')
    messageElement.appendChild(content)
    this.messageContainer.appendChild(messageElement)
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight
    const container = this.element.querySelector('.chat-container')
    container.scrollTop = container.scrollHeight
  }

  initEmojiSelector () {
    if (!this.emojiSelector) return

    // Position it next to the chat window
    const chatRect = this.element.getBoundingClientRect()
    this.emojiSelector.x = chatRect.right + 10
    this.emojiSelector.y = chatRect.top
    // this.emojiSelector.updatePosition();

    // Handle emoji selection
    this.emojiSelector.on('emojiSelected', ({ emoji }) => {
      // Insert emoji at cursor position or at end
      const input = this.messageInput
      const start = input.selectionStart
      const end = input.selectionEnd
      const text = input.value

      input.value = text.substring(0, start) + emoji + text.substring(end)
      input.focus()
      input.selectionStart = input.selectionEnd = start + emoji.length
    })

    this.emojiSelector.handleResize()
    // this.emojiSelector.emit('focus', this.emojiSelector);
  }

  connectWebSocket () {
    this.ws = new WebSocket('')

    this.ws.onopen = () => {
      this.addSystemMessage('Connecting to chat server')
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'heartbeat') return
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      this.addSystemMessage('Disconnected from chat server')
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 5000)
    }
  }

  addMessage (message) {
    this.messages.push(message)
    if (this.messages.length > 50) {
      this.messages.shift()
    }
    // Only save to cache if it's a user message
    if (message.type === 'message' && message.username !== 'System') {
      this.saveCachedMessages()
    }
    this.displayMessage(message)
  }

  addSystemMessage (text) {
    const message = {
      type: 'system',
      data: text,
      username: 'System'
    }
    this.addMessage(message)
  }

  sendMessage () {
    if (this.ws.readyState !== WebSocket.OPEN) {
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connectWebSocket(), 3000)
    }
    const text = this.messageInput.value.trim()
    if (!text) return

    const message = {
      type: 'message',
      data: text,
      username: this.username,
      channel: this.channel,
      key: ''
    }

    this.ws.send(JSON.stringify(message))
    this.messageInput.value = ''
  }

  changeChannel (channel) {
    this.channel = channel
    this.messages = this.loadCachedMessages() || []
    this.setupChatUI()
    this.addSystemMessage(`Switched to channel: ${channel}`)
    this.connectWebSocket()

    setTimeout(() => {
      for (const message of this.messages) {
        if (message.type === 'message') this.displayMessage(message)
      }
    }, 500)
  }

  destroy () {
    if (this.ws) {
      this.ws.close()
    }
    const uname = this.username
    const newuname = localStorage.getItem('chat-username')
    if (newuname && uname !== newuname) {
      console.log(`name changed from ${uname} to ${newuname}`)
      this.updateMessageUsername(uname, newuname)
    }
    super.destroy()
  }

  getUsername () {
    let username = this.username
    if (!username) username = localStorage.getItem('chat-username')
    if (!username) {
      username = prompt('Please enter your username:')
      if (username) {
        localStorage.setItem('chat-username', username)
      } else {
        username = 'Anonymous-' + Math.floor(Math.random() * 1000)
        localStorage.setItem('chat-username', username)
      }
    }
    this.username = username
    return username
  }

  changeUsername () {
    const oldUsername = this.username
    const newUsername = prompt('Enter new username:')
    if (newUsername && newUsername !== oldUsername) {
      this.updateMessageUsername(oldUsername, newUsername)
    }

    this.username = newUsername
    return newUsername
  }
}
