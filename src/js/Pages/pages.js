/**
 * @typedef {Object} Comment
 * @property {string} uid
 * @property {string} author
 * @property {string} title
 * @property {string} content
 * @property {string} created
 * @property {string} edited
 */

/**
 * @typedef {Object} Blogpost
 * @property {string} uid
 * @property {string} title
 * @property {string} content
 * @property {string} [tags]
 * @property {string} created
 * @property {string} edited
 * @property {Comment} [comments]
 */

class Page {

    /**
     * @param {Blogpost} blogpost
     * @returns {HTMLDivElement} Blogpost preview
     * @description Creates a blogpost preview
     */
    static displayBlogPostPreview(blogpost) {
        const blogpostPreview = document.createElement('div')
        blogpostPreview.classList.add('blogpost-preview')

        const title = document.createElement('h2')
        title.textContent = blogpost.title
        blogpostPreview.appendChild(title)

        const content = document.createElement('div')
        content.classList.add('blogpost-content')
        // Take the first 100 characters of the content
        content.textContent = blogpost.content.slice(0, 100)
        // Add ellipsis if content is longer than 100 characters
        if (blogpost.content.length > 100) {
            content.textContent += '...'
        }
        blogpostPreview.appendChild(content)

        const created = document.createElement('p')
        created.classList.add('blogpost-created')
        created.textContent = `Created: ${blogpost.created}`
        blogpostPreview.appendChild(created)

        const edited = document.createElement('p')
        edited.classList.add('blogpost-edited')
        edited.textContent = `Edited: ${blogpost.edited}`
        blogpostPreview.appendChild(edited)

        return blogpostPreview
    }

    /**
     * @param {Blogpost[]} blogpost
     * @returns {HTMLDivElement} Blogpost preview page
     * @description Creates a blogpost preview page
     */
    static displayBlogPostsPreviews(blogposts) {

    }

    displayBlogPost() {}
}