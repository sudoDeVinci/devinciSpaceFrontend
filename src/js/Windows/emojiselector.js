import {Window, WindowConfig} from './window.js'

export default class EmojiSelector extends Window {
  constructor (id, config) {
    super(id, config)

    // Common emoji categories with sample emojis
    this.categories = {
      Smileys: [
        '😀',
        '😃',
        '😄',
        '😁',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘'
      ],
      Gestures: [
        '👍',
        '👎',
        '👌',
        '✌️',
        '🤞',
        '🤜',
        '🤛',
        '👏',
        '🙌',
        '👐',
        '🤲',
        '🤝',
        '🙏'
      ],
      Heart: [
        '❤️',
        '🧡',
        '💛',
        '💚',
        '💙',
        '💜',
        '🤎',
        '🖤',
        '🤍',
        '💔',
        '❣️',
        '💕',
        '💞',
        '💓',
        '💗',
        '💖'
      ],
      Animals: [
        '🐶',
        '🐱',
        '🐭',
        '🐹',
        '🐰',
        '🦊',
        '🐻',
        '🐼',
        '🐨',
        '🐯',
        '🦁',
        '🐮',
        '🐷',
        '🐸'
      ],
      Food: [
        '🍎',
        '🍐',
        '🍊',
        '🍋',
        '🍌',
        '🍉',
        '🍇',
        '🍓',
        '🍈',
        '🍒',
        '🍑',
        '🥭',
        '🍍',
        '🥥'
      ]
    }

    this.setupUI()
  }

  setupUI () {
    this.element.style.overflowY = 'hidden'
    this.contentArea.style.overflowY = 'hidden'

    const container = document.createElement('div')
    container.style.cssText = `
      padding: 10px;
      height: 100%;
      overflow-y: auto;
    `

    // Create search input
    const searchContainer = document.createElement('div')
    searchContainer.style.cssText = `
      position: sticky;
      top: 0;
      background: white;
      padding: 5px 0;
      margin-bottom: 10px;
      z-index: 1;
    `

    const searchInput = document.createElement('input')
    searchInput.type = 'text'
    searchInput.placeholder = 'Search emojis...'
    searchInput.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      max-width: 325px;
    `

    searchContainer.appendChild(searchInput)
    container.appendChild(searchContainer)

    // Create category containers
    Object.entries(this.categories).forEach(([category, emojis]) => {
      const categoryContainer = document.createElement('div')
      categoryContainer.className = 'emoji-category'
      categoryContainer.style.marginBottom = '20px'

      const categoryTitle = document.createElement('h3')
      categoryTitle.textContent = category
      categoryTitle.style.cssText = `
        margin: 0 0 10px 0;
        color: #666;
        font-size: 14px;
      `

      const emojiGrid = document.createElement('div')
      emojiGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 5px;
      `

      emojis.forEach(emoji => {
        const emojiButton = document.createElement('button')
        emojiButton.textContent = emoji
        emojiButton.style.cssText = `
          font-size: 20px;
          padding: 5px;
          border: 1px solid #eee;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover {
            background-color: #f0f0f0;
          }
        `

        emojiButton.onclick = () => {

          this.emit('emojiSelected', { emoji })
        }

        emojiGrid.appendChild(emojiButton)
      })

      categoryContainer.appendChild(categoryTitle)
      categoryContainer.appendChild(emojiGrid)
      container.appendChild(categoryContainer)
      searchInput.focus()
    })

    // Implement search functionality
    searchInput.oninput = e => {
      const searchTerm = e.target.value.toLowerCase()
      const categoryDivs = container.querySelectorAll('.emoji-category')

      categoryDivs.forEach(categoryDiv => {
        const emojis = categoryDiv.querySelectorAll('button')
        let hasVisibleEmojis = false

        emojis.forEach(emojiButton => {
          const shouldShow = emojiButton.textContent
            .toLowerCase()
            .includes(searchTerm)
          emojiButton.style.display = shouldShow ? 'block' : 'none'
          if (shouldShow) hasVisibleEmojis = true
        })

        categoryDiv.style.display = hasVisibleEmojis ? 'block' : 'none'
      })
    }

    this.contentArea.appendChild(container)
  }
}
